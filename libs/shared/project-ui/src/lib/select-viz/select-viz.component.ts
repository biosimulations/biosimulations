import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Visualization, DesignVisualization, VisualizationList } from '@biosimulations/datamodel/project';
// import { urls } from '@biosimulations/config/common';
import { DesignHistogram1DVisualizationComponent } from '../design-histogram-1d-viz/design-histogram-1d-viz.component';
import { DesignHeatmap2DVisualizationComponent } from '../design-heatmap-2d-viz/design-heatmap-2d-viz.component';
import { DesignLine2DVisualizationComponent } from '../design-line-2d-viz/design-line-2d-viz.component';
import { Spec as VegaSpec } from 'vega';
import { ProjectsService } from '@biosimulations/shared/project-service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Endpoints } from '@biosimulations/config/common';
import { VEGA_FORMAT } from '@biosimulations/datamodel/common';

type DesignVisualizationComponent = (
  DesignHistogram1DVisualizationComponent 
  | DesignHeatmap2DVisualizationComponent 
  | DesignLine2DVisualizationComponent
);

@Component({
  selector: 'biosimulations-project-select-visualization',
  templateUrl: './select-viz.component.html',
  styleUrls: ['./select-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectVisualizationComponent implements OnDestroy {
  @Input()
  visualizations!: VisualizationList[];

  @Output()
  renderVisualization = new EventEmitter<Visualization>();

  formGroup: FormGroup;
  userHistogram1DFormGroup: FormGroup;
  userHeatmap2DFormGroup: FormGroup;
  userLine2DFormGroup: FormGroup;

  private endpoints = new Endpoints();
  
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
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

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
    const designVisualizationComponent = this.getDesignVisualizationComponent();
    if (designVisualizationComponent) {
      (visualization as DesignVisualization).plotlyDataLayout = designVisualizationComponent.getPlotlyDataLayout();
    }
    this.renderVisualization.emit(visualization);
  }

  exportVisualization(format: 'vega' | 'archive'): void {
    const vegaSpecSub = (this.getDesignVisualizationComponent() as DesignVisualizationComponent)
      .exportToVega()
      .subscribe((vegaSpec: VegaSpec): void => {
        const simulationRunId = (this.getSelectedVisualization() as DesignVisualization).simulationRunId;

        // download
        const blob = new Blob([JSON.stringify(vegaSpec, null, 2)], {
          type: 'application/vega+json',
        });

        if (format === 'vega') {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'visualization.json';
          a.click();
        } else {
          const sub = this.projectsService
            .addFileToCombineArchive(
              this.endpoints.getRunDownloadEndpoint(simulationRunId),
              'plot.vega.json',
              VEGA_FORMAT.combineUri,
              false,
              blob,
              false,
              false,
            )
            .pipe(
              catchError((error: HttpErrorResponse): Observable<undefined> => {
                if (!environment.production) {
                  console.error(error);
                }
                return of<undefined>(undefined);
              }),
            )
            .subscribe((fileOrUrl: ArrayBuffer | string | undefined): void => {
              if (fileOrUrl) {
                const a = document.createElement('a');
                a.download = 'project.omex';
                a.href = fileOrUrl as string;
                a.click();
              } else {
                this.snackBar.open(
                  'Sorry! We were unable to add the visualization to this project.',
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
      });
    this.subscriptions.push(vegaSpecSub);
  }  

  private getDesignVisualizationComponent(): DesignVisualizationComponent | null {
    const visualization = this.getSelectedVisualization();
    if (visualization._type === 'Histogram1DVisualization') {
      return this.designHistogram1DVisualization as DesignHistogram1DVisualizationComponent;
    } else if (visualization._type === 'Heatmap2DVisualization') {
      return this.designHeatmap2DVisualizationComponent as DesignHeatmap2DVisualizationComponent;
    } else if (visualization._type === 'Line2DVisualization') {
      return this.designLine2DVisualizationComponent as DesignLine2DVisualizationComponent;
    } else {
      return null;
    }
  }
}
