import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Spec as VegaSpec } from 'vega';
import { Directory, File, List } from '../datamodel';
import { ViewService } from './view.service';

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public loading$ = new BehaviorSubject(true);
  public loadingFigures$ = new BehaviorSubject(true);
  public metadata$?: Observable<ArchiveMetadata | undefined> = undefined;
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
    this.metadata$ = this.service.getArchiveMetadata(id).pipe(
      tap((_) => {
        this.loading$.next(false);
      }),
    );

    this.figureMetadata$ = this.service.getOtherMetadata(id).pipe(
      tap((_) => {
        this.loadingFigures$.next(false);
      }),
    );

    this.simulationRun$ = this.service.getSimulationRun(id);

    this.vegaFiles$ = this.service.getVegaFilesMetadata(id);

    this.projectFiles$ = this.service.getProjectFiles(id);

    this.files$ = this.service.getFiles(id);

    this.vegaSpecs$ = this.service.getVegaVisualizations(id);

    this.outputs$ = this.service.getOutputs(id);
  }
}
