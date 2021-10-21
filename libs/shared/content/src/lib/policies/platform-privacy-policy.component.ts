import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-platform-privacy-policy',
  templateUrl: './platform-privacy-policy.component.html',
  styleUrls: ['./platform-privacy-policy.component.scss'],
})
export class PlatformPrivacyPolicyComponent {
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
