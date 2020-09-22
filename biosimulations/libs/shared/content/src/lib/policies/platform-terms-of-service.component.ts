import { Component, ViewChild } from '@angular/core';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-platform-terms-of-service',
  templateUrl: './platform-terms-of-service.component.html',
  styleUrls: ['./platform-terms-of-service.component.scss'],
})
export class PlatformTermsOfServiceComponent {
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
