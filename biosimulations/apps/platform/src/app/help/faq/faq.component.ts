import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent {
  // TODO: get from app config
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  emailUrl = 'mailto:' + 'info@biosimulations.org'
  biosimulatorsIssueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  submitAppUrl = 'https://submit.biosimulations.org/'
  webserviceUrl = 'https://dispatch.biosimulations.org/'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
