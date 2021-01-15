import { Component, Input } from '@angular/core';
import {
  SedDocumentLog,
  SedTaskLog,
  SedReportLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SimulationStatus,
  AlgorithmKisaoDescriptionFragment,
} from '../../../../simulation-logs-datamodel';
import * as Convert from 'ansi-to-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { OntologyService } from '../../../../services/ontology/ontology.service';
import { KisaoTerm } from '@biosimulations/datamodel/common';

type logTypes = SedDocumentLog | SedTaskLog | SedReportLog | SedPlot2DLog | SedPlot3DLog;

interface SimulatorDetail {
  key: string;
  value: string;
}

@Component({
  selector: 'biosimulations-structured-simulation-log-element',
  templateUrl: './structured-simulation-log-element.component.html',
  styleUrls: ['./structured-simulation-log-element.component.scss'],
})
export class StructuredSimulationLogElementComponent {
  constructor(private sanitizer: DomSanitizer, private ontologyService: OntologyService){}

  @Input()
  elementId!: string;

  @Input()
  elementType!: string;

  heading!: string;

  private _log!: logTypes;

  queued = true;
  noOutputMessage = '';
  formattedOutput!: SafeHtml | undefined;

  algorithmKisaoTerm: Observable<KisaoTerm> | undefined;
  algorithmKisaoTermDescription: Observable<AlgorithmKisaoDescriptionFragment[] | undefined> | undefined;
  formattedSimulatorDetails: SimulatorDetail[] | undefined;

  @Input()
  set log(value: logTypes) {
    this._log = value;
    this.heading = this.getHeading();

    switch (value.status) {
      case SimulationStatus.QUEUED:
        this.queued = true;
        this.noOutputMessage = '';
        break;
      case SimulationStatus.RUNNING:
        this.queued = false;
        this.noOutputMessage = 'Output is not yet available.';
        break;
      default:
        this.queued = false;
        this.noOutputMessage = 'No output was produced.';
        break;
    }

    const convert = new Convert();
    this.formattedOutput = value?.output ? this.sanitizer.bypassSecurityTrustHtml(convert.toHtml(value.output)) : undefined;

    if ('algorithm' in value && value.algorithm) {
      this.algorithmKisaoTerm = this.ontologyService.getKisaoTerm(value.algorithm);
      this.algorithmKisaoTermDescription = this.algorithmKisaoTerm.pipe(
        pluck('description'),
        map(this.ontologyService.formatKisaoDescription)
      );
    } else {
      this.algorithmKisaoTerm = undefined;
      this.algorithmKisaoTermDescription = undefined;
    }

    if ('simulatorDetails' in value && value.simulatorDetails && Object.keys(value.simulatorDetails).length) {
      this.formattedSimulatorDetails = Object.entries(value.simulatorDetails).map(
        (keyValue: [string, any]): SimulatorDetail => {
          const key = keyValue[0];
          const value = keyValue[1];
          return {
            key: keyValue[0],
            value: typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString(),
          }
        }
      );
    }
  }

  get log(): logTypes {
    return this._log;
  }

  getHeading(): string {
    const duration = this.log?.duration;

    return (
      this.elementType
      + ' '
      + this.elementId
      + ' '
      + '('
      + this.log.status.toLowerCase()
      + (typeof duration === 'number' ? ', ' + duration.toFixed(1) + ' s' : '')
      + ')'
    );
  }
}