import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';

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
  public simulationInfo$?: Observable<any>;
  public figures$?: Observable<
    {
      path: string;
      spec: Observable<string>;
      metadata: Observable<ArchiveMetadata>;
    }[]
  >;
  public vegaSpecs$?: Observable<
    { path: string; spec: Observable<{ $schema: string }> }[]
  >;
  public vegaFiles$?: Observable<any>;
  constructor(private service: ViewService, private route: ActivatedRoute) {}
  public showImage = new BehaviorSubject(false);
  public ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.metadata$ = this.service.getArchiveMetadata(id).pipe(
      tap((_) => {
        this.loading$.next(false);
      }),
      shareReplay(1),
    );
    this.figureMetadata$ = this.service.getOtherMetdata(id).pipe(
      tap((_) => {
        this.loadingFigures$.next(false);
        console.log(_);
      }),
      shareReplay(1),
    );
    this.simulationInfo$ = this.service.getSimulationRunMetadata(id);
    this.vegaFiles$ = this.service.getVegaFilesMetadata(id);
    this.vegaSpecs$ = this.service
      .getVegaVisualizations(id)
      .pipe(tap((_) => console.error(_)));
  }
}
