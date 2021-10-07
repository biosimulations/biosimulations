import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, combineLatest, map, shareReplay, mergeMap } from 'rxjs';
import {
  ProjectMetadata,
  SimulationRunMetadata,
  Path,
  File,
  VisualizationList,
  Visualization,
} from '@biosimulations/datamodel-view';
import { ViewService } from '@biosimulations/view-service';
import { ProjectService } from '@biosimulations/angular-api-client';

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<boolean>;

  public id!: string;
  public simulationRunId$!: Observable<string>;
  public projectMetadata$!: Observable<ProjectMetadata | undefined>;
  public simulationRun$!: Observable<SimulationRunMetadata>;

  public projectFiles$!: Observable<Path[]>;
  public files$!: Observable<Path[]>;
  public outputs$!: Observable<File[]>;

  public visualizations$!: Observable<VisualizationList[]>;
  public visualization: Visualization | null = null;

  public constructor(
    private service: ViewService,
    private projService: ProjectService,
    private route: ActivatedRoute,
  ) {}

  public selectedTabIndex = 0;
  public viewVisualizationTabDisabled = true;
  public selectVisualizationTabIndex = 2;
  public visualizationTabIndex = 3;

  public ngOnInit(): void {
    const id = (this.id = this.route.snapshot.params['id']);
    this.simulationRunId$ = this.projService.getProject(id).pipe(
      shareReplay(1),
      map((project) => project.simulationRun),
    );
    this.projectMetadata$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getFormattedProjectMetadata(simulationRun),
      ),
    );
    this.simulationRun$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getFormattedSimulationRun(simulationRun),
      ),
    );

    this.projectFiles$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getFormattedProjectFiles(simulationRun),
      ),
    );
    this.files$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getFormattedProjectContentFiles(simulationRun),
      ),
    );

    this.outputs$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getFormattedOutputFiles(simulationRun),
      ),
    );

    this.visualizations$ = this.simulationRunId$.pipe(
      mergeMap((simulationRun) =>
        this.service.getVisualizations(simulationRun),
      ),
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
