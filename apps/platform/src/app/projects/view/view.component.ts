import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  Observable,
  combineLatest,
  map,
  shareReplay,
  mergeMap,
  throwError,
} from 'rxjs';
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

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<boolean>;

  private id!: string;
  public projectMetadata$!: Observable<ProjectMetadata | null>;
  public simulationRun$!: Observable<SimulationRunMetadata>;

  public projectFiles$!: Observable<File[]>;
  public files$!: Observable<Path[]>;
  public outputs$!: Observable<File[]>;

  public visualizations$!: Observable<VisualizationList[]>;
  public visualization: Visualization | null = null;

  jsonLdData$!: Observable<WithContext<Dataset>>;

  public constructor(
    private service: ViewService,
    private projService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public selectedTabIndex = 0;
  public viewVisualizationTabDisabled = true;
  public selectVisualizationTabIndex = 2;
  public visualizationTabIndex = 3;

  public ngOnInit(): void {
    const id = (this.id = this.route.snapshot.params['id']);
    const projectSummary$ = this.projService.getProjectSummary(id).pipe(
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

    this.projectMetadata$ = projectSummary$.pipe(
      map((projectSummary) =>
        this.service.getFormattedProjectMetadata(
          projectSummary.simulationRun,
          projectSummary?.owner,
        ),
      ),
      shareReplay(1),
    );

    this.simulationRun$ = projectSummary$.pipe(
      mergeMap((projectSummary) =>
        this.service.getFormattedSimulationRun(projectSummary.simulationRun),
      ),
      shareReplay(1),
    );

    this.projectFiles$ = projectSummary$.pipe(
      map((projectSummary) =>
        this.service.getFormattedProjectFiles(projectSummary.simulationRun),
      ),
      shareReplay(1),
    );

    this.files$ = projectSummary$.pipe(
      mergeMap((projectSummary) =>
        this.service.getFormattedProjectContentFiles(
          projectSummary.simulationRun.id,
        ),
      ),
      shareReplay(1),
    );

    this.outputs$ = projectSummary$.pipe(
      map((projectSummary) =>
        this.service.getFormattedOutputFiles(projectSummary.simulationRun),
      ),
      shareReplay(1),
    );

    this.visualizations$ = projectSummary$.pipe(
      mergeMap((projectSummary) =>
        this.service.getVisualizations(projectSummary.simulationRun.id),
      ),
      shareReplay(1),
    );

    this.jsonLdData$ = projectSummary$.pipe(
      map((projectSummary) =>
        this.service.getJsonLdData(
          projectSummary.simulationRun,
          projectSummary,
        ),
      ),
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
  }

  public renderVisualization(visualization: Visualization): void {
    this.visualization = visualization;
    this.viewVisualizationTabDisabled = false;
    this.selectedTabIndex = this.visualizationTabIndex;
  }

  public selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == this.visualizationTabIndex) {
      if (this.viewVisualizationTabDisabled) {
        this.selectedTabIndex = this.selectVisualizationTabIndex;
        return;
      }
    }
    this.selectedTabIndex = $event.index;
  }
}
