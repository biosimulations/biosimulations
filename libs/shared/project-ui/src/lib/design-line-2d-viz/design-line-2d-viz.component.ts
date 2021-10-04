import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  // FormArray,
  // FormControl,
  Validators,
  // ValidationErrors,
} from '@angular/forms';
import { Visualization, VisualizationList } from '@biosimulations/datamodel/project';
import { PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { Observable, of } from 'rxjs';
import { Spec as VegaSpec } from 'vega';
// import vegaTemplate from './vega-template.json';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-project-design-line-2d-visualization',
  templateUrl: './design-line-2d-viz.component.html',
  styleUrls: ['./design-line-2d-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignLine2DVisualizationComponent {
  @Input()
  visualizations!: VisualizationList[];

  @Output()
  renderVisualization = new EventEmitter<Visualization>();

  @Input()
  formGroup!: FormGroup;
  /*
  userHistogram1DFormGroup: FormGroup;
  userHeatmap2DFormGroup: FormGroup;
  userLine2DFormGroup: FormGroup;
  userHistogram1DDataSetsFormControl: FormControl;
  userHeatmap2DYDataSetsFormControl: FormControl;
  userLine2DCurvesFormGroups: : FormGroup[];
  */

  private endpoints = new Endpoints();

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      visualization: [null, [Validators.required]],
      /*
      userHistogram1D: formBuilder.group({
        dataSets: [[], Validators.minLength(1)],
      }),
      userHeatmap2D: formBuilder.group({
        yDataSets: [[], Validators.minLength(1)],
        xDataSet: [null],
      }),
      userLine2D: formBuilder.group({
        numCurves: [
          1,
          [Validators.required, Validators.min(1), this.integerValidator],
        ],
        curves: formBuilder.array([], Validators.minLength(1)),
        xAxisType: [PlotlyAxisType.linear, [Validators.required]],
        yAxisType: [PlotlyAxisType.linear, [Validators.required]],
        traceMode: [PlotlyTraceMode.lines, [Validators.required]],
      }),
      */
    });

    /*
    const userHistogram1DFormGroup = this.formGroup.controls
      .userHistogram1D as FormGroup;
    const userHeatmap2DFormGroup = this.formGroup.controls
      .userHeatmap2D as FormGroup;
    const userLine2DFormGroup = this.formGroup.controls
      .userLine2D as FormGroup;

    userHistogram1DFormGroup.disable();
    userHeatmap2DFormGroup.disable();
    userLine2DFormGroup.disable();

    this.userHistogram1DDataSetsFormControl = userHistogram1DFormGroup.controls
      .dataSets as FormControl;
    this.userHeatmap2DYDataSetsFormControl = userHeatmap2DFormGroup.controls
      .yDataSets as FormControl;
    this.userLine2DCurvesFormGroups = (
      userLine2DFormGroup.controls.curves as FormArray
    ).controls as FormGroup[];
    */
  }

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout | false> {
    return of(false);
  }

  public exportToVega(): Observable<VegaSpec> {
    return of({});
  }
}
