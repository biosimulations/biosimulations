import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { MetadataValue } from './view.model';
import { ViewService } from './view.service';

@Component({
  selector: 'biosimulations-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],  
})
export class ViewComponent implements OnInit {
  public loading$ = new BehaviorSubject(true);
  metadata?: Observable<ArchiveMetadata | undefined> = undefined;
  title?: Observable<string | undefined>;
  abstract?: Observable<string | undefined>;
  created?: Observable<string | undefined>;
  modified?: Observable<string[] | undefined>;
  description?: Observable<string | undefined>;
  creators?: Observable<MetadataValue[] | undefined>;
  contributors?: Observable<MetadataValue[] | undefined>;
  citations?: Observable<MetadataValue[] | undefined>;
  license?: Observable<MetadataValue | undefined>;
  keywords?: Observable<MetadataValue[] | undefined>;
  predecessors?: Observable<MetadataValue[] | undefined>;
  taxa?: Observable<MetadataValue[]>;
  seeAlso?: Observable<MetadataValue[] | undefined>;
  successors?: Observable<MetadataValue[] | undefined>;
  thumbnails?: Observable<string[] | undefined>;
  sources?: Observable<MetadataValue[] | undefined>;
  funders?: Observable<MetadataValue[] | undefined>;
  identifiers?: Observable<MetadataValue[] | undefined>;

  constructor(private service: ViewService, private route: ActivatedRoute) {}
  public showImage = new BehaviorSubject(false);
  public ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.metadata = this.service.getArchiveMetadata(id).pipe(
      tap((_) => {
        this.loading$.next(false);
        shareReplay(1);
      }),
    );
    this.title = this.metadata?.pipe(map((metadata) => metadata?.title));
    this.abstract = this.metadata?.pipe(map((metadata) => metadata?.abstract));
    this.citations = this.metadata?.pipe(
      map((metadata) => metadata?.citations),
    );
    this.contributors = this.metadata.pipe(
      map((metadata) => metadata?.contributors || []),
    );
    this.creators = this.metadata?.pipe(
      map((metadata) => metadata?.creators || undefined),
    );
    this.sources = this.metadata?.pipe(map((metadata) => metadata?.sources));
    this.created = this.metadata?.pipe(
      map((metadata) =>
        metadata?.created?.toLocaleString
          ? metadata?.created.toLocaleString()
          : JSON.stringify(metadata?.created),
      ),
    );
    this.modified = this.metadata?.pipe(
      map((metadata) =>
        metadata?.modified?.map((date) =>
          date.toLocaleString ? date.toLocaleString() : JSON.stringify(date),
        ),
      ),
    );
    this.description = this.metadata?.pipe(
      map((metadata) => metadata?.description),
    );
    this.license = this.metadata?.pipe(map((metadata) => metadata?.license));
    this.keywords = this.metadata?.pipe(map((metadata) => metadata?.keywords));
    this.predecessors = this.metadata?.pipe(
      map((metadata) => metadata?.predecessors),
    );
    this.funders = this.metadata.pipe(map((metadata) => metadata?.funders));
    this.taxa = this.metadata?.pipe(map((metadata) => metadata?.taxa || []));
    this.seeAlso = this.metadata.pipe(map((metadata) => metadata?.seeAlso));
    this.identifiers = this.metadata.pipe(
      map((metadata) => metadata?.identifiers),
    );
    this.successors = this.metadata?.pipe(
      map((metadata) => metadata?.successors),
    );

    this.thumbnails = this.metadata?.pipe(
      map((metadata) => metadata?.thumbnails),
      tap((thumbnails) => {
        if (thumbnails && thumbnails.length) {
          this.showImage.next(true);
        }
      }),
    );
  }
}
