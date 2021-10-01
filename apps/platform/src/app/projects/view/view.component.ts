import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { BehaviorSubject, Observable, tap, combineLatest, map } from 'rxjs';
import { Spec as VegaSpec } from 'vega';
import { ProjectMetadata, Directory, File, List } from './view.model';
import { ViewService } from './view.service';

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loaded$!: Observable<true>;
  public loadingFigures$ = new BehaviorSubject(true);
  public projectMetadata$?: Observable<ProjectMetadata | undefined> = undefined;
  public figureMetadata$?: Observable<ArchiveMetadata[] | undefined> =
    undefined;
  public simulationRun$?: Observable<List[]>;
  public figures$?: Observable<
    {
      path: string;
      spec: Observable<string>;
      metadata: Observable<ArchiveMetadata>;
    }[]
  >;
  public vegaSpecs$?: Observable<
    { id: string; path: string; spec: Observable<VegaSpec> }[]
  >;
  public vegaFiles$?: Observable<any>;
  public projectFiles$?: Observable<(Directory | File)[]>;
  public files$?: Observable<(Directory | File)[]>;
  public outputs$?: Observable<File[]>;
  
  constructor(private service: ViewService, private route: ActivatedRoute) {}
  
  public showImage = new BehaviorSubject(false);
  
  public ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    
    this.projectMetadata$ = this.service.getFormattedProjectMetadata(id);
    this.simulationRun$ = this.service.getFormattedSimulationRun(id);

    this.projectFiles$ = this.service.getFormattedProjectFiles(id);
    this.files$ = this.service.getFormattedFiles(id);
    this.outputs$ = this.service.getFormattedOutputs(id);

    this.figureMetadata$ = this.service.getOtherMetadata(id).pipe(
      tap((_) => {
        this.loadingFigures$.next(false);
      }),
    );

    this.vegaFiles$ = this.service.getVegaFilesMetadata(id);
    this.vegaSpecs$ = this.service.getVegaVisualizations(id);    

    this.loaded$ = combineLatest(
      this.projectMetadata$,
      this.simulationRun$, 
      this.projectFiles$,
      this.files$,
      this.outputs$,
    ).pipe(
      map((observables: any) => {
        return true;
      }),
    );
  }
}
