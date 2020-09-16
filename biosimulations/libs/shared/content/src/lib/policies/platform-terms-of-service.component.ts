import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-platform-terms-of-service',
  templateUrl: './platform-terms-of-service.component.html',
  styleUrls: ['./platform-terms-of-service.component.scss'],
})
export class PlatformTermsOfServiceComponent {
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
