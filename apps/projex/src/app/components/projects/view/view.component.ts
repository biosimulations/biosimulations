import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTabChangeEvent } from '@angular/material/tabs';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  //START OLD IMPLEMENTATION ATTRIBUTES
  public selectedTabIndex = 0;
  public viewVisualizationTabDisabled = true;
  public selectVisualizationTabIndex = 2;
  public visualizationTabIndex = 3;
  public loaded$!: Observable<boolean>;
  public simVisualization: Visualization | null = null;
  //END OLD IMPLEMENTATION ATTRIBUTES

  public projectMetadata$!: Observable<ProjectMetadata | null>;
  public simulationRun$!: Observable<SimulationRunMetadata>;

  public projectFiles$!: Observable<File[]>;
  public files$!: Observable<Path[]>;
  public outputs$!: Observable<File[]>;
  public projectSummary$!: Observable<ProjectSummary>;

  public visualizations$!: Observable<VisualizationList[]>;
  public plotVisualizations$!: Observable<Visualization[]>;
  public isPanelExpanded = true;
  public themeColor = 'accent';

  public jsonLdData$!: Observable<WithContext<Dataset>>;

  public cards: any[] = [];
  public draggedIndex = -1;
  public sandboxSourceUrl =
    'https://deepnote.com/@biosimulators-playground/Untitled-project-717d0b91-cf50-4435-a706-ae083705b28e';

  @Input()
  public featureComingSoonMessage = 'Stay tuned! This exciting new feature is currently under development :)';

  public safeUrl: any;
  public url?: string;
  public sandboxUrl?: string;
  public jupyterliteSandboxUrl = 'https://alexpatrie.github.io/biosimulators-sandbox-test-repo-2/repl/index.html';
  public safeSandboxUrl: SafeResourceUrl;
  public isReRunTabExpanded = false;
  public useSanitizedUrl = false;

  private id!: string;

  public constructor(
    private service: ViewService,
    private projService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) {
    const rawUrl = 'https://alexpatrie.github.io/biosimulators-sandbox-test-repo-2/lab/index.html';
    this.safeSandboxUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  public ngOnInit(): void {
    this.sandboxUrl = this.getJupyterliteUrl();
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

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

  //START METHODS FROM THE OLD IMPLEMENTATION:
  public selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == this.visualizationTabIndex) {
      if (this.viewVisualizationTabDisabled) {
        this.selectedTabIndex = this.selectVisualizationTabIndex;
        return;
      }
    }
  }

  public renderVisualization(visualization: Visualization): void {
    this.simVisualization = visualization;
    this.viewVisualizationTabDisabled = false;
    this.selectedTabIndex = this.visualizationTabIndex;
  }
  //END METHODS FROM THE OLD IMPLEMENTATION

  public panelExpanded(i: number): void {
    if (i !== 0) {
      this.isPanelExpanded = false;
    } else {
      this.isPanelExpanded = true;
    }
  }

  private setupSnackbarConfig(cssClass: string[], data: any | null, dur: number): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.panelClass = cssClass;
    config.duration = dur;
    config.verticalPosition = 'top';
    config.data = data;
    return config;
  }

  public promptReRun(
    data = null,
    message: string | null = null,
    confirmActionMessage = 'Close',
    duration = 6000,
  ): void {
    if (!message) {
      message = this.featureComingSoonMessage;
    }
    const cssClassName = ['coming-soon-snackbar'];
    const snackbarConfig = this.setupSnackbarConfig(cssClassName, data, duration);
    this.snackBar.open(message, confirmActionMessage, snackbarConfig);
  }

  private getJupyterliteUrl(url = 'https://alexpatrie.github.io/biosimulators-sandbox-test-repo-2/repl/index.html') {
    return url;
  }

  private getColabUrl(
    url = 'https://colab.research.google.com/drive/1zWa_crEKXhqzPK4Wn5RJoKhuD4O4dVDs#scrollTo=urCTa8eaSleM',
  ) {
    return url;
  }

  private getDeepnoteUrl(
    url = 'https://embed.deepnote.com/717d0b91-cf50-4435-a706-ae083705b28e/0cdec188065948bd8f5e5411ab8a821c/d2a0c22bf8904116b4c2aba4b27a6100?height=7751',
  ) {
    return url;
  }

  private getSandboxUrl(source: string | any) {
    let sandboxUrl;
    if (source == 'colab') {
      sandboxUrl = this.getColabUrl();
    } else {
      if (source == 'deepnote') {
        sandboxUrl = this.getDeepnoteUrl();
      }
    }
    return sandboxUrl;
  }
}
