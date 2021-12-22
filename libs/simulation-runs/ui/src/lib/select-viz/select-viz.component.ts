import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Observable, of, Subscription, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HtmlSnackBarComponent } from '@biosimulations/shared/ui';
import {
  Visualization,
  DesignVisualization,
  VisualizationList,
} from '@biosimulations/datamodel-simulation-runs';
// import { urls } from '@biosimulations/config/common';
import { DesignHistogram1DVisualizationComponent } from '../design-histogram-1d-viz/design-histogram-1d-viz.component';
import { DesignHeatmap2DVisualizationComponent } from '../design-heatmap-2d-viz/design-heatmap-2d-viz.component';
import { DesignLine2DVisualizationComponent } from '../design-line-2d-viz/design-line-2d-viz.component';
import { Spec as VegaSpec } from 'vega';
import {
  CombineApiService,
  SimulationRunService,
} from '@biosimulations/angular-api-client';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Endpoints } from '@biosimulations/config/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';

type DesignVisualizationComponent =
  | DesignHistogram1DVisualizationComponent
  | DesignHeatmap2DVisualizationComponent
  | DesignLine2DVisualizationComponent;

@Component({
  selector: 'biosimulations-project-select-visualization',
  templateUrl: './select-viz.component.html',
  styleUrls: ['./select-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectVisualizationComponent implements OnDestroy {
  private vegaFormatCombineUri: string;

  @Input()
  visualizations!: VisualizationList[];

  @Input()
  runSucceeded = true;

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
    private combineApiService: CombineApiService,
    private simRunService: SimulationRunService,
    private snackBar: MatSnackBar,
  ) {
    const vegaFormatCombineUri = BIOSIMULATIONS_FORMATS.filter(
      (format) => format.id === 'format_3969',
    )?.[0]?.biosimulationsMetadata?.omexManifestUris?.[0];
    if (vegaFormatCombineUri) {
      this.vegaFormatCombineUri = vegaFormatCombineUri;
    } else {
      throw new Error(
        'Vega format (EDAM:format_3969) must be annotated with one or more OMEX Manifest URIs',
      );
    }

    this.formGroup = formBuilder.group({
      visualization: [null, [Validators.required]],
      userHistogram1DFormGroup: formBuilder.group({}),
      userHeatmap2DFormGroup: formBuilder.group({}),
      userLine2DFormGroup: formBuilder.group({}),
    });

    this.userHistogram1DFormGroup = this.formGroup.controls
      .userHistogram1DFormGroup as FormGroup;
    this.userHeatmap2DFormGroup = this.formGroup.controls
      .userHeatmap2DFormGroup as FormGroup;
    this.userLine2DFormGroup = this.formGroup.controls
      .userLine2DFormGroup as FormGroup;

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
      (visualization as DesignVisualization).plotlyDataLayoutSubject.next(
        designVisualizationComponent.getPlotlyDataLayout(),
      );
    }
    this.renderVisualization.emit(visualization);
  }

  exportVisualization(format: 'vega' | 'archive'): void {
    this.snackBar.openFromComponent(HtmlSnackBarComponent, {
      data: {
        message: 'Please wait while your visualization is exported',
        spinner: true,
        action: 'Ok',
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    const vegaSpecSub = (
      this.getDesignVisualizationComponent() as DesignVisualizationComponent
    )
      .exportToVega()
      .pipe(
        map((vegaSpec: VegaSpec): void => {
          const simulationRunId = (
            this.getSelectedVisualization() as DesignVisualization
          ).simulationRunId;

          // download
          const blob = new Blob([JSON.stringify(vegaSpec, null, 2)], {
            type: 'application/vega+json',
          });

          if (format === 'vega') {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'visualization.json';
            a.click();

            this.snackBar.open(
              'Your visualization was successfully exported.',
              'Ok',
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              },
            );
          } else {
            const sub = this.combineApiService
              .addFileToCombineArchive(
                this.endpoints.getRunDownloadEndpoint(true, simulationRunId),
                'plot.vg.json',
                this.vegaFormatCombineUri,
                false,
                blob,
                false,
                false,
              )
              .pipe(
                catchError(
                  (error: HttpErrorResponse): Observable<undefined> => {
                    if (!environment.production) {
                      console.error(error);
                    }
                    return of<undefined>(undefined);
                  },
                ),
              )
              .subscribe(
                (fileOrUrl: ArrayBuffer | string | undefined): void => {
                  if (fileOrUrl) {
                    const a = document.createElement('a');
                    a.download = 'project.omex';
                    a.href = fileOrUrl as string;
                    a.click();

                    this.snackBar.open(
                      'Your visualization was successfully exported.',
                      'Ok',
                      {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                      },
                    );
                  } else {
                    this.snackBar.open(
                      'Sorry! We were unable to add the visualization to this project. Please refresh to try again.',
                      'Ok',
                      {
                        duration: 5000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                      },
                    );
                  }
                },
              );
            this.subscriptions.push(sub);
          }
        }),
        catchError((): Observable<void> => {
          this.snackBar.open(
            'Sorry! The data needed to export the visualization is not available. Please refresh to try again.',
            'Ok',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
          return of();
        }),
      )
      .subscribe();
    this.subscriptions.push(vegaSpecSub);
  }

  private getDesignVisualizationComponent(): DesignVisualizationComponent | null {
    const visualization = this.getSelectedVisualization();
    if (visualization._type === 'Histogram1DVisualization') {
      return this
        .designHistogram1DVisualization as DesignHistogram1DVisualizationComponent;
    } else if (visualization._type === 'Heatmap2DVisualization') {
      return this
        .designHeatmap2DVisualizationComponent as DesignHeatmap2DVisualizationComponent;
    } else if (visualization._type === 'Line2DVisualization') {
      return this
        .designLine2DVisualizationComponent as DesignLine2DVisualizationComponent;
    } else {
      return null;
    }
  }
}
