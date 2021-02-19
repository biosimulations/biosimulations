import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RawSimulationLog } from '../../../../simulation-logs-datamodel';
import {
  SimulationRunLogStatus,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
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
  logStatus!: SimulationRunLogStatus;
  private _status!: SimulationRunStatus;

  @Input()
  set status(input: SimulationRunStatus) {
    this.heading =
      'Standard output and error for the entire COMBINE/OMEX archive (' +
      input.toLowerCase() +
      ')';
    // TODO remove repetition
    this._status = input;
    switch (input) {
      case SimulationRunStatus.CREATED: {
        this.logStatus = SimulationRunLogStatus.RUNNING;
        break;
      }
      case SimulationRunStatus.QUEUED: {
        this.logStatus = SimulationRunLogStatus.QUEUED;
        break;
      }
      case SimulationRunStatus.FAILED: {
        this.logStatus = SimulationRunLogStatus.FAILED;
        break;
      }
      case SimulationRunStatus.PROCESSING: {
        this.logStatus = SimulationRunLogStatus.RUNNING;
        break;
      }
      case SimulationRunStatus.RUNNING: {
        this.logStatus = SimulationRunLogStatus.RUNNING;
        break;
      }
      case SimulationRunStatus.SUCCEEDED: {
        this.logStatus = SimulationRunLogStatus.SUCCEEDED;
      }
    }
  }

  get status(): SimulationRunStatus {
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
