import { Component, Input } from '@angular/core';
import { StructuredSimulationLog, SimulationStatus } from '../../../../simulation-logs-datamodel';
import * as Convert from 'ansi-to-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'biosimulations-structured-simulation-log-element',
  templateUrl: './structured-simulation-log-element.component.html',
  styleUrls: ['./structured-simulation-log-element.component.scss'],
})
export class StructuredSimulationLogElementComponent {
  SimulationStatus = SimulationStatus;

  constructor(private sanitizer: DomSanitizer){}

  @Input()
  elementId!: string;

  @Input()
  elementType!: string;
  
  heading!: string;

  private _log!: StructuredSimulationLog;

  formattedOutput!: SafeHtml | null;

  @Input()
  set log(value: StructuredSimulationLog) {
    this._log = value;
    this.heading = this.getHeading();

    const convert = new Convert();
    this.formattedOutput = value?.output ? this.sanitizer.bypassSecurityTrustHtml(convert.toHtml(value.output)) : null;
  }

  get log(): StructuredSimulationLog {
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