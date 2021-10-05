import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, of, combineLatest, map, pluck } from 'rxjs';
import { shareReplay, concatAll } from 'rxjs/operators';
import { 
  SimulationRunStatus
} from '@biosimulations/datamodel/common';
import { 
  ProjectMetadata,
  Path,
  File,
  VisualizationList,
  Visualization,
} from '@biosimulations/datamodel/project';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { DispatchService } from '../../../services/dispatch/dispatch.service';
import { ViewService as SharedViewService } from '@biosimulations/shared/project-service';
import { ViewService } from './view.service';
import { Simulation, UnknownSimulation, isUnknownSimulation } from '../../../datamodel';
import { FormattedSimulation } from './view.model';
import { SimulationLogs } from '../../../simulation-logs-datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<true>;
  public resultsLoaded$!: Observable<boolean>;
  
  public id!: string;

  private simulation$!: Observable<Simulation>;
  status$!: Observable<SimulationRunStatus>;
  statusRunning$!: Observable<boolean>;
  statusSucceeded$!: Observable<boolean>;

  public formattedSimulation$!: Observable<FormattedSimulation>;

  public projectMetadata$!: Observable<ProjectMetadata | undefined>;  
  
  public projectFiles$!: Observable<Path[] | undefined>;
  public files$!: Observable<Path[] | undefined>;
  public outputs$!: Observable<File[] | undefined>;

  public visualizations$!: Observable<VisualizationList[] | undefined>;
  public visualization: Visualization | null = null;

  public logs$!: Observable<SimulationLogs | undefined>;
  
  constructor(
    private simulationService: SimulationService,
    private dispatchService: DispatchService,
    private sharedViewService: SharedViewService, 
    private viewService: ViewService,    
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  
  public ngOnInit(): void {
    const id = this.id = this.route.snapshot.params['uuid'];
    
    this.initSimulationRun();    

    this.projectMetadata$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<ProjectMetadata | undefined> => {
        if (succeeded) {
          return this.sharedViewService.getFormattedProjectMetadata(id);
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
      shareReplay(1),
    );

    this.projectFiles$ = this.sharedViewService.getFormattedProjectFiles(id);

    this.files$ = this.statusRunning$.pipe(
      map((running: boolean): Observable<Path[] | undefined> => {
        if (running) {
          return of(undefined);
        } else {
          return this.sharedViewService.getFormattedProjectContentFiles(id);
        }
      }),
      concatAll(),
      shareReplay(1),
    );

    this.outputs$ = this.statusSucceeded$.pipe(
      map((succeeded: boolean): Observable<File[] | undefined> => {
        if (succeeded) {
          return this.sharedViewService.getFormattedOutputFiles(id);
        } else {
          return of(undefined);
        }
      }),
      concatAll(),
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
      shareReplay(1),
    );

    this.logs$ = this.statusRunning$.pipe(
      map((running: boolean): Observable<SimulationLogs | undefined> => {
        if (running) {
          return of(undefined);
        } else {
          return this.dispatchService.getSimulationLogs(id);
        }
      }),
      concatAll(),
      shareReplay(1),
    );

    this.resultsLoaded$ = combineLatest(
      this.projectMetadata$,      
      this.files$,
      this.outputs$,
      this.visualizations$,
      this.logs$,
    ).pipe(
      map((observables: (any | undefined)[]): boolean => {
        return observables.filter((observable: any | undefined): boolean => {
          return observable === undefined;
        }).length === 0;
      }),
    );
  }

  private initSimulationRun(): void {
    this.simulation$ = this.simulationService
      .getSimulation(this.id)
      .pipe(
        shareReplay(1),
        map((simulation: Simulation | UnknownSimulation): Simulation => {
          if (isUnknownSimulation(simulation)) {
            this.router.navigate(['/error', '404']);
          }
          return simulation as Simulation;
        })
      );

    this.status$ = this.simulation$.pipe(pluck('status'));
    this.statusRunning$ = this.status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusRunning(value);
      }),
    );
    this.statusSucceeded$ = this.status$.pipe(
      map((value: SimulationRunStatus): boolean => {
        return SimulationStatusService.isSimulationStatusSucceeded(value);
      }),
    );

    this.formattedSimulation$ = this.simulation$.pipe(
        map<Simulation, FormattedSimulation>(
          this.viewService.formatSimulation.bind(this.viewService),
        ),
    );

    this.loaded$ = this.formattedSimulation$.pipe(map((_): true => true));
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
