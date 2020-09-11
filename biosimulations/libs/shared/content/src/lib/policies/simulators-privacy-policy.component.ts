import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-simulators-privacy-policy',
  templateUrl: './simulators-privacy-policy.component.html',
  styleUrls: ['./simulators-privacy-policy.component.scss'],
})
export class SimulatorsPrivacyPolicyComponent {
  // TODO: get from app config
  appName = 'BioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
