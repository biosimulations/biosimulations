import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  SedDocumentReportsCombineArchiveContent,
  PlotlyDataLayout,
  PlotlyTraceType,
  PlotlyAxisType,
  PlotlyTraceMode,
} from '@biosimulations/datamodel/common';
import { UriSedDataSetMap, UriSetDataSetResultsMap, Line2DVisualization } from '@biosimulations/datamodel/project';
import { ViewService } from '@biosimulations/shared/project-service';
import { Observable, of, map } from 'rxjs';
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
  combineArchiveSedDocs!: SedDocumentReportsCombineArchiveContent[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;

  curvesFormGroups!: FormGroup[];

  axisLabelTypes: AxisLabelType[] = AXIS_LABEL_TYPES;
  traceModeLabels: TraceModeLabel[] = TRACE_MODE_LABELS;

  private endpoints = new Endpoints();

  constructor(private formBuilder: FormBuilder, private viewService: ViewService) {
  }

  ngOnInit(): void {
    this.formGroup.setControl(
      'numCurves',
      this.formBuilder.control(1, [Validators.required, Validators.min(1), this.integerValidator]),
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

    this.curvesFormGroups = (this.formGroup.controls.curves as FormArray).controls as FormGroup[];

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
      dataSetUris = dataSetUris.concat((curve.controls.xData as FormControl).value);
      dataSetUris = dataSetUris.concat((curve.controls.yData as FormControl).value);
    });

    return this.viewService.getReportResults(this.simulationRunId, dataSetUris).pipe(
      map((uriResultsMap: UriSetDataSetResultsMap): PlotlyDataLayout | false => {
        const formGroup = this.formGroup;
        const traceMode = (formGroup.controls.traceMode as FormControl).value;

        const traces = [];
        const xAxisTitlesSet = new Set<string>();
        const yAxisTitlesSet = new Set<string>();
        let missingData = false;

        for (const curve of this.curvesFormGroups) {
          for (const xDataUri of (curve.controls.xData as FormControl).value) {
            for (const yDataUri of (curve.controls.yData as FormControl).value) {
              const xDataSet = this.uriSedDataSetMap[xDataUri];
              const yDataSet = this.uriSedDataSetMap[yDataUri];
              const xLabel = xDataSet.name || xDataSet.label || xDataSet.id;
              const yLabel = yDataSet.name || yDataSet.label || yDataSet.id;
              let name!: string;
              if ((curve.controls.name as FormControl).value) {
                name = (curve.controls.name as FormControl).value;

                const attributes = [];
                if ((curve.controls.xData as FormControl).value.length > 1) {
                  attributes.push(`x: ${xLabel}`);
                }
                if ((curve.controls.yData as FormControl).value.length > 1) {
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
      })
    );
  }

  public exportToVega(): Observable<VegaSpec> {
    return of({});
  }
}
