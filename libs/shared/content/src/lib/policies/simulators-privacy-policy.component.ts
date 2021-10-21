import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-simulators-privacy-policy',
  templateUrl: './simulators-privacy-policy.component.html',
  styleUrls: ['./simulators-privacy-policy.component.scss'],
})
export class SimulatorsPrivacyPolicyComponent {
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
