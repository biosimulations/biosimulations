import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  SedDocumentReportsCombineArchiveContent,
  SedReport,
  SedDataSet,
  PlotlyDataLayout,
  PlotlyTraceType,
} from '@biosimulations/datamodel/common';
import { ProjectsService } from '@biosimulations/shared/project-service';
import { UriSedDataSetMap, Histogram1DVisualization } from '@biosimulations/datamodel/view-simulation';
import { Observable, combineLatest, map } from 'rxjs';

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
  combineArchiveSedDocs!: SedDocumentReportsCombineArchiveContent[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;

  dataSetsFormControl!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'dataSets',
      this.formBuilder.control('', [Validators.minLength(1)]),
    );
    this.dataSetsFormControl = this.formGroup.controls
      .dataSets as FormControl;
  }

  public setSelectedDataSets(
    formControl: FormControl,
    type: 'SedDocument' | 'SedReport' | 'SedDataSet',
    sedDocument: SedDocumentReportsCombineArchiveContent,
    sedDocumentId: string,
    report?: SedReport,
    reportId?: string,
    dataSet?: SedDataSet,
    dataSetId?: string,
  ): void {
    // const formControl = this.formGroup.controls.dataSets as FormControl;
    sedDocument = sedDocument as SedDocumentReportsCombineArchiveContent;

    const selectedUris = new Set(formControl.value);

    const uri =
      sedDocumentId +
      (reportId ? '/' + reportId : '') +
      (dataSetId ? '/' + dataSetId : '');
    const selected = selectedUris.has(uri);

    if (type === 'SedDocument') {
      sedDocument.location.value.outputs.forEach((report: SedReport): void => {
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

      (report as SedReport).dataSets.forEach((dataSet: SedDataSet): void => {
        const dataSetUri = uri + '/' + dataSet.id;
        if (selected) {
          selectedUris.add(dataSetUri);
        } else {
          selectedUris.delete(dataSetUri);
        }
      });

      let hasAllReports = true;
      for (const report of sedDocument.location.value.outputs) {
        const reportUri = sedDocumentId + '/' + (report as SedReport).id;
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
        for (const dataSet of (report as SedReport).dataSets) {
          const dataSetUri =
            sedDocumentId + '/' + (report as SedReport).id + '/' + dataSet.id;
          if (!selectedUris.has(dataSetUri)) {
            hasAllDataSets = false;
            break;
          }
        }
        if (hasAllDataSets) {
          selectedUris.add(sedDocumentId + '/' + (reportId as string));
        }

        let hasAllReports = true;
        for (const report of sedDocument.location.value.outputs) {
          const reportUri = sedDocumentId + '/' + (report as SedReport).id;
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

  public buildVisualization(): void {
    const selectedUris = this.dataSetsFormControl.value;

    const reportUris = new Set<string>();
    const reportObs: Observable<any>[] = [];
    for (let selectedUri of selectedUris) {
      if (selectedUri.startsWith('./')) {
        selectedUri = selectedUri.substring(2);
      }
      const uriParts = selectedUri.split('/');
      uriParts.pop();
      const reportUri = uriParts.join('/');
      if (!reportUris.has(reportUri)) {
        reportUris.add(reportUri);
        reportObs.push(this.projectsService.getSimulationRunResults(this.simulationRunId, reportUri, true));
      }
    }

    this.visualization.dataLayout = combineLatest(...reportObs).pipe(
      map((reportResults: any[]): PlotlyDataLayout | false => {      
        const uriResultsMap: any = {};
        reportResults.forEach((reportResult: any): void => {
          reportResult.data.forEach((datum: any): void => {
            let outputId = reportResult.outputId;
            if (outputId.startsWith('./')) {
              outputId = outputId.substring(2);
            }
            uriResultsMap[`${outputId}/${datum.id}`] = datum;
          });          
        });

        let allData: any = [];
        let missingData = false;
        const xAxisTitles: string[] = [];
        for (let selectedUri of selectedUris) {
          if (selectedUri.startsWith('./')) {
            selectedUri = selectedUri.substring(2);
          }

          const selectedDataSet = this.uriSedDataSetMap?.[selectedUri];
          if (selectedDataSet) {
            const data = uriResultsMap?.[selectedUri];
            if (data) {
              allData = allData.concat(this.flattenArray(data.values));
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
      })
    );
  }

  private flattenArray(nestedArray: any[]): any[] {
    const flattenedArray: any[] = [];
    const toFlatten = [...nestedArray];
    while (toFlatten.length) {
      const el = toFlatten.pop();
      if (Array.isArray(el)) {
        toFlatten.push(el);
      } else {
        flattenedArray.push(el);
      }
    }
    return flattenedArray;
  }

  /*
  exportUserViz(format: 'vega' | 'combine'): void {
    this.selectedVisualization;

    let vega: any;
    let vegaDataSets: {
      templateNames: string[];
      sourceName: (iDataSet: number) => string;
      filteredName: (iDataSet: number) => string;
      joinedName?: string;
      joinedTransforms?: any[];
      data: { [outputUri: string]: string[] };
    }[] = [];
    let vegaSignals: { [name: string]: any } = {};
    let vegaScales: { name: string; attributes: { [key: string]: any } }[] = [];
    
    const formControl = this.formGroup.controls.dataSets as FormControl;
    const selectedUris = formControl.value;
    vega = JSON.parse(JSON.stringify(userHistogram1DVegaTemplate)) as any;

    const selectedDataSets: { [outputUri: string]: string[] } = {};
    const histogramExtent = [NaN, NaN];
    const xAxisTitles: string[] = [];
    for (let selectedUri of selectedUris) {
      if (selectedUri.startsWith('./')) {
        selectedUri = selectedUri.substring(2);
      }

      const selectedDataSet =
        this.uriSedDataSetMap?.[selectedUri];
      if (selectedDataSet) {
        const data = (this.userSimulationResults as SedDatasetResultsMap)?.[
          selectedUri
        ];
        if (data) {
          const outputUri = data.location + '/' + data.outputId;
          if (!(outputUri in selectedDataSets)) {
            selectedDataSets[outputUri] = [];
          }
          selectedDataSets[outputUri].push(data.id);

          const flatData = this.flattenArray(data.values);
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
        templateNames: ['rawData0', 'rawData0_filtered', 'rawData_joined'],
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
    vegaSignals = {
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

    // scales
    vegaScales.forEach((vegaScale): void => {
      for (const scale of vega.scales) {
        if (scale.name === vegaScale.name) {
          Object.entries(vegaScale.attributes).forEach(
            (keyVal: [string, any]): void => {
              scale[keyVal[0]] = keyVal[1];
            },
          );
          break;
        }
      }
    });
  }
  */
}
