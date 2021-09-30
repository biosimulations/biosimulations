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
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { UtilsService } from '@biosimulations/shared/services';

interface Attribute {
  icon: BiosimulationsIcon;
  title: string;
  label: string;
  url: string | null;
}

@Component({
  selector: 'biosimulations-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent implements OnInit {
  @Input() public loading: boolean | null = true;
  @Input() public metadata?: ArchiveMetadata | undefined;
  
  thumbnails?: string[];
  
  title?: string;
  abstract?: string;
  creators?: MetadataValue[];
  description?: string;

  attributes?: Attribute[];

  constructor() {}
  public showThumbnails = new BehaviorSubject(false);

  public ngOnInit(): void {
    this.thumbnails = this.metadata?.thumbnails || [];
    if (this.thumbnails && this.thumbnails.length) {
      this.showThumbnails.next(true);
    }

    this.title = this.metadata?.title;
    this.abstract = this.metadata?.abstract;    
    this.creators = this.metadata?.creators || [];
    this.description = this.metadata?.description;
    
    this.attributes = [];

    this.addAttributes(this.metadata?.encodes, 'cell', 'Biology');
    this.addAttributes(this.metadata?.taxa, 'taxon', 'Taxon');
    this.addAttributes(this.metadata?.keywords, 'tags', 'Keyword');    
    this.addAttributes(this.metadata?.citations, 'file', 'Citation');
    this.addAttributes(this.metadata?.sources, 'file', 'Source');
    this.addAttributes(this.metadata?.seeAlso, 'info', 'More info');
    this.addAttributes(this.metadata?.identifiers, 'id', 'Cross reference');
    this.addAttributes(this.metadata?.predecessors, 'backward', 'Predecessor');
    this.addAttributes(this.metadata?.successors, 'forward', 'Successor');
    this.addAttributes(this.metadata?.license, 'license', 'License');
    this.addAttributes(this.metadata?.contributors, 'author', 'Curator');
    this.addAttributes(this.metadata?.funders, 'funding', 'Funder');

    if (this.metadata?.created) {
      this.attributes.push({
        icon: 'date',
        title: 'Created',
        label: UtilsService.formatDate(new Date(this.metadata?.created)),
        url: null,
      });
    }

    if (this.metadata?.modified.length) {
      this.attributes.push({
        icon: 'date',
        title: 'Last modified',
        label: UtilsService.formatDate(new Date(this.metadata?.modified[0])),
        url: null,
      });
    }
  }

  addAttributes(values: MetadataValue[] | undefined, icon: BiosimulationsIcon, title: string): void {
    values?.forEach((value: MetadataValue): void => {
      this?.attributes?.push({      
        icon: icon,
        title: title,
        label: (value.label || value.uri) as string,
        url: value.uri || null,
      });
    });
  }
}
