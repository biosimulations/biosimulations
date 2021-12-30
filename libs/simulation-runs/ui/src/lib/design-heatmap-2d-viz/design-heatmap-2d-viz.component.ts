import { Component, Input, OnInit } from '@angular/core';
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
  Heatmap2DVisualization,
  SedDocumentReports,
} from '@biosimulations/datamodel-simulation-runs';
import {
  ViewService,
  flattenTaskResults,
  getRepeatedTaskTraceLabel,
} from '@biosimulations/simulation-runs/service';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Spec as VegaSpec } from 'vega';
import vegaTemplate from './vega-template.json';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-project-design-heatmap-2d-visualization',
  templateUrl: './design-heatmap-2d-viz.component.html',
  styleUrls: ['./design-heatmap-2d-viz.component.scss'],
})
export class DesignHeatmap2DVisualizationComponent implements OnInit {
  @Input()
  visualization!: Heatmap2DVisualization;

  @Input()
  simulationRunId!: string;

  @Input()
  sedDocs!: SedDocumentReports[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;

  yDataSetsFormControl!: FormControl;

  private endpoints = new Endpoints();

  constructor(
    private formBuilder: FormBuilder,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'yDataSets',
      this.formBuilder.control([], [Validators.minLength(1)]),
    );
    this.formGroup.setControl('xDataSet', this.formBuilder.control(null));

    this.yDataSetsFormControl = this.formGroup.controls
      .yDataSets as FormControl;
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
    const formControl = this.yDataSetsFormControl;

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
        const reportUri = sedDocumentId + '/' + report.id;
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

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout> {
    const formGroup = this.formGroup;
    const yFormControl = formGroup.controls.yDataSets as FormControl;
    const xFormControl = formGroup.controls.xDataSet as FormControl;
    const selectedYUris = this.getSelectedYDataSetUris();
    const selectedXUri = xFormControl.value;

    const dataSetUris = [...selectedYUris];
    if (selectedXUri) {
      dataSetUris.push(selectedXUri);
    }

    return this.viewService
      .getReportResults(this.simulationRunId, dataSetUris)
      .pipe(
        map((uriResultsMap: UriSetDataSetResultsMap): PlotlyDataLayout => {
          const errors: string[] = [];

          const zData: any[][] = [];
          const yTicks: string[] = [];
          for (let selectedUri of selectedYUris) {
            if (selectedUri.startsWith('./')) {
              selectedUri = selectedUri.substring(2);
            }

            const selectedDataSet = this.uriSedDataSetMap?.[selectedUri];
            if (selectedDataSet) {
              const data = uriResultsMap?.[selectedUri];
              if (data) {
                const flatData = flattenTaskResults([data.values]);
                for (
                  let iTrace = 0;
                  iTrace < flatData.data[0].length;
                  iTrace++
                ) {
                  zData.push(flatData.data[0][iTrace]);
                  yTicks.push(
                    data.label +
                      (flatData.data[0].length > 1
                        ? ` (${getRepeatedTaskTraceLabel(
                            iTrace,
                            flatData.outerShape,
                          )})`
                        : ''),
                  );
                }
              } else {
                errors.push(`Y-data set '${selectedUri}'.`);
              }
            }
          }

          let xTicks: any[] | undefined;
          let xAxisTitle: string | undefined;
          if (selectedXUri) {
            const data = uriResultsMap?.[selectedXUri];
            if (data) {
              xTicks = data.values;
              while (
                Array.isArray(xTicks) &&
                xTicks.length &&
                Array.isArray(xTicks[0])
              ) {
                xTicks = xTicks[0];
              }
              xAxisTitle = data.label;
            } else {
              errors.push(`X-data set '${selectedXUri}'.`);
            }
          }

          zData.reverse();
          yTicks.reverse();

          const trace = {
            z: zData,
            y: yTicks,
            x: xTicks,
            xaxis: 'x1',
            yaxis: 'y1',
            type: PlotlyTraceType.heatmap,
            hoverongaps: false,
          };

          const dataLayout = {
            data: trace.y.length ? [trace] : undefined,
            layout: {
              xaxis1: {
                anchor: 'x1',
                title: xAxisTitle,
                type: 'linear',
              },
              //yaxis1: {
              //  anchor: 'y1',
              //  title: undefined,
              //  type: 'linear',
              //},
              grid: {
                rows: 1,
                columns: 1,
                pattern: 'independent',
              },
              showlegend: false,
              width: undefined,
              height: undefined,
            },
            dataErrors: errors.length > 0 ? errors : undefined,
          } as PlotlyDataLayout;

          return dataLayout;
        }),
        catchError((): Observable<PlotlyDataLayout> => {
          return of({
            dataErrors: [
              'The results of one or more SED-ML reports requested for the plot could not be loaded.',
            ],
          });
        }),
      );
  }

  public exportToVega(): Observable<VegaSpec> {
    const formGroup = this.formGroup;
    const yFormControl = formGroup.controls.yDataSets as FormControl;
    const xFormControl = formGroup.controls.xDataSet as FormControl;
    const selectedYUris = this.getSelectedYDataSetUris();
    let selectedXUri = xFormControl.value;

    const dataSetUris = [...selectedYUris];
    if (selectedXUri) {
      dataSetUris.push(selectedXUri);
    }

    return this.viewService
      .getReportResults(this.simulationRunId, dataSetUris)
      .pipe(
        map((uriResultsMap: UriSetDataSetResultsMap): VegaSpec => {
          if (Object.keys(uriResultsMap).length === 0) {
            throw new Error(
              'The data for the visualization could not be retrieved',
            );
          }

          let vegaDataSets: {
            templateNames: string[];
            sourceName: (iDataSet: number) => string;
            filteredName: (iDataSet: number) => string;
            flattenedName: (iDataSet: number) => string;
            joinedName?: string;
            joinedTransforms?: any[];
            data: { [outputUri: string]: string[] };
          }[] = [];
          const vega = JSON.parse(JSON.stringify(vegaTemplate)) as any;

          // y axis
          let isDataScalar = true;
          const selectedYDataSets: { [outputUri: string]: string[] } = {};
          let flatOuterShape: number[] = [];
          let outerShapeSize = 0;
          for (let selectedUri of selectedYUris) {
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

                if (!(outputUri in selectedYDataSets)) {
                  selectedYDataSets[outputUri] = [];
                }
                selectedYDataSets[outputUri].push(data.id);

                const flatData = flattenTaskResults([data.values]);
                flatOuterShape = flatData.outerShape;
                outerShapeSize = flatData.data[0].length;

                if (flatData.data[0].length && flatData.data[0][0].length > 1) {
                  isDataScalar = false;
                }
              }
            }
          }

          // x axis
          let xAxisTitle: string;
          let selectedXOutputUri: string;
          let selectedXDataSetId: string;
          if (selectedXUri) {
            if (selectedXUri.startsWith('./')) {
              selectedXUri = selectedXUri.substring(2);
            }
            const data = uriResultsMap?.[selectedXUri];

            const uriParts = selectedXUri.split('/');
            uriParts.pop();
            selectedXOutputUri = uriParts.join('/');

            selectedXDataSetId = data.id;
            xAxisTitle = data.label;
          } else {
            selectedXOutputUri = Object.keys(selectedYDataSets)[0];
            selectedXDataSetId = selectedYDataSets[selectedXOutputUri][0];
            xAxisTitle = 'Index';
          }
          const selectedXDataSet: { [outputUri: string]: string[] } = {};
          selectedXDataSet[selectedXOutputUri] = [selectedXDataSetId];

          vegaDataSets = [
            {
              templateNames: [
                'rawHeatmapData0',
                'rawHeatmapData0_filtered',
                'rawHeatmapData0_initial_flattened',
                'rawHeatmapData_joined',
              ],
              sourceName: (iDataSet: number): string =>
                `rawHeatmapData${iDataSet}`,
              filteredName: (iDataSet: number): string =>
                `rawHeatmapData${iDataSet}_filtered`,
              flattenedName: (iDataSet: number): string =>
                `rawHeatmapData${iDataSet}_initial_flattened`,
              joinedName: 'rawHeatmapData_joined',
              data: selectedYDataSets,
            },
            {
              templateNames: ['rawXData', 'rawXData_filtered'],
              sourceName: (iDataSet: number): string => `rawXData`,
              filteredName: (iDataSet: number): string => `rawXData_filtered`,
              flattenedName: (iDataSet: number): string =>
                `rawXData_initial_flattened`,
              data: selectedXDataSet,
            },
          ];

          // signals
          const vegaSignals: { [name: string]: any } = {
            ordinalXScale: !selectedXUri,
            xAxisTitle: xAxisTitle,
          };

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
            const flattenedVegaDataSetNames: string[] = [];
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
                    true,
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

                const flatDataSet: any = {
                  name: vegaDataSet.flattenedName(iDataSet),
                  source: concreteDataSets[concreteDataSets.length - 1].name,
                  transform: [],
                };

                const iterationSubTaskIndices: string[] = [];
                for (
                  let iIterationSubTask = 0;
                  iIterationSubTask < flatOuterShape.length;
                  iIterationSubTask += 2
                ) {
                  const iterationIndex = `iteration${iIterationSubTask / 2}`;
                  const subtaskIndex = `subtask${iIterationSubTask / 2}`;
                  flatDataSet.transform.push({
                    type: 'flatten',
                    fields: ['values'],
                    index: iterationIndex,
                  });
                  flatDataSet.transform.push({
                    type: 'flatten',
                    fields: ['values'],
                    index: subtaskIndex,
                  });
                  iterationSubTaskIndices.push(
                    `toString(datum.${iterationIndex} + 1)`,
                  );
                  iterationSubTaskIndices.push(
                    `toString(datum.${subtaskIndex} + 1)`,
                  );

                  if (vegaDataSet.templateNames[0] === 'rawXData') {
                    flatDataSet.transform.push({
                      type: 'filter',
                      expr: `datum.${iterationIndex} == 0 && datum.${subtaskIndex} == 0`,
                    });
                  }
                }

                flatDataSet.transform.push({
                  type: 'formula',
                  expr: `[${iterationSubTaskIndices.join(', ')}]`,
                  as: 'iterationSubTaskIndices',
                });

                flatDataSet.transform.push({
                  type: 'formula',
                  expr:
                    outerShapeSize > 1
                      ? `' ' + join(datum.iterationSubTaskIndices, '-')`
                      : `''`,
                  as: 'iterationSubTaskLabel',
                });

                flatDataSet.transform.push({
                  type: 'formula',
                  expr: 'datum.label + datum.iterationSubTaskLabel',
                  as: 'label',
                });

                concreteDataSets.push(flatDataSet);

                flattenedVegaDataSetNames.push(
                  concreteDataSets[concreteDataSets.length - 1].name,
                );
              },
            );

            if (vegaDataSet.joinedName) {
              concreteDataSets.push({
                name: vegaDataSet.joinedName,
                source: flattenedVegaDataSetNames,
                transform: vegaDataSet.joinedTransforms || [],
              });
            }

            vega.data = concreteDataSets.concat(vega.data);
          });

          // scales
          if (isDataScalar) {
            for (const signal of vega.signals) {
              if (signal.name === 'xScaleTickCount') {
                signal.value = 0;
                break;
              }
            }

            for (const scale of vega.scales) {
              if (scale.name === 'xScale') {
                scale.type = 'quantize';
                break;
              }
            }

            for (const data of vega.data) {
              if (data.name === 'rawXData_diffed') {
                data.transform[0].filter = 'true';
                data.transform[2].expr = '-1';
                data.transform[3].expr = '1';
                break;
              }
            }
          }

          // return Vega spec
          return vega;
        }),
      );
  }

  private getSelectedYDataSetUris(): string[] {
    return this.yDataSetsFormControl.value.filter((uri: string): boolean => {
      return uri in this.uriSedDataSetMap;
    });
  }
}
