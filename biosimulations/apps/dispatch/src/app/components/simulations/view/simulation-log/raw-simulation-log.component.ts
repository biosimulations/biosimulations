import { Component, Input } from '@angular/core';
import { RawSimulationLog } from '../../../../simulation-logs-datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common'
import * as Convert from 'ansi-to-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'biosimulations-raw-simulation-log',
  templateUrl: './raw-simulation-log.component.html',
  styleUrls: ['./raw-simulation-log.component.scss'],
})
export class RawSimulationLogComponent {
  constructor(private sanitizer: DomSanitizer){}

  heading!: string;

  private _status!: SimulationRunStatus;

  @Input()
  set status(value: SimulationRunStatus) {
    this.heading = 'Raw standard output and error for the entire job (' + value.toLowerCase() + ')';
    this._status = value;
  }

  get status(): SimulationRunStatus {
    return this._status;
  }

  formattedLog!: SafeHtml | null;

  @Input()
  set log(value: RawSimulationLog) {
    const convert = new Convert();
    this.formattedLog = value ? this.sanitizer.bypassSecurityTrustHtml(convert.toHtml(value)) : null;
  }
}
