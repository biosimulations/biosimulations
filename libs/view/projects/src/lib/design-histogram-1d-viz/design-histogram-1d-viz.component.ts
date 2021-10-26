import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  SedReport,
  SedDataSet,
  PlotlyDataLayout,
  PlotlyTraceType,
} from '@biosimulations/datamodel/common';
import {
  UriSedDataSetMap,
  UriSetDataSetResultsMap,
  Histogram1DVisualization,
  SedDocumentReports,
} from '@biosimulations/datamodel-view';
import { ViewService } from '@biosimulations/view-service';
import { Observable, map } from 'rxjs';
import { Spec as VegaSpec } from 'vega';
import vegaTemplate from './vega-template.json';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-project-design-histogram-1d-visualization',
  templateUrl: './design-histogram-1d-viz.component.html',
  styleUrls: ['./design-histogram-1d-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignHistogram1DVisualizationComponent implements OnInit {
  @Input()
  visualization!: Histogram1DVisualization;

  @Input()
  simulationRunId!: string;

  @Input()
  sedDocs!: SedDocumentReports[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;

  private dataSetsFormControl!: FormControl;

  private endpoints = new Endpoints();

  constructor(
    private formBuilder: FormBuilder,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'dataSets',
      this.formBuilder.control('', [Validators.minLength(1)]),
    );
    this.dataSetsFormControl = this.formGroup.controls.dataSets as FormControl;
  }

  public setSelectedDataSets(
    type: 'SedDocument' | 'SedReport' | 'SedDataSet',
    sedDocument: SedDocumentReports,
    sedDocumentId: string,
    report?: SedReport,
    reportId?: string,
    dataSet?: SedDataSet,
    dataSetId?: string,
  ): void {
    const formControl = this.dataSetsFormControl;

    const selectedUris = new Set(formControl.value);

    const uri =
      sedDocumentId +
      (reportId ? '/' + reportId : '') +
      (dataSetId ? '/' + dataSetId : '');
    const selected = selectedUris.has(uri);

    if (type === 'SedDocument') {
      sedDocument.outputs.forEach((report: SedReport): void => {
        const reportUri = uri + '/' + report.id;
        if (selected) {
          selectedUris.add(reportUri);
        } else {
          selectedUris.delete(reportUri);
        }

        report.dataSets.forEach((dataSet: SedDataSet): void => {
          const dataSetUri = reportUri + '/' + dataSet.id;
          if (selected) {
            selectedUris.add(dataSetUri);
          } else {
            selectedUris.delete(dataSetUri);
          }
        });
      });
    } else if (type === 'SedReport') {
      if (!selected) {
        selectedUris.delete(sedDocumentId);
      }

      report?.dataSets?.forEach((dataSet: SedDataSet): void => {
        const dataSetUri = uri + '/' + dataSet.id;
        if (selected) {
          selectedUris.add(dataSetUri);
        } else {
          selectedUris.delete(dataSetUri);
        }
      });

      let hasAllReports = true;
      for (const report of sedDocument.outputs) {
        const reportUri = sedDocumentId + '/' + report?.id;
        if (!selectedUris.has(reportUri)) {
          hasAllReports = false;
          break;
        }
      }
      if (hasAllReports) {
        selectedUris.add(sedDocumentId);
      }
    } else {
      if (selected) {
        let hasAllDataSets = true;
        for (const dataSet of report?.dataSets || []) {
          const dataSetUri =
            sedDocumentId + '/' + report?.id + '/' + dataSet.id;
          if (!selectedUris.has(dataSetUri)) {
            hasAllDataSets = false;
            break;
          }
        }
        if (hasAllDataSets) {
          selectedUris.add(sedDocumentId + '/' + (reportId as string));
        }

        let hasAllReports = true;
        for (const report of sedDocument.outputs) {
          const reportUri = sedDocumentId + '/' + report?.id;
          if (!selectedUris.has(reportUri)) {
            hasAllReports = false;
            break;
          }
        }
        if (hasAllReports) {
          selectedUris.add(sedDocumentId);
        }
      } else {
        selectedUris.delete(sedDocumentId + '/' + (reportId as string));
        selectedUris.delete(sedDocumentId);
      }
    }

    formControl.setValue(Array.from(selectedUris));
  }

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout | false> {
    const selectedDataSetUris = this.getSelectedDataSetUris();
    return this.viewService
      .getReportResults(this.simulationRunId, selectedDataSetUris)
      .pipe(
        map(
          (
            uriResultsMap: UriSetDataSetResultsMap,
          ): PlotlyDataLayout | false => {
            let allData: any = [];
            let missingData = false;
            const xAxisTitles: string[] = [];
            for (let selectedUri of selectedDataSetUris) {
              if (selectedUri.startsWith('./')) {
                selectedUri = selectedUri.substring(2);
              }

              const selectedDataSet = this.uriSedDataSetMap?.[selectedUri];
              if (selectedDataSet) {
                const data = uriResultsMap?.[selectedUri];
                if (data) {
                  allData = allData.concat(
                    this.viewService.flattenArray(data.values),
                  );
                  xAxisTitles.push(data.label);
                } else {
                  missingData = true;
                  break;
                }
              }
            }

            const trace = {
              x: allData,
              xaxis: 'x1',
              yaxis: 'y1',
              type: PlotlyTraceType.histogram,
            };

            let xAxisTitle: string | undefined = undefined;
            if (xAxisTitles.length === 1) {
              xAxisTitle = xAxisTitles[0];
            } else if (xAxisTitles.length > 1) {
              xAxisTitle = 'Multiple';
            }

            const dataLayout = {
              data: [trace],
              layout: {
                xaxis1: {
                  anchor: 'x1',
                  title: xAxisTitle,
                  type: 'linear',
                },
                yaxis1: {
                  anchor: 'y1',
                  title: 'Frequency',
                  type: 'linear',
                },
                grid: {
                  rows: 1,
                  columns: 1,
                  pattern: 'independent',
                },
                showlegend: false,
                width: undefined,
                height: undefined,
              },
            } as PlotlyDataLayout;

            if (missingData) {
              return false;
            } else {
              return dataLayout;
            }
          },
        ),
      );
  }

  public exportToVega(): Observable<VegaSpec> {
    const selectedDataSetUris = this.getSelectedDataSetUris();
    return this.viewService
      .getReportResults(this.simulationRunId, selectedDataSetUris)
      .pipe(
        map((uriResultsMap: UriSetDataSetResultsMap): VegaSpec => {
          let vegaDataSets: {
            templateNames: string[];
            sourceName: (iDataSet: number) => string;
            filteredName: (iDataSet: number) => string;
            joinedName?: string;
            joinedTransforms?: any[];
            data: { [outputUri: string]: string[] };
          }[] = [];
          const vega: any = JSON.parse(JSON.stringify(vegaTemplate)) as any;

          const selectedDataSets: { [outputUri: string]: string[] } = {};
          const histogramExtent = [NaN, NaN];
          const xAxisTitles: string[] = [];
          for (let selectedUri of selectedDataSetUris) {
            if (selectedUri.startsWith('./')) {
              selectedUri = selectedUri.substring(2);
            }

            const selectedDataSet = this.uriSedDataSetMap?.[selectedUri];
            if (selectedDataSet) {
              const data = uriResultsMap?.[selectedUri];
              if (data) {
                const uriParts = selectedUri.split('/');
                uriParts.pop();
                const outputUri = uriParts.join('/');
                if (!(outputUri in selectedDataSets)) {
                  selectedDataSets[outputUri] = [];
                }
                selectedDataSets[outputUri].push(data.id);

                const flatData = this.viewService.flattenArray(data.values);
                histogramExtent[0] = isNaN(histogramExtent[0])
                  ? Math.min(...flatData)
                  : Math.min(histogramExtent[0], Math.min(...flatData));
                histogramExtent[1] = isNaN(histogramExtent[1])
                  ? Math.max(...flatData)
                  : Math.max(histogramExtent[1], Math.max(...flatData));

                xAxisTitles.push(data.label);
              }
            }
          }
          vegaDataSets = [
            {
              templateNames: [
                'rawData0',
                'rawData0_filtered',
                'rawData_joined',
              ],
              sourceName: (iDataSet: number): string => `rawData${iDataSet}`,
              filteredName: (iDataSet: number): string =>
                `rawData${iDataSet}_filtered`,
              joinedName: 'rawData_joined',
              data: selectedDataSets,
            },
          ];

          let xAxisTitle: string | undefined = undefined;
          if (xAxisTitles.length === 1) {
            xAxisTitle = xAxisTitles[0];
          } else if (xAxisTitles.length > 1) {
            xAxisTitle = 'Multiple';
          }
          const vegaSignals: { [name: string]: any } = {
            histogramExtent: [
              isNaN(histogramExtent[0]) ? null : histogramExtent[0],
              isNaN(histogramExtent[1]) ? null : histogramExtent[1],
            ],
            xAxisTitle: xAxisTitle,
          };

          // signals
          vega.signals.forEach((signalTemplate: any): void => {
            if (signalTemplate.name in vegaSignals) {
              signalTemplate.value = vegaSignals[signalTemplate.name];
            }
          });

          // data
          vegaDataSets.forEach((vegaDataSet: any): void => {
            // remove template data sets
            for (let iData = vega.data.length - 1; iData >= 0; iData--) {
              if (vegaDataSet.templateNames.includes(vega.data[iData].name)) {
                vega.data.splice(iData, 1);
              }
            }

            // add concrete data sets
            const concreteDataSets: any[] = [];
            const filteredVegaDataSetNames: string[] = [];
            Object.entries(vegaDataSet.data).forEach(
              (outputUriDataSetIds: [string, any], iDataSet: number): void => {
                const outputUri = outputUriDataSetIds[0];
                const outputUriParts = outputUri.split('/');
                const outputId = outputUriParts.pop();
                const sedDocumentLocation = outputUriParts.join('/');
                const dataSetIds = outputUriDataSetIds[1] as string[];

                concreteDataSets.push({
                  name: vegaDataSet.sourceName(iDataSet),
                  sedmlUri: [sedDocumentLocation, outputId],
                  url: this.endpoints.getRunResultsEndpoint(
                    this.simulationRunId,
                    `${sedDocumentLocation}/${outputId}`,
                    true,
                  ),
                  format: {
                    type: 'json',
                    property: 'data',
                  },
                });

                concreteDataSets.push({
                  name: vegaDataSet.filteredName(iDataSet),
                  source: concreteDataSets[concreteDataSets.length - 1].name,
                  transform: [
                    {
                      type: 'filter',
                      expr: `indexof(['${dataSetIds.join(
                        "', '",
                      )}'], datum.id) !== -1`,
                    },
                    {
                      type: 'formula',
                      expr: `'${outputUri}'`,
                      as: 'outputUri',
                    },
                  ],
                });

                filteredVegaDataSetNames.push(
                  concreteDataSets[concreteDataSets.length - 1].name,
                );
              },
            );

            if (vegaDataSet.joinedName) {
              concreteDataSets.push({
                name: vegaDataSet.joinedName,
                source: filteredVegaDataSetNames,
                transform: vegaDataSet.joinedTransforms || [],
              });
            }

            vega.data = concreteDataSets.concat(vega.data);
          });

          // return Vega spec
          return vega;
        }),
      );
  }

  private getSelectedDataSetUris(): string[] {
    return this.dataSetsFormControl.value.filter((uri: string): boolean => {
      return uri in this.uriSedDataSetMap;
    });
  }
}
