import { Component, ViewChild } from '@angular/core';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-dispatch-terms-of-service',
  templateUrl: './dispatch-terms-of-service.component.html',
  styleUrls: ['./dispatch-terms-of-service.component.scss'],
})
export class DispatchTermsOfServiceComponent {
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
