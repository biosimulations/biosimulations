import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  PlotlyDataLayout,
  PlotlyTraceType,
  PlotlyAxisType,
  PlotlyTraceMode,
  PlotlyTrace,
} from '@biosimulations/datamodel/common';
import {
  UriSedDataSetMap,
  UriSetDataSetResultsMap,
  Line2DVisualization,
  SedDocumentReports,
} from '@biosimulations/datamodel-simulation-runs';
import { ViewService, flattenTaskResults, getRepeatedTaskTraceLabel } from '@biosimulations/simulation-runs/service';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Spec as VegaSpec } from 'vega';
import vegaTemplate from './vega-template.json';
import { Endpoints } from '@biosimulations/config/common';

interface AxisLabelType {
  label: string;
  type: PlotlyAxisType;
}

const AXIS_LABEL_TYPES: AxisLabelType[] = [
  {
    label: 'Linear',
    type: PlotlyAxisType.linear,
  },
  {
    label: 'Logarithmic',
    type: PlotlyAxisType.log,
  },
];

interface TraceModeLabel {
  label: string;
  mode: PlotlyTraceMode;
}

const TRACE_MODE_LABELS: TraceModeLabel[] = [
  {
    label: 'Line',
    mode: PlotlyTraceMode.lines,
  },
  {
    label: 'Scatter',
    mode: PlotlyTraceMode.markers,
  },
];

@Component({
  selector: 'biosimulations-project-design-line-2d-visualization',
  templateUrl: './design-line-2d-viz.component.html',
  styleUrls: ['./design-line-2d-viz.component.scss'],
})
export class DesignLine2DVisualizationComponent implements OnInit {
  @Input()
  visualization!: Line2DVisualization;

  @Input()
  simulationRunId!: string;

  @Input()
  sedDocs!: SedDocumentReports[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: UntypedFormGroup;

  curvesFormGroups!: UntypedFormGroup[];

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  traceModeLabels: TraceModeLabel[] = TRACE_MODE_LABELS;

  private endpoints = new Endpoints();

  constructor(private formBuilder: UntypedFormBuilder, private viewService: ViewService) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'numCurves',
      this.formBuilder.control(1, [Validators.required, Validators.min(1), this.integerValidator]),
    );
    this.formGroup.setControl('curves', this.formBuilder.array([], [Validators.minLength(1)]));
    this.formGroup.setControl('xAxisType', this.formBuilder.control(PlotlyAxisType.linear, [Validators.required]));
    this.formGroup.setControl('yAxisType', this.formBuilder.control(PlotlyAxisType.linear, [Validators.required]));
    this.formGroup.setControl('traceMode', this.formBuilder.control(PlotlyTraceMode.lines, [Validators.required]));

    this.curvesFormGroups = (this.formGroup.controls.curves as UntypedFormArray).controls as UntypedFormGroup[];

