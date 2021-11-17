import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, of, combineLatest, map, pluck } from 'rxjs';
import { shareReplay, concatAll, catchError } from 'rxjs/operators';
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
import {
  Simulation,
  UnknownSimulation,
  isUnknownSimulation,
} from '../../../datamodel';
import { FormattedSimulation } from './view.model';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { Dataset, WithContext } from 'schema-dts';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { environment } from '@biosimulations/shared/environments';
import { SimulationRunService } from '@biosimulations/angular-api-client';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<true>;
  public resultsLoaded$!: Observable<boolean>;

  public id!: string;

  private simulation$!: Observable<Simulation>;
  private status$!: Observable<SimulationRunStatus>;
  private statusRunning$!: Observable<boolean>;
  statusSucceeded$!: Observable<boolean>;

  public formattedSimulation$!: Observable<FormattedSimulation>;

  public projectMetadata$!: Observable<ProjectMetadata | undefined | false>;

  public projectFiles$!: Observable<Path[] | undefined | false>;
  public files$!: Observable<Path[] | undefined | false>;
  public outputs$!: Observable<File[] | undefined | false>;

  public visualizations$!: Observable<VisualizationList[] | undefined | false>;
  public visualization: Visualization | null = null;

  public logs$!: Observable<SimulationLogs | undefined | false>;

  public jsonLdData$!: Observable<WithContext<Dataset>>;

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

    this.initSimulationRun();

    this.projectMetadata$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<ProjectMetadata | undefined> => {
        if (succeeded) {
          return this.simulationRunService.getSimulationRunSummary(id).pipe(
              map((simulationRunSummary) => this.sharedViewService.getFormattedProjectMetadata(simulationRunSummary)),
              shareReplay(1),
            );
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.projectFiles$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<Path[] | undefined> => {
        if (succeeded) {
          return this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) => this.sharedViewService.getFormattedProjectFiles(simulationRunSummary)),
            shareReplay(1),
          );
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.files$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<Path[] | undefined> => {
        if (succeeded) {
          return this.sharedViewService.getFormattedProjectContentFiles(id);
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.outputs$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<File[] | undefined> => {
        if (succeeded) {
          return this.simulationRunService.getSimulationRunSummary(id).pipe(
            map((simulationRunSummary) => this.sharedViewService.getFormattedOutputFiles(simulationRunSummary)),
            shareReplay(1),
          );
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.visualizations$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<VisualizationList[] | undefined> => {
        if (succeeded) {
          return this.sharedViewService.getVisualizations(id);
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),
      shareReplay(1),
    );

    this.logs$ = this.statusRunning$.pipe(
      map(
        (running: boolean): Observable<SimulationLogs | undefined | false> => {
          if (running) {
            return of(undefined);
          } else {
            return this.dispatchService.getSimulationLogs(id);
          }
        },
      ),
      concatAll(),
      shareReplay(1),
    );

    this.jsonLdData$ = this.simulationRunService.getSimulationRunSummary(id).pipe(
      map((simulationRunSummary) => this.sharedViewService.getJsonLdData(simulationRunSummary)),
      shareReplay(1),
    );

    this.resultsLoaded$ = combineLatest([
      this.projectMetadata$,
      this.projectFiles$,
      this.files$,
      this.outputs$,
      this.visualizations$,
      this.logs$,
    ]).pipe(
      map((values: any[]) => {
        for (const value of values) {
          if (value === undefined) {
            return false;
          }
        }
        return true;
      }),
      shareReplay(1),
    );
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

    this.status$ = this.simulation$.pipe(pluck('status'), shareReplay(1));
    this.statusRunning$ = this.status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusRunning(value);
      }),
      shareReplay(1),
    );
    this.statusSucceeded$ = this.status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusSucceeded(value);
      }),
      shareReplay(1),
    );

    this.formattedSimulation$ = this.simulation$.pipe(
      map<Simulation, FormattedSimulation>(
        this.viewService.formatSimulation.bind(this.viewService),
      ),
      shareReplay(1),
    );

    this.loaded$ = this.formattedSimulation$.pipe(
      map((_): true => true),
      shareReplay(1),
    );
  }

  selectedTabIndex = 0;
  viewVisualizationTabDisabled = true;
  selectVisualizationTabIndex = 3;
  visualizationTabIndex = 4;

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
