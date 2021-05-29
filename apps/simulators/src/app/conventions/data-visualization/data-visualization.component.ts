import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import exampleVegaSedml from './example-vega-sedml.json';

@Component({
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.sass'],
})
export class DataVisualizationComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  exampleSedml: string;
  exampleVega: string;
  exampleVegaSedml: string;

  constructor() {
    this.exampleSedml = JSON.stringify(exampleVegaSedml.data.values, null, 2);

    const exampleVega = JSON.parse(JSON.stringify(exampleVegaSedml));
    exampleVega.data.values = null;
    this.exampleVega = JSON.stringify(exampleVega, null, 2);

    this.exampleVegaSedml = JSON.stringify(exampleVegaSedml, null, 2);
  }
}
