import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  selector: 'biosimulations-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass'],
})
export class AboutComponent {
  // TODO: get from app config
  appUrl = 'https://biosimulations.org/'
  apiUrl = 'https://api.biosimulations.org/'
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  emailUrl = 'mailto:' + 'info@biosimulations.org'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
