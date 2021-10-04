import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Visualization, VisualizationList } from '@biosimulations/datamodel/view-simulation';
// import { urls } from '@biosimulations/config/common';
import { DesignHistogram1DVisualizationComponent } from '../design-histogram-1d-viz/design-histogram-1d-viz.component';
import { DesignHeatmap2DVisualizationComponent } from '../design-heatmap-2d-viz/design-heatmap-2d-viz.component';
import { DesignLine2DVisualizationComponent } from '../design-line-2d-viz/design-line-2d-viz.component';

@Component({
  selector: 'biosimulations-project-select-visualization',
  templateUrl: './select-viz.component.html',
  styleUrls: ['./select-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectVisualizationComponent {
  @Input()
  visualizations!: VisualizationList[];

  @Output()
  renderVisualization = new EventEmitter<Visualization>();

  formGroup: FormGroup;
  userHistogram1DFormGroup: FormGroup;
  userHeatmap2DFormGroup: FormGroup;
  userLine2DFormGroup: FormGroup;
  
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = formBuilder.group({
      visualization: [null, [Validators.required]],
      userHistogram1DFormGroup: formBuilder.group({}),
      userHeatmap2DFormGroup: formBuilder.group({}),
      userLine2DFormGroup: formBuilder.group({}),
    });

    this.userHistogram1DFormGroup = this.formGroup.controls.userHistogram1DFormGroup as FormGroup;
    this.userHeatmap2DFormGroup = this.formGroup.controls.userHeatmap2DFormGroup as FormGroup;
    this.userLine2DFormGroup = this.formGroup.controls.userLine2DFormGroup as FormGroup;

    this.userHistogram1DFormGroup.disable();
    this.userHeatmap2DFormGroup.disable();
    this.userLine2DFormGroup.disable();
  }

  private getSelectedVisualization(): Visualization {
    return (this.formGroup.controls.visualization as FormControl).value;
  }

  selectVisualization(): void {
    this.userHistogram1DFormGroup.disable();
    this.userHeatmap2DFormGroup.disable();
    this.userLine2DFormGroup.disable();

    const visualization = this.getSelectedVisualization();
    if (visualization._type === 'Histogram1DVisualization') {
      this.userHistogram1DFormGroup.enable();
    } else if (visualization._type === 'Heatmap2DVisualization') {
      this.userHeatmap2DFormGroup.enable();
    } else if (visualization._type === 'Line2DVisualization') {
      this.userHeatmap2DFormGroup.enable();
    }
  }

  @ViewChild(DesignHistogram1DVisualizationComponent)
  designHistogram1DVisualization?: DesignHistogram1DVisualizationComponent;

  @ViewChild(DesignHeatmap2DVisualizationComponent)
  designHeatmap2DVisualizationComponent?: DesignHeatmap2DVisualizationComponent;

  @ViewChild(DesignLine2DVisualizationComponent)
  designLine2DVisualizationComponent?: DesignLine2DVisualizationComponent;

  viewVisualization(): void {
    const visualization = this.getSelectedVisualization();

    if (visualization._type === 'Histogram1DVisualization') {
      this.designHistogram1DVisualization?.buildVisualization();
    } else if (visualization._type === 'Heatmap2DVisualization') {
      //this.designHeatmap2DVisualizationComponent?.buildVisualization();
    } else if (visualization._type === 'Line2DVisualization') {
      //this.designLine2DVisualizationComponent?.buildVisualization();
    }

    this.renderVisualization.emit(visualization);
  }

  exportVisualization(format: 'vega' | 'archive'): void {
    const visualization = this.getSelectedVisualization();

    const vega = {};

    /*
    // download
    const blob = new Blob([JSON.stringify(vega, null, 2)], {
      type: 'application/vega+json',
    });

    if (format === 'vega') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'visualization.json';
      a.click();
    } else {
      const sub = this.combineService
        .addFileToCombineArchive(
          `${urls.dispatchApi}run/${this.uuid}/download`,
          'plot.json',
          'http://purl.org/NET/mediatypes/application/vega+json',
          false,
          blob,
          false,
        )
        .subscribe((fileOrUrl: any | string | undefined): void => {
          if (fileOrUrl) {
            const a = document.createElement('a');
            a.download = 'project.omex';
            if (typeof fileOrUrl === 'string' || fileOrUrl instanceof String) {
              a.href = fileOrUrl as string;
            } else {
              a.href = URL.createObjectURL(fileOrUrl);
            }
            a.click();
          } else {
            this.snackBar.open(
              'Sorry! We were unable to modify your project.',
              undefined,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              },
            );
          }
        });
      this.subscriptions.push(sub);
    }
    */
  }
}
