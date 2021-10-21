import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass'],
})
export class OverviewComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  constructor(public config: ConfigService) {}
}
