import { Component, Input } from '@angular/core';
import { AlgorithmKisaoDescriptionFragment } from '../../../../simulation-logs-datamodel';
import Anser from 'anser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { OntologyService } from '@biosimulations/ontology/client';
import { StructuredSimulationLogElementService } from './structured-simulation-log-element.service';
import {
  SedDocumentLog,
  SedTaskLog,
  SedReportLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SimulatorDetail,
  CombineArchiveLog,
  KisaoTerm,
  SimulationRunLogStatus,
} from '@biosimulations/datamodel/common';
import { IconActionType } from '@biosimulations/shared/ui';

type logTypes =
  | SedDocumentLog
  | SedTaskLog
  | SedReportLog
  | SedPlot2DLog
  | SedPlot3DLog
  | CombineArchiveLog;

interface FormattedSimulatorDetail {
  key: string;
  value: string;
}

@Component({
  selector: 'biosimulations-structured-simulation-log-element',
  templateUrl: './structured-simulation-log-element.component.html',
  styleUrls: ['./structured-simulation-log-element.component.scss'],
})
export class StructuredSimulationLogElementComponent {
  public constructor(
    private sanitizer: DomSanitizer,
    private ontologyService: OntologyService,
    private structuredLogService: StructuredSimulationLogElementService,
  ) {}

  @Input()
  public isStructuredLog = true;

  @Input()
  public elementId!: string;

  @Input()
  public elementType!: string;

  @Input()
  public compact = false;

  @Input()
  public iconActionType: IconActionType = 'scrollToTop';

  @Input()
  public first = false;

  @Input()
  public last = false;

  public heading!: string;

  private _log!: logTypes;

  public noOutputMessage = '';
  public formattedOutput!: SafeHtml | undefined;

  public algorithmKisaoTerm: Observable<KisaoTerm> | undefined;
  public algorithmKisaoTermDescription:
    | Observable<AlgorithmKisaoDescriptionFragment[] | undefined>
    | undefined;
  public formattedSimulatorDetails: FormattedSimulatorDetail[] | undefined;

  @Input()
  public set log(value: logTypes) {
    this._log = value;
    this.heading = this.getHeading();

    switch (value.status) {
      case SimulationRunLogStatus.QUEUED: {
        const elementType =
          this.elementType.substring(0, 1).toLowerCase() +
          this.elementType.substring(1);
        this.noOutputMessage = `Output will be available once the ${elementType} completes.`;
        break;
      }
      case SimulationRunLogStatus.RUNNING:
        this.noOutputMessage = 'Output is not yet available.';
        break;
      default:
        this.noOutputMessage = 'No output was produced.';
        break;
    }

    this.formattedOutput = value?.output
      ? Anser.ansiToHtml(value.output, { use_classes: true })
      : undefined;

    if ('algorithm' in value && value.algorithm) {
      this.algorithmKisaoTerm = this.ontologyService.getKisaoTerm(
        value.algorithm,
      );
      this.algorithmKisaoTermDescription = this.algorithmKisaoTerm.pipe(
        pluck('description'),
        map(this.structuredLogService.formatKisaoDescription),
      );
    } else {
      this.algorithmKisaoTerm = undefined;
      this.algorithmKisaoTermDescription = undefined;
    }

    if ('simulatorDetails' in value && value?.simulatorDetails?.length) {
      this.formattedSimulatorDetails = value.simulatorDetails.map(
        (keyValue: SimulatorDetail): FormattedSimulatorDetail => {
          const key = keyValue.key;
          const value = keyValue?.value;
          let strValue!: string;
          if (value === undefined || value === null) {
            strValue = 'null';
          } else if (typeof value === 'object') {
            strValue = JSON.stringify(value, null, 2);
          } else if (value === '') {
            strValue = ' ';
          } else {
            strValue = value.toString();
          }
          return {
            key: key,
            value: strValue,
          };
        },
      );
    }
  }

  public get log(): logTypes {
    return this._log;
  }

  public getHeading(): string {
    const duration = this.log?.duration;

    return (
      this.elementType +
      (this.elementId ? ' ' + this.elementId : '') +
      ' ' +
      '(' +
      this.log.status.toLowerCase() +
      (typeof duration === 'number' ? ', ' + duration.toFixed(1) + ' s' : '') +
      ')'
    );
  }
}
