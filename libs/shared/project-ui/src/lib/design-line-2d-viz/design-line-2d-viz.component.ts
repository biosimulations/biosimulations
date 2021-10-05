import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  SedDocumentSpecifications,
  PlotlyDataLayout,
  PlotlyTraceType,
  PlotlyAxisType,
  PlotlyTraceMode,
} from '@biosimulations/datamodel/common';
import {
  UriSedDataSetMap,
  UriSetDataSetResultsMap,
  Line2DVisualization,
} from '@biosimulations/datamodel/project';
import { ViewService } from '@biosimulations/shared/project-service';
import { Observable, map } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignLine2DVisualizationComponent implements OnInit {
  @Input()
  visualization!: Line2DVisualization;

  @Input()
  simulationRunId!: string;

  @Input()
  sedDocs!: SedDocumentSpecifications[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;

  curvesFormGroups!: FormGroup[];

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  traceModeLabels: TraceModeLabel[] = TRACE_MODE_LABELS;

  private endpoints = new Endpoints();

  constructor(
    private formBuilder: FormBuilder,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'numCurves',
      this.formBuilder.control(1, [
        Validators.required,
        Validators.min(1),
        this.integerValidator,
      ]),
    );
    this.formGroup.setControl(
      'curves',
      this.formBuilder.array([], [Validators.minLength(1)]),
    );
    this.formGroup.setControl(
      'xAxisType',
      this.formBuilder.control(PlotlyAxisType.linear, [Validators.required]),
    );
    this.formGroup.setControl(
      'yAxisType',
      this.formBuilder.control(PlotlyAxisType.linear, [Validators.required]),
    );
    this.formGroup.setControl(
      'traceMode',
      this.formBuilder.control(PlotlyTraceMode.lines, [Validators.required]),
    );

    this.curvesFormGroups = (this.formGroup.controls.curves as FormArray)
      .controls as FormGroup[];

    this.setNumCurves();
  }

  public setNumCurves(): void {
    const numCurves = Math.round(this.formGroup.value.numCurves);
    const curvesFormArray = this.formGroup.controls.curves as FormArray;

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

  private integerValidator(control: FormControl): ValidationErrors | null {
    if (control.value && control.value != Math.round(control.value)) {
      return {
        integer: true,
      };
    } else {
      return null;
    }
  }

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout | false> {
    let dataSetUris: string[] = [];
    this.curvesFormGroups.forEach((curve: FormGroup): void => {
      dataSetUris = dataSetUris.concat(
        (curve.controls.xData as FormControl).value,
      );
      dataSetUris = dataSetUris.concat(
        (curve.controls.yData as FormControl).value,
      );
    });

    return this.viewService
      .getReportResults(this.simulationRunId, dataSetUris)
      .pipe(
        map(
          (
            uriResultsMap: UriSetDataSetResultsMap,
          ): PlotlyDataLayout | false => {
            const formGroup = this.formGroup;
            const traceMode = (formGroup.controls.traceMode as FormControl)
              .value;

            const traces = [];
            const xAxisTitlesSet = new Set<string>();
            const yAxisTitlesSet = new Set<string>();
            let missingData = false;

            for (const curve of this.curvesFormGroups) {
              for (const xDataUri of (curve.controls.xData as FormControl)
                .value) {
                for (const yDataUri of (curve.controls.yData as FormControl)
                  .value) {
                  const xDataSet = this.uriSedDataSetMap[xDataUri];
                  const yDataSet = this.uriSedDataSetMap[yDataUri];
                  const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
                  const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;
                  let name!: string;
                  if ((curve.controls.name as FormControl).value) {
                    name = (curve.controls.name as FormControl).value;

                    const attributes = [];
                    if (
                      (curve.controls.xData as FormControl).value.length > 1
                    ) {
                      attributes.push(`x: ${xLabel}`);
                    }
                    if (
                      (curve.controls.yData as FormControl).value.length > 1
                    ) {
                      attributes.push(`y: ${yLabel}`);
                    }

                    if (attributes.length) {
                      name += ` (${attributes.join(', ')})`;
                    }
                  } else {
                    name = `${yLabel} vs ${xLabel}`;
                  }

                  const trace = {
                    name: name,
                    x: uriResultsMap?.[xDataUri]?.values,
                    y: uriResultsMap?.[yDataUri]?.values,
                    xaxis: 'x1',
                    yaxis: 'y1',
                    type: PlotlyTraceType.scatter,
                    mode: traceMode,
                  };

                  if (trace.x && trace.y) {
                    traces.push(trace);
                    xAxisTitlesSet.add(xLabel);
                    yAxisTitlesSet.add(yLabel);
                  } else if (xDataUri && yDataUri) {
                    missingData = true;
                  }
                }
              }
            }

            const xAxisTitlesArr = Array.from(xAxisTitlesSet);
            const yAxisTitlesArr = Array.from(yAxisTitlesSet);

            let xAxisTitle: string | undefined = undefined;
            let yAxisTitle: string | undefined = undefined;

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

            const dataLayout = {
              data: traces,
              layout: {
                xaxis1: {
                  anchor: 'x1',
                  title: xAxisTitle,
                  type: (formGroup.controls.xAxisType as FormControl).value,
                },
                yaxis1: {
                  anchor: 'y1',
                  title: yAxisTitle,
                  type: (formGroup.controls.yAxisType as FormControl).value,
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
    let dataSetUris: string[] = [];
    this.curvesFormGroups.forEach((curve: FormGroup): void => {
      dataSetUris = dataSetUris.concat(
        (curve.controls.xData as FormControl).value,
      );
      dataSetUris = dataSetUris.concat(
        (curve.controls.yData as FormControl).value,
      );
    });

    return this.viewService
      .getReportResults(this.simulationRunId, dataSetUris)
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
          const formGroup = this.formGroup;
          const vega = JSON.parse(JSON.stringify(vegaTemplate)) as any;

          // data sets
          const selectedDataSets: { [outputUri: string]: any[] } = {};
          const curveFilters: string[] = [];
          const xAxisTitlesSet = new Set<string>();
          const yAxisTitlesSet = new Set<string>();

          for (const curve of this.curvesFormGroups) {
            for (const xDataUri of (curve.controls.xData as FormControl)
              .value) {
              for (const yDataUri of (curve.controls.yData as FormControl)
                .value) {
                if (
                  uriResultsMap &&
                  xDataUri in uriResultsMap &&
                  yDataUri in uriResultsMap
                ) {
                  const xDataSet = this.uriSedDataSetMap[xDataUri];
                  const yDataSet = this.uriSedDataSetMap[yDataUri];
                  const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
                  const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;

                  const xDataUriParts = xDataUri.split('/');
                  const yDataUriParts = yDataUri.split('/');
                  const xOutputUri = xDataUriParts
                    .slice(0, xDataUriParts.length - 1)
                    .join('/');
                  const yOutputUri = yDataUriParts
                    .slice(0, yDataUriParts.length - 1)
                    .join('/');

                  if (!(xOutputUri in selectedDataSets)) {
                    selectedDataSets[xOutputUri] = [];
                  }
                  if (!(yOutputUri in selectedDataSets)) {
                    selectedDataSets[yOutputUri] = [];
                  }
                  selectedDataSets[xOutputUri].push(
                    xDataUriParts[xDataUriParts.length - 1],
                  );
                  selectedDataSets[yOutputUri].push(
                    yDataUriParts[yDataUriParts.length - 1],
                  );

                  const conditions = [
                    `datum.X.outputUri === '${xOutputUri}'`,
                    `datum.X.id == '${xDataSet.id}'`,
                    `datum.Y.outputUri === '${yOutputUri}'`,
                    `datum.Y.id == '${yDataSet.id}'`,
                  ];
                  curveFilters.push(`(${conditions.join(' && ')})`);
                  xAxisTitlesSet.add(xLabel);
                  yAxisTitlesSet.add(yLabel);
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
              templateNames: [
                'rawData0',
                'rawData0_filtered',
                'rawData_joined',
              ],
              sourceName: (iDataSet: number): string => `rawData${iDataSet}`,
              filteredName: (iDataSet: number): string =>
                `rawData${iDataSet}_filtered`,
              joinedName: 'rawData_joined',
              joinedTransforms: [
                {
                  type: 'cross',
                  as: ['X', 'Y'],
                  filter: curveFilters.join('||'),
                },
              ],
              data: selectedDataSets,
            },
          ];

          //signals
          const traceMode = (formGroup.controls.traceMode as FormControl).value;
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
                type: (formGroup.controls.xAxisType as FormControl).value,
              },
            },
            {
              name: 'yScale',
              attributes: {
                type: (formGroup.controls.yAxisType as FormControl).value,
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

          // return Vega spec
          return vega;
        }),
      );
  }
}
