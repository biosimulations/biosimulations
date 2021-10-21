import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';
import exampleMetadata from './example-metadata.json';
import exampleFigureMetadata from './example-figure-metadata.json';

@Component({
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.sass'],
})
export class MetadataComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  exampleMetadata: string;
  exampleFigureMetadata: string;

  constructor(public config: ConfigService) {
    this.exampleMetadata = exampleMetadata;
    this.exampleFigureMetadata = exampleFigureMetadata;
  }
}
