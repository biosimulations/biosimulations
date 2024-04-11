import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, of, combineLatest, map, pluck, mergeMap, iif, Subject } from 'rxjs';
import { shareReplay, catchError, concatAll, takeUntil } from 'rxjs/operators';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  ProjectMetadata,
  Path,
  File,
  VisualizationList,
  Visualization,
} from '@biosimulations/datamodel-simulation-runs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { ViewService as SharedViewService } from '@biosimulations/simulation-runs/service';
import { ViewService } from './view.service';
import { Simulation, UnknownSimulation, isUnknownSimulation } from '../../../datamodel';
import { FormattedSimulation } from './view.model';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { Dataset, WithContext } from 'schema-dts';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { environment } from '@biosimulations/shared/environments';
import { SimulationRunService } from '@biosimulations/angular-api-client';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<true>;
  public resultsLoaded$!: Observable<boolean>;

  public id!: string;
  public archiveUrl!: string;
  public statusSucceeded$!: Observable<boolean>;

  public formattedSimulation$!: Observable<FormattedSimulation>;

  public projectMetadata$!: Observable<ProjectMetadata | null | undefined | false>;

  public projectFiles$!: Observable<Path[] | null | undefined | false>;
  public files$!: Observable<Path[] | null | undefined | false>;
  public outputs$!: Observable<File[] | null | undefined | false>;

  public visualizations$!: Observable<VisualizationList[] | null | undefined | false>;
  public visualization?: Visualization | null;
  // public visualization: Visualization | null = null;

  public logs$!: Observable<SimulationLogs | null | undefined | false>;

  public jsonLdData$!: Observable<WithContext<Dataset>>;

  private endpoints = new Endpoints();

  public selectedTabIndex = 0;
  public viewVisualizationTabDisabled = true;
  public selectVisualizationTabIndex = 1;
  public visualizationTabIndex = 2;
  public hasSbml!: boolean;
  public projectImageUrl?: string;

  private simulation$!: Observable<Simulation>;
  private statusCompleted$!: Observable<boolean>;
  private destroyed$ = new Subject<void>();

  public constructor(
    private simulationService: SimulationService,
    private simulationRunService: SimulationRunService,
    private dispatchService: DispatchService,
    private sharedViewService: SharedViewService,
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    const id = (this.id = this.route.snapshot.params['uuid']);
    this.archiveUrl = this.endpoints.getSimulationRunDownloadEndpoint(false, id);

    this.initSimulationRun();

    this.projectMetadata$ = this.statusCompleted$.pipe(
      mergeMap((completed) =>
        iif(
          () => completed,
          this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) =>
              this.sharedViewService.getFormattedProjectMetadata(simulationRunSummary.name, simulationRunSummary),
            ),
            shareReplay(1),
          ),
          of(null),
        ),
      ),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.projectFiles$ = this.statusCompleted$.pipe(
      mergeMap((completed) =>
        iif(
          () => completed,
          this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) => this.sharedViewService.getFormattedProjectFiles(simulationRunSummary)),
            shareReplay(1),
          ),
          of(null),
        ),
      ),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.files$ = this.statusCompleted$.pipe(
      mergeMap((completed) =>
        iif(
          () => completed,
          this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) => this.sharedViewService.getFormattedProjectContentFiles(simulationRunSummary)),
            concatAll(),
            shareReplay(1),
          ),
          of(null),
        ),
      ),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.outputs$ = this.statusCompleted$.pipe(
      mergeMap((completed) =>
        iif(
          () => completed,
          this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) => this.sharedViewService.getFormattedOutputFiles(simulationRunSummary)),
            shareReplay(1),
          ),
          of(null),
        ),
      ),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.visualizations$ = this.statusCompleted$.pipe(
      mergeMap((completed) => iif(() => completed, this.sharedViewService.getVisualizations(id), of(null))),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.logs$ = this.statusCompleted$.pipe(
      mergeMap((completed) => iif(() => completed, this.dispatchService.getSimulationLogs(id), of(null))),
      shareReplay(1),
    );

    this.jsonLdData$ = this.simulationRunService.getSimulationRunSummary(id).pipe(
      map((simulationRunSummary) => this.sharedViewService.getJsonLdData(simulationRunSummary)),
      shareReplay(1),
    );

    this.resultsLoaded$ = combineLatest([
      this.statusCompleted$,
      this.projectMetadata$,
      this.projectFiles$,
      this.files$,
      this.outputs$,
      this.visualizations$,
      this.logs$,
    ]).pipe(
      map((values: any[]) => {
        for (const value of values.slice(1)) {
          if (value === undefined) {
            return false;
          }
        }
        return values[0];
      }),
      shareReplay(1),
    );

    this.initFilesSubscription();
    console.log(` ---- THIS SIMULATION HAS sbml: ${this.hasSbml}`);
  }

  public setHasSbml(): void {
    this.files$.subscribe((path: Path[] | null | undefined | false) => {
      switch (path) {
        case (path as null) || (path as undefined) || (path as false):
          console.log(`Path is not full!`);
          break;
        case path as Path[]:
          path.forEach((path: Path) => {
            if (path.location.includes('.xml') || path.location.includes('sbml')) {
              console.log(`Has SBML!`);
              this.hasSbml = true;
            }
          });
          break;
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private initFilesSubscription(): void {
    this.files$.pipe(takeUntil(this.destroyed$)).subscribe((files: Path[] | null | undefined | false) => {
      if (files) {
        files.forEach((file: Path) => {
          if (file.location.includes('jpg')) {
            switch (file) {
              case file as File:
                this.projectImageUrl = file.url;
                break;
            }
          }
        });
        this.hasSbml = files.some((file: Path) => file.location.includes('.xml') || file.location.includes('sbml'));
      }
    });
  }

  private initSimulationRun(): void {
    this.simulation$ = this.simulationService.getSimulation(this.id).pipe(
      map((simulation: Simulation | UnknownSimulation): Simulation => {
        if (isUnknownSimulation(simulation)) {
          throw new BiosimulationsError(
            'Simulation run not found',
            "We're sorry! The run you requested could not be found.",
            404,
          );
        }
        return simulation as Simulation;
      }),
      shareReplay(1),
    );

    const status$ = this.simulation$.pipe(pluck('status'), shareReplay(1));

    this.statusCompleted$ = status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusCompleted(value);
      }),
      shareReplay(1),
    );

    this.statusSucceeded$ = status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusSucceeded(value);
      }),
      shareReplay(1),
    );

    this.formattedSimulation$ = this.simulation$.pipe(
      map<Simulation, FormattedSimulation>(this.viewService.formatSimulation.bind(this.viewService)),
      shareReplay(1),
    );

    this.loaded$ = this.formattedSimulation$.pipe(
      map((_): true => true),
      shareReplay(1),
    );
  }

  public renderVisualization(visualization: Visualization): void {
    this.visualization = visualization;
    console.log('Received visualization for rendering:', visualization);
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