    this.setNumCurves();
  }

  public setNumCurves(): void {
    const numCurves = Math.round(this.formGroup.value.numCurves);
    const curvesFormArray = this.formGroup.controls.curves as UntypedFormArray;

    while (curvesFormArray.length > numCurves) {
      curvesFormArray.removeAt(curvesFormArray.length - 1);
    }

    while (curvesFormArray.length < numCurves) {
      const curve = this.formBuilder.group({
        name: [null],
        xData: [[], [Validators.required]],
        yData: [[], [Validators.required]],
      });
      curvesFormArray.push(curve);
    }
  }

  public clearAllSelections(): void {
    this.curvesFormGroups.forEach((curveFormGroup) => {
      /*curveFormGroup.get('xData')?.setValue([]);
      curveFormGroup.get('yData')?.setValue([]);
      curveFormGroup.get('name')?.reset();*/
      this.clearSelectionData('xData');
      this.clearSelectionData('yData');
      this.clearSelectionData('name');
    });
  }

  public clearSelectionData(controlName: string): void {
    this.curvesFormGroups.forEach((curveFormGroup) => {
      if (controlName.includes('name')) {
        return curveFormGroup.get(controlName)?.reset();
      } else {
        return curveFormGroup.get(controlName)?.setValue([]);
      }
    });
  }

  private integerValidator(control: UntypedFormControl): ValidationErrors | null {
    if (control.value && control.value != Math.round(control.value)) {
      return {
        integer: true,
      };
    } else {
      return null;
    }
  }

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout> {
    let dataSetUris: string[] = [];
    this.curvesFormGroups.forEach((curve: UntypedFormGroup): void => {
      dataSetUris = dataSetUris.concat((curve.controls.xData as UntypedFormControl).value);
      dataSetUris = dataSetUris.concat((curve.controls.yData as UntypedFormControl).value);
    });

    return this.viewService.getReportResults(this.simulationRunId, dataSetUris).pipe(
      map((uriResultsMap: UriSetDataSetResultsMap): PlotlyDataLayout => {
        const formGroup = this.formGroup;
        const traceMode = (formGroup.controls.traceMode as UntypedFormControl).value;

        const traces: PlotlyTrace[] = [];
        const xAxisTitlesSet = new Set<string>();
        const yAxisTitlesSet = new Set<string>();
        const errors: string[] = [];

        for (let iCurve = 0; iCurve < this.curvesFormGroups.length; iCurve++) {
          const curve = this.curvesFormGroups[iCurve];
          for (const xDataUri of (curve.controls.xData as UntypedFormControl).value) {
            for (const yDataUri of (curve.controls.yData as UntypedFormControl).value) {
              const xDataSet = this.uriSedDataSetMap[xDataUri];
              const yDataSet = this.uriSedDataSetMap[yDataUri];
              const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
              const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;
              let name!: string;
              if ((curve.controls.name as UntypedFormControl).value) {
                name = (curve.controls.name as UntypedFormControl).value;

                const attributes = [];
                if ((curve.controls.xData as UntypedFormControl).value.length > 1) {
                  attributes.push(`x: ${xLabel}`);
                }
                if ((curve.controls.yData as UntypedFormControl).value.length > 1) {
                  attributes.push(`y: ${yLabel}`);
                }

                if (attributes.length) {
                  name += ` (${attributes.join(', ')})`;
                }
              } else {
                name = `${yLabel} vs ${xLabel}`;
              }

              const xData = uriResultsMap?.[xDataUri]?.values;
              const yData = uriResultsMap?.[yDataUri]?.values;

              if (xData && yData) {
                const flatData = flattenTaskResults([xData, yData]);
                for (let iTrace = 0; iTrace < flatData.data[0].length; iTrace++) {
                  traces.push({
                    name:
                      name +
                      (flatData.data[0].length > 1
                        ? ` (${getRepeatedTaskTraceLabel(iTrace, flatData.outerShape)})`
                        : ''),
                    x: flatData.data[0][iTrace],
                    y: flatData.data[1][iTrace],
                    xaxis: 'x1',
                    yaxis: 'y1',
                    type: PlotlyTraceType.scatter,
                    mode: traceMode,
                  });
                }
                xAxisTitlesSet.add(xLabel);
                yAxisTitlesSet.add(yLabel);
              } else if (xDataUri && yDataUri) {
                errors.push(`Curve '${iCurve + 1}' of '${xDataUri}' and '${yDataUri}'.`);
              }
            }
          }
        }

        const xAxisTitlesArr = Array.from(xAxisTitlesSet);
        const yAxisTitlesArr = Array.from(yAxisTitlesSet);

        let xAxisTitle: string | undefined;
        let yAxisTitle: string | undefined;

        if (xAxisTitlesArr.length === 1) {
          xAxisTitle = xAxisTitlesArr[0];
        } else if (xAxisTitlesArr.length > 1) {
          xAxisTitle = 'Multiple';
        }

        if (yAxisTitlesArr.length === 1) {
          yAxisTitle = yAxisTitlesArr[0];
        } else if (yAxisTitlesArr.length > 1) {
          yAxisTitle = 'Multiple';
        }

        const dataLayout: PlotlyDataLayout = {
          data: traces.length ? traces : undefined,
          layout: {
            xaxis1: {
              anchor: 'x1',
              title: xAxisTitle,
              type: (formGroup.controls.xAxisType as UntypedFormControl).value,
            },
            yaxis1: {
              anchor: 'y1',
              title: yAxisTitle,
              type: (formGroup.controls.yAxisType as UntypedFormControl).value,
            },
            grid: {
              rows: 1,
              columns: 1,
              pattern: 'independent',
            },
            showlegend: traces.length > 1,
            width: undefined,
            height: undefined,
          },
          dataErrors: errors.length > 0 ? errors : undefined,
        };

        return dataLayout;
      }),
      catchError((): Observable<PlotlyDataLayout> => {
        return of({
          dataErrors: ['The results of one or more SED-ML reports requested for the plot could not be loaded.'],
        });
      }),
    );
  }

  public exportToVega(): Observable<VegaSpec> {
    let dataSetUris: string[] = [];
    this.curvesFormGroups.forEach((curve: UntypedFormGroup): void => {
      dataSetUris = dataSetUris.concat((curve.controls.xData as UntypedFormControl).value);
      dataSetUris = dataSetUris.concat((curve.controls.yData as UntypedFormControl).value);
    });

    return this.viewService.getReportResults(this.simulationRunId, dataSetUris).pipe(
      map((uriResultsMap: UriSetDataSetResultsMap): VegaSpec => {
        if (Object.keys(uriResultsMap).length === 0) {
          throw new Error('The data for the visualization could not be retrieved');
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
        const formGroup = this.formGroup;
        const vega = JSON.parse(JSON.stringify(vegaTemplate)) as any;

        // data sets
        const selectedDataSets: { [outputUri: string]: any[] } = {};
        const curveFilters: string[] = [];
        const xAxisTitlesSet = new Set<string>();
        const yAxisTitlesSet = new Set<string>();
        let flatOuterShape: number[] = [];
        let outerShapeSize = 0;

        for (const curve of this.curvesFormGroups) {
          for (const xDataUri of (curve.controls.xData as UntypedFormControl).value) {
            for (const yDataUri of (curve.controls.yData as UntypedFormControl).value) {
              if (uriResultsMap && xDataUri in uriResultsMap && yDataUri in uriResultsMap) {
                const xDataSet = this.uriSedDataSetMap[xDataUri];
                const yDataSet = this.uriSedDataSetMap[yDataUri];
                const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
                const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;

                const xDataUriParts = xDataUri.split('/');
                const yDataUriParts = yDataUri.split('/');
                const xOutputUri = xDataUriParts.slice(0, xDataUriParts.length - 1).join('/');
                const yOutputUri = yDataUriParts.slice(0, yDataUriParts.length - 1).join('/');

                if (!(xOutputUri in selectedDataSets)) {
                  selectedDataSets[xOutputUri] = [];
                }
                if (!(yOutputUri in selectedDataSets)) {
                  selectedDataSets[yOutputUri] = [];
                }
                selectedDataSets[xOutputUri].push(xDataUriParts[xDataUriParts.length - 1]);
                selectedDataSets[yOutputUri].push(yDataUriParts[yDataUriParts.length - 1]);

                const conditions = [
                  `datum.X.outputUri === '${xOutputUri}'`,
                  `datum.X.id == '${xDataSet.id}'`,
                  `datum.Y.outputUri === '${yOutputUri}'`,
                  `datum.Y.id == '${yDataSet.id}'`,
                ];
                curveFilters.push(`(${conditions.join(' && ')})`);
                xAxisTitlesSet.add(xLabel);
                yAxisTitlesSet.add(yLabel);

                const xData = uriResultsMap?.[xDataUri]?.values;
                const flatData = flattenTaskResults([xData]);
                flatOuterShape = flatData.outerShape;
                outerShapeSize = flatData.data[0].length;
              }
            }
          }
        }

        const xAxisTitlesArr = Array.from(xAxisTitlesSet);
        const yAxisTitlesArr = Array.from(yAxisTitlesSet);
        let xAxisTitle: string | null = null;
        let yAxisTitle: string | null = null;
        let singleXAxis = false;
        let singleYAxis = false;

        if (xAxisTitlesArr.length === 1) {
          singleXAxis = true;
          xAxisTitle = xAxisTitlesArr[0];
        } else if (xAxisTitlesArr.length > 1) {
          xAxisTitle = 'Multiple';
        }

        if (yAxisTitlesArr.length === 1) {
          singleYAxis = true;
          yAxisTitle = yAxisTitlesArr[0];
        } else if (yAxisTitlesArr.length > 1) {
          yAxisTitle = 'Multiple';
        }

        vegaDataSets = [
          {
            templateNames: ['rawData0', 'rawData0_filtered', 'rawData0_flattened', 'rawData_joined'],
            sourceName: (iDataSet: number): string => `rawData${iDataSet}`,
            filteredName: (iDataSet: number): string => `rawData${iDataSet}_filtered`,
            flattenedName: (iDataSet: number): string => `rawData${iDataSet}_flattened`,
            joinedName: 'rawData_joined',
            joinedTransforms: [
              {
                type: 'cross',
                as: ['X', 'Y'],
                filter: `(${curveFilters.join(
                  '||',
                )}) && datum.X.iterationSubTaskLabel == datum.Y.iterationSubTaskLabel`,
              },
            ],
            data: selectedDataSets,
          },
        ];

        //signals
        const traceMode = (formGroup.controls.traceMode as UntypedFormControl).value;
        const vegaSignals: { [name: string]: any } = {
          singleXAxis: singleXAxis,
          singleYAxis: singleYAxis,
          xAxisTitle: xAxisTitle,
          yAxisTitle: yAxisTitle,
          style: traceMode,
        };

        // other properties
        const vegaScales: {
          name: string;
          attributes: { [key: string]: any };
        }[] = [
          {
            name: 'xScale',
            attributes: {
              type: (formGroup.controls.xAxisType as UntypedFormControl).value,
            },
          },
          {
            name: 'yScale',
            attributes: {
              type: (formGroup.controls.yAxisType as UntypedFormControl).value,
            },
          },
        ];

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
          Object.entries(vegaDataSet.data).forEach((outputUriDataSetIds: [string, any], iDataSet: number): void => {
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
                  expr: `indexof(['${dataSetIds.join("', '")}'], datum.id) !== -1`,
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
            for (let iIterationSubTask = 0; iIterationSubTask < flatOuterShape.length; iIterationSubTask += 2) {
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
              iterationSubTaskIndices.push(`toString(datum.${iterationIndex} + 1)`);
              iterationSubTaskIndices.push(`toString(datum.${subtaskIndex} + 1)`);
            }

            flatDataSet.transform.push({
              type: 'formula',
              expr: `[${iterationSubTaskIndices.join(', ')}]`,
              as: 'iterationSubTaskIndices',
            });

            flatDataSet.transform.push({
              type: 'formula',
              expr: outerShapeSize > 1 ? `' ' + join(datum.iterationSubTaskIndices, '-')` : `''`,
              as: 'iterationSubTaskLabel',
            });

            flatDataSet.transform.push({
              type: 'formula',
              expr: 'datum.label + datum.iterationSubTaskLabel',
              as: 'fullLabel',
            });

            concreteDataSets.push(flatDataSet);

            filteredVegaDataSetNames.push(concreteDataSets[concreteDataSets.length - 1].name);
          });

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
              Object.entries(vegaScale.attributes).forEach((keyVal: [string, any]): void => {
                scale[keyVal[0]] = keyVal[1];
              });
              break;
            }
          }
        });

        // return Vega spec
        return vega;
      }),
    );
  }
}
