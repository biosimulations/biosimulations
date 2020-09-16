import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-platform-privacy-policy',
  templateUrl: './platform-privacy-policy.component.html',
  styleUrls: ['./platform-privacy-policy.component.scss'],
})
export class PlatformPrivacyPolicyComponent {
  // TODO: get from app config
  appName = 'BioSimulations';

  emailUrl = 'mailto:' + 'info@biosimulators.org'
  
  constructor() {}


  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }

}
