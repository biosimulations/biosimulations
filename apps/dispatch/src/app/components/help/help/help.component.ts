import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent {
  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  exampleCombineArchivesUrl!: string;

  constructor(public config: ConfigService) {
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
