import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ConfigService } from '@biosimulations/shared/angular';

import initElementLevelLog from './init-element-level-log.json';
import finalSucceededElementLevelLog from './final-succeeded-element-level-log.json';
import finalFailedElementLevelLog from './final-failed-element-level-log.json';
import finalFailedDocLevelLog from './final-failed-doc-level-log.json';

@Component({
  templateUrl: './simulation-logs.component.html',
  styleUrls: ['./simulation-logs.component.sass'],
})
export class SimulationLogsComponent {
  tocSections!: Observable<TocSection[]>;

  openApiSpecsUrl: string;
  jsonSchemaUrl: string;

  initElementLevelLog: string;
  finalSucceededElementLevelLog: string;
  finalFailedElementLevelLog: string;
  finalFailedDocLevelLog: string;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  constructor(public config: ConfigService) {
    this.openApiSpecsUrl = config.dispatchApiUrl + 'openapi.json';
    this.jsonSchemaUrl =
      config.dispatchApiUrl + 'schema/CombineArchiveLog.json';

    this.initElementLevelLog = JSON.stringify(initElementLevelLog, null, 2);
    this.finalSucceededElementLevelLog = JSON.stringify(
      finalSucceededElementLevelLog,
      null,
      2,
    );
    this.finalFailedElementLevelLog = JSON.stringify(
      finalFailedElementLevelLog,
      null,
      2,
    );
    this.finalFailedDocLevelLog = JSON.stringify(
      finalFailedDocLevelLog,
      null,
      2,
    );
  }
}
