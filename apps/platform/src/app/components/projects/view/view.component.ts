import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { trigger, transition, style, animate } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Observable, combineLatest, map, shareReplay, mergeMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ProjectMetadata,
  SimulationRunMetadata,
  Path,
  File,
  VisualizationList,
  Visualization,
} from '@biosimulations/datamodel-simulation-runs';
import { ViewService } from '@biosimulations/simulation-runs/service';
import { ProjectService } from '@biosimulations/angular-api-client';
import { Dataset, WithContext } from 'schema-dts';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { ProjectSummary } from '@biosimulations/datamodel/common';

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],

  animations: [
    trigger('cardAnimation', [
      transition('* <=> *', [
        style({ transform: 'translateX(0)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ViewComponent implements OnInit {
  @Input() public featureComingSoonMessage = 'Stay tuned! This exciting new feature is currently under development :)';
  public selectedTabIndex = 0;

  public loaded$!: Observable<boolean>;
  public projectMetadata$!: Observable<ProjectMetadata | null>;
  public simulationRun$!: Observable<SimulationRunMetadata>;
  public projectFiles$!: Observable<File[]>;
  public files$!: Observable<Path[]>;
  public outputs$!: Observable<File[]>;
  public projectSummary$!: Observable<ProjectSummary>;
  public visualizations$!: Observable<VisualizationList[]>;
  public plotVisualizations$!: Observable<Visualization[]>;

  public themeColor = 'accent';
  public jsonLdData$!: Observable<WithContext<Dataset>>;
  public cards: any[] = [];
  public draggedIndex = -1;
  public panelExpandedStatus: { [key: string]: boolean } = {};
  private id!: string;

  public constructor(
    private service: ViewService,
    private projService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    const id = (this.id = this.route.snapshot.params['id']);
    this.projectSummary$ = this.projService.getProjectSummary(id).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        const appError =
          error.status === HttpStatusCode.BadRequest
            ? new BiosimulationsError(
                'Project not found',
                "We're sorry! The project you requested could not be found.",
                HttpStatusCode.NotFound,
              )
            : error;

        return throwError(appError);
      }),
      shareReplay(1),
    );

    this.projectMetadata$ = this.projectSummary$.pipe(
      map((projectSummary) =>
        this.service.getFormattedProjectMetadata(
          projectSummary.id,
          projectSummary.simulationRun,
          projectSummary?.owner,
        ),
      ),
      shareReplay(1),
    );

    this.simulationRun$ = this.projectSummary$.pipe(
      mergeMap((projectSummary) => this.service.getFormattedSimulationRun(projectSummary.simulationRun)),
      shareReplay(1),
    );

    this.projectFiles$ = this.projectSummary$.pipe(
      map((projectSummary) => this.service.getFormattedProjectFiles(projectSummary.simulationRun)),
      shareReplay(1),
    );

    this.files$ = this.projectSummary$.pipe(
      mergeMap((projectSummary) => this.service.getFormattedProjectContentFiles(projectSummary.simulationRun)),
      shareReplay(1),
    );

    this.outputs$ = this.projectSummary$.pipe(
      map((projectSummary) => this.service.getFormattedOutputFiles(projectSummary.simulationRun)),
      shareReplay(1),
    );

    this.visualizations$ = this.projectSummary$.pipe(
      mergeMap((projectSummary) => this.service.getVisualizations(projectSummary.simulationRun.id)),
      shareReplay(1),
    );

    this.plotVisualizations$ = this.visualizations$.pipe(
      map((visList) => this.getPlotVisualizations(visList)),
      shareReplay(1),
    );

    this.jsonLdData$ = this.projectSummary$.pipe(
      map((projectSummary) => this.service.getJsonLdData(projectSummary.simulationRun, projectSummary)),
      shareReplay(1),
    );

    this.loaded$ = combineLatest([
      this.projectMetadata$,
      this.simulationRun$,
      this.projectFiles$,
      this.files$,
      this.outputs$,
      this.visualizations$,
    ]).pipe(
      map((observables: (any | undefined)[]): boolean => {
        return (
          observables.filter((observable: any | undefined): boolean => {
            return observable === undefined;
          }).length === 0
        );
      }),
    );
    this.handleExpansionPanels();
  }

  public getPlotVisualizations(visLists: VisualizationList[]): Visualization[] {
    const visualizations: Visualization[] = [] as Visualization[];
    for (const visList of visLists) {
      for (const vis of visList.visualizations) {
        if (vis._type === 'SedPlot2DVisualization') {
          visualizations.push(vis);
          this.cards.push(vis);
        }
      }
    }
    return visualizations;
  }

  public drop(event: CdkDragDrop<number[]>): void {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  private setupSnackbarConfig(cssClass: string[], data: null, dur: number): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.panelClass = cssClass;
    config.duration = dur;
    config.verticalPosition = 'top';
    config.data = data;
    return config;
  }

  public promptReRun(data = null, confirmActionMessage = 'Close', duration = 6000): void {
    const snackbarConfig = this.setupSnackbarConfig(['coming-soon-snackbar'], data, duration);
    this.snackBar.open(this.featureComingSoonMessage, confirmActionMessage, snackbarConfig);
  }

  private handleExpansionPanels(): void {
    this.projectMetadata$.subscribe((metadata) => {
      if (metadata) {
        const headingsToExpand = ['modelSimulation', 'provenance'];
        headingsToExpand.forEach((heading) => {
          this.panelExpandedStatus[heading] = true;
        });
      }
    });
  }
}
