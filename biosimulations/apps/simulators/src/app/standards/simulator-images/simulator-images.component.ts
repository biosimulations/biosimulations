import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';
import exampleDockerfile from './example-dockerfile.json';

@Component({
  templateUrl: './simulator-images.component.html',
  styleUrls: ['./simulator-images.component.sass'],
})
export class SimulatorImagesComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  exampleDockerfile: string = exampleDockerfile as string;

  constructor(public config: ConfigService) {}
}
