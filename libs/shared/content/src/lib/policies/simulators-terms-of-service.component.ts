import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-simulators-terms-of-service',
  templateUrl: './simulators-terms-of-service.component.html',
  styleUrls: ['./simulators-terms-of-service.component.scss'],
})
export class SimulatorsTermsOfServiceComponent {
  emailUrl!: string;
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
