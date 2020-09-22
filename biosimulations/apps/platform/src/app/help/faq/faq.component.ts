import { Component, ViewChild } from '@angular/core';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent {
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
