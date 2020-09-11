import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-dispatch-terms-of-service',
  templateUrl: './dispatch-terms-of-service.component.html',
  styleUrls: ['./dispatch-terms-of-service.component.scss'],
})
export class DispatchTermsOfServiceComponent {
  // TODO: get from app config
  appName = 'runBioSimulations';

  constructor() {}

  emailUrl = 'mailto:' + 'info@biosimulators.org'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }

}
