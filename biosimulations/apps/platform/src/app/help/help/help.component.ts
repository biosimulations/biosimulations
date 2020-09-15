import { Component, ViewChild } from '@angular/core';
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent {
  // TODO: get from app config
  apiUrl = 'https://api.biosimulations.org/'  
  submitAppUrl = 'https://submit.biosimulations.org/'
  submitAppHelpUrl = this.submitAppUrl + 'help'
  webserviceUrl = 'https://dispatch.biosimulations.org/'

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
