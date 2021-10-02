import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  // FormArray,
  FormControl,
  Validators,
  // ValidationErrors,
} from '@angular/forms';
import { Visualization, VisualizationList } from '../view/view.model';

/*
import {
  PlotlyAxisType,
  PlotlyTraceType,
  PlotlyTraceMode,
  PlotlyTrace,
  PlotlyDataLayout,
} from '@biosimulations/datamodel/common';
*/

@Component({
  selector: 'biosimulations-project-select-visualization',
  templateUrl: './project-select-visualization.component.html',
  styleUrls: ['./project-select-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSelectVisualizationComponent {
  @Input()
  visualizations!: VisualizationList[];

  @Output()
  renderVisualization = new EventEmitter<Visualization>();

  formGroup: FormGroup;
  /*
  user1DHistogramFormGroup: FormGroup;
  user2DHeatmapFormGroup: FormGroup;
  user2DLineScatterFormGroup: FormGroup;
  user1DHistogramDataSetsFormControl: FormControl;
  user2DHeatmapYDataSetsFormControl: FormControl;
  user2DLineScatterCurvesFormGroups: : FormGroup[];
  */

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      visualization: [null, [Validators.required]],
      /*
      user1DHistogram: formBuilder.group({
        dataSets: [[], Validators.minLength(1)],
      }),
      user2DHeatmap: formBuilder.group({
        yDataSets: [[], Validators.minLength(1)],
        xDataSet: [null],
      }),
      user2DLineScatter: formBuilder.group({
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
    const user1DHistogramFormGroup = this.formGroup.controls
      .user1DHistogram as FormGroup;
    const user2DHeatmapFormGroup = this.formGroup.controls
      .user2DHeatmap as FormGroup;
    const user2DLineScatterFormGroup = this.formGroup.controls
      .user2DLineScatter as FormGroup;

    user1DHistogramFormGroup.disable();
    user2DHeatmapFormGroup.disable();
    user2DLineScatterFormGroup.disable();

    this.user1DHistogramDataSetsFormControl = user1DHistogramFormGroup.controls
      .dataSets as FormControl;
    this.user2DHeatmapYDataSetsFormControl = user2DHeatmapFormGroup.controls
      .yDataSets as FormControl;
    this.user2DLineScatterCurvesFormGroups = (
      user2DLineScatterFormGroup.controls.curves as FormArray
    ).controls as FormGroup[];
    */
  }

  selectVisualization(): void {
  }

  viewVisualization(): void {
    const visualization = (this.formGroup.controls.visualization as FormControl).value;
    this.renderVisualization.emit(visualization);
  }
}
