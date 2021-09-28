/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import { BehaviorSubject } from 'rxjs';
import { MetadataValue } from '../view/view.model';
@Component({
  selector: 'biosimulations-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @Input() public loading: boolean | null = true;
  @Input() public metadata?: ArchiveMetadata | undefined;
  title?: string;
  abstract?: string;
  created?: string;
  modified?: string;
  description?: string;
  creators?: MetadataValue[];
  contributors?: MetadataValue[];
  citations?: MetadataValue[];
  license?: MetadataValue[];
  keywords?: MetadataValue[];
  predecessors?: MetadataValue[];
  taxa?: MetadataValue[];
  seeAlso?: MetadataValue[];
  successors?: MetadataValue[];
  thumbnails?: string[];
  sources?: MetadataValue[];
  funders?: MetadataValue[];
  identifiers?: MetadataValue[];

  constructor() {}
  public showImage = new BehaviorSubject(false);
  public ngOnInit(): void {
    this.title = this.metadata?.title;
    this.abstract = this.metadata?.abstract;
    this.created = this.metadata?.created?.toLocaleString
      ? this.metadata?.created.toLocaleString()
      : JSON.stringify(this.metadata?.created);
    this.modified = this.metadata?.modified?.toLocaleString
      ? this.metadata?.modified.toLocaleString()
      : JSON.stringify(this.metadata?.modified);
    this.description = this.metadata?.description;
    this.creators = this.metadata?.creators || [];
    this.contributors = this.metadata?.contributors || [];
    this.citations = this.metadata?.citations || [];
    this.license = this.metadata?.license || [];
    this.keywords = this.metadata?.keywords || [];
    this.predecessors = this.metadata?.predecessors || [];
    this.taxa = this.metadata?.taxa || [];
    this.seeAlso = this.metadata?.seeAlso || [];
    this.successors = this.metadata?.successors || [];
    this.sources = this.metadata?.sources || [];
    this.funders = this.metadata?.funders || [];
    this.identifiers = this.metadata?.identifiers || [];
    this.thumbnails = this.metadata?.thumbnails || [];
    if (this.thumbnails && this.thumbnails.length) {
      this.showImage.next(true);
    }
  }
}
