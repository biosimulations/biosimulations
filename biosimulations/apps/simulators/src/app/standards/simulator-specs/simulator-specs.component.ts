import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';
import exampleSpecs from './example-specs.json';

@Component({
  templateUrl: './simulator-specs.component.html',
  styleUrls: ['./simulator-specs.component.sass'],
})
export class SimulatorSpecsComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  openApiUrl: string;
  exampleSpecs: string;

  constructor(public config: ConfigService) {
    this.openApiUrl = config.apiUrl + 'openapi.json';
    this.exampleSpecs = JSON.stringify(exampleSpecs, null, 2);
  }
}
