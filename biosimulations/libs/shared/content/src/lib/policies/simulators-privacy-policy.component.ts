import { Component, ViewChild } from '@angular/core';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-simulators-privacy-policy',
  templateUrl: './simulators-privacy-policy.component.html',
  styleUrls: ['./simulators-privacy-policy.component.scss'],
})
export class SimulatorsPrivacyPolicyComponent {
  emailUrl!: string;
  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.getToc();
    });
  }

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
