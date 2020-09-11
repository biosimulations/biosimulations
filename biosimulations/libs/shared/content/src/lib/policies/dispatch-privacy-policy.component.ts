import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-dispatch-privacy-policy',
  templateUrl: './dispatch-privacy-policy.component.html',
  styleUrls: ['./dispatch-privacy-policy.component.scss'],
})
export class DispatchPrivacyPolicyComponent {
  // TODO: get from app config
  appName = 'runBioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
