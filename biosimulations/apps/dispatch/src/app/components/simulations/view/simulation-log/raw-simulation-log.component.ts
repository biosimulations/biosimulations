import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RawSimulationLog } from '../../../../simulation-logs-datamodel';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';
import * as Convert from 'ansi-to-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'biosimulations-raw-simulation-log',
  templateUrl: './raw-simulation-log.component.html',
  styleUrls: ['./raw-simulation-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawSimulationLogComponent {
  constructor(private sanitizer: DomSanitizer) {}

  heading!: string;

  private _status!: SimulationRunLogStatus;

  @Input()
  set status(value: SimulationRunLogStatus) {
    this.heading =
      'Standard output and error for the entire COMBINE/OMEX archive (' +
      value.toLowerCase() +
      ')';
    this._status = value;
  }

  get status(): SimulationRunLogStatus {
    return this._status;
  }

  formattedLog!: SafeHtml | null;

  @Input()
  set log(value: RawSimulationLog) {
    const convert = new Convert();
    this.formattedLog = value
      ? this.sanitizer.sanitize(0, convert.toHtml(value))
      : null;
  }
}
