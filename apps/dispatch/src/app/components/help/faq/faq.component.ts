import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass'],
})
export class FaqComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  emailUrl!: string;
  modelLanguageDocsUrl!: string;
  exampleCombineArchivesUrl!: string;

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;

    this.modelLanguageDocsUrl = this.config.simulatorsAppUrl + 'conventions/simulation-experiments';
    this.exampleCombineArchivesUrl =
      'https://github.com/' +
      this.config.appConfig.exampleCombineArchives.repoOwnerName +
      '/tree' +
      '/' +
      this.config.appConfig.exampleCombineArchives.repoRef +
      '/' +
      config.appConfig.exampleCombineArchives.repoPath;
  }
}
