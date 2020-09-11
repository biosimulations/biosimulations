import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-simulators-terms-of-service',
  templateUrl: './simulators-terms-of-service.component.html',
  styleUrls: ['./simulators-terms-of-service.component.scss'],
})
export class SimulatorsTermsOfServiceComponent {
  // TODO: get from app config
  appName = 'BioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
