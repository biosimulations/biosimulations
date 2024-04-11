import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import { Observable, combineLatest, map, shareReplay, mergeMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  ProjectMetadata,
  SimulationRunMetadata,
  Path,
  File,
  VisualizationList,
  Visualization,
  ListItem,
} from '@biosimulations/datamodel-simulation-runs';
import { ViewService } from '@biosimulations/simulation-runs/service';
import { ProjectService } from '@biosimulations/angular-api-client';
import { Dataset, WithContext } from 'schema-dts';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { ProjectSummary } from '@biosimulations/datamodel/common';

type CombinedObservables = [ProjectMetadata | null, SimulationRunMetadata, File[], Path[], File[], VisualizationList[]];

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

  public jsonLdData$!: Observable<WithContext<Dataset>>;
  public cards: any[] = [];
  public panelExpandedStatus: { [key: string]: boolean } = {};
  private id!: string;

  public constructor(
    private service: ViewService,
    private projService: ProjectService,
    private route: ActivatedRoute,
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
      map((observables: CombinedObservables): boolean => {
        return (
          observables.filter((observable: CombinedObservables[number] | undefined): boolean => {
            return observable === undefined;
          }).length === 0
        );
      }),
    );

    this.transformRunUrl();
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

  private transformRunUrl(): void {
    this.simulationRun$.subscribe((run: SimulationRunMetadata) => {
      run.forEach((value, key) => {
        value.items.forEach((val: ListItem) => {
          if (val.url?.includes('run.biosimulations')) {
            const runUrl = val.url;
            val.url = this.convertRunUrl(runUrl);
          }
        });
      });
    });
  }

  private convertRunUrl(url: string): string {
    /* Converts dispatch runs to platform url */
    const runUrl = new URL(url);
    const ext = runUrl.hostname.split('.').slice(-2).join('.');
    const seg = runUrl.pathname.split('/');
    const runId = seg.pop();
    return `https://${ext}/runs/${runId}`;
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
