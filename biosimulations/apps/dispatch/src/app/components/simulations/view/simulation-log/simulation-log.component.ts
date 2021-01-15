import { Component, Input, ViewChild } from '@angular/core';
import {
  RawSimulationLog,
  CombineArchiveLog,
  SedReportLog,
  SedPlot2DLog,
  SedPlot3DLog,
  DataSetLogs,
  CurveLogs,
  SurfaceLogs,
  StructuredLogLevel,
} from '../../../../simulation-logs-datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common'
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-simulation-log',
  templateUrl: './simulation-log.component.html',
  styleUrls: ['./simulation-log.component.scss'],
})
export class SimulationLogComponent {
  @Input()
  status!: SimulationRunStatus;

  @Input()
  rawLog!: RawSimulationLog;

  StructuredLogLevel = StructuredLogLevel;
  private _structuredLog: CombineArchiveLog | undefined = undefined;
  structuredLogLevel: StructuredLogLevel | undefined = undefined;
  archiveHasTasks = false;
  archiveHasOutputs = false;
  logHasTasks = false;
  logHasOutputs = false;

  @Input()
  set structuredLog(value: CombineArchiveLog | undefined) {
    this._structuredLog = value;
    this.structuredLogLevel = this.getStructuredLogLevel(value);
  }

  get structuredLog(): CombineArchiveLog | undefined {
    return this._structuredLog;
  }

  getStructuredLogLevel(log: CombineArchiveLog | undefined): StructuredLogLevel {
    let level: StructuredLogLevel = StructuredLogLevel.None;
    this.archiveHasTasks = false;
    this.archiveHasOutputs = false;
    this.logHasTasks = false;
    this.logHasOutputs = false;

    if (log !== undefined) {
      level = Math.max(level, StructuredLogLevel.CombineArchive);

      if (level < StructuredLogLevel.SedDocument && log?.sedDocuments) {
        for (const docLog of Object.values(log.sedDocuments)) {
          level = StructuredLogLevel.SedDocument;

          if (level < StructuredLogLevel.SedTaskOutput && docLog?.tasks) {
            this.logHasTasks = true;
            for (const taskLog of Object.values(docLog.tasks)) {
              level = StructuredLogLevel.SedTaskOutput;
              this.archiveHasTasks = true;
              break;
            }
          }

          if (level < StructuredLogLevel.SedTaskOutput && docLog?.outputs) {
            this.logHasOutputs = true;

            for (const outputLog of Object.values(docLog.outputs)) {
              level = StructuredLogLevel.SedTaskOutput;
              this.archiveHasOutputs = true;

              if (level < StructuredLogLevel.SedDataSetCurveSurface
                && outputLog
                && 'dataSets' in outputLog
                && (outputLog as SedReportLog).dataSets
              ) {
                const dataSetLogs = (outputLog as SedReportLog).dataSets as DataSetLogs;
                for (const dataSetLog of Object.values(dataSetLogs)) {
                  level = StructuredLogLevel.SedDataSetCurveSurface;                  
                  break;
                }
              }

              if (level < StructuredLogLevel.SedDataSetCurveSurface
                && outputLog
                && 'curves' in outputLog
                && (outputLog as SedPlot2DLog).curves
              ) {
                const curveLogs = (outputLog as SedPlot2DLog).curves as CurveLogs;
                for (const curveLog of Object.values(curveLogs)) {
                  level = StructuredLogLevel.SedDataSetCurveSurface;
                  break;
                }
              }

              if (level < StructuredLogLevel.SedDataSetCurveSurface
                && outputLog
                && 'surfaces' in outputLog
                && (outputLog as SedPlot3DLog).surfaces
              ) {
                const surfaceLogs = (outputLog as SedPlot3DLog).surfaces as SurfaceLogs;
                for (const surfaceLog of Object.values(surfaceLogs)) {
                  level = StructuredLogLevel.SedDataSetCurveSurface;
                  break;
                }
              }
            }
          }
        }
      }
    }

    return level;
  }

  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    if (container) {
      setTimeout(() => {
        this.tocSections = container.sections$;
      });
    }
  }

  downloadRawLog(): void {
    this.downloadLog(this.rawLog, 'log.txt', 'text/plain');
  }

  downloadStructuredLog(): void {
    this.downloadLog(JSON.stringify(this.structuredLog, null, 2), 'log.json', 'application/json');
  }

  private downloadLog(log: string, fileName: string, mimeType: string): void {
    const blob = new Blob([log], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }
}
