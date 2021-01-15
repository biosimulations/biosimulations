import { Component, Input, ViewChild } from '@angular/core';
import {
  RawSimulationLog,
  CombineArchiveLog,
  SedDocumentLog,
  SedTaskLog,
  SedReportLog,
  SedPlot2DLog,
  SedPlot3DLog,
  DataSetLogs,
  CurveLogs,
  SurfaceLogs,
  SimulationStatus,
  StructuredLogLevel,
} from '../../../../simulation-logs-datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common'
import { TocSection, TocSectionsContainerDirective } from '@biosimulations/shared/ui';
import { Observable } from 'rxjs';

interface StatusCount {
  color: string;
  label: string;
  count: number;
}

type StatusCountsMap = Map<SimulationStatus | null, StatusCount>;

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
  numSedDocuments = 0;
  numTasks = 0;
  numReports = 0;
  numPlots = 0;
  sedDocumentStatusCounts!: StatusCount[];
  taskStatusCounts!: StatusCount[];
  reportStatusCounts!: StatusCount[];
  plotStatusCounts!: StatusCount[];
  logHasSedDocuments = false;
  logHasTasks = false;
  logHasReports = false;
  logHasPlots = false;

  @Input()
  set structuredLog(value: CombineArchiveLog | undefined) {
    this._structuredLog = value;
    this.getStructuredLogLevel(value);
  }

  get structuredLog(): CombineArchiveLog | undefined {
    return this._structuredLog;
  }

  private getStructuredLogLevel(log: CombineArchiveLog | undefined) {
    let level: StructuredLogLevel = StructuredLogLevel.None;
    this.numSedDocuments = 0;
    this.numTasks = 0;
    this.numReports = 0;
    this.numPlots = 0;

    const sedDocumentStatusCountsMap = this.initStatusCountsMap();
    const taskStatusCountsMap = this.initStatusCountsMap();
    const reportStatusCountsMap = this.initStatusCountsMap();
    const plotStatusCountsMap = this.initStatusCountsMap();

    this.logHasSedDocuments = false;
    this.logHasTasks = false;
    this.logHasReports = false;
    this.logHasPlots = false;

    if (log !== undefined) {
      level = Math.max(level, StructuredLogLevel.CombineArchive);

      if (log?.sedDocuments) {
        this.logHasSedDocuments = true;

        for (const docLog of Object.values(log.sedDocuments)) {
          level = Math.max(level, StructuredLogLevel.SedDocument);
          this.numSedDocuments++;
          (sedDocumentStatusCountsMap.get((docLog as SedDocumentLog).status) as StatusCount).count++;

          if (docLog?.tasks) {
            this.logHasTasks = true;
            for (const taskLog of Object.values(docLog.tasks)) {
              level = Math.max(level, StructuredLogLevel.SedTaskOutput);
              this.numTasks++;
              (taskStatusCountsMap.get((taskLog as SedTaskLog).status) as StatusCount).count++;
              break;
            }
          }

          if (docLog?.outputs) {
            this.logHasReports = true;
            this.logHasPlots = true;

            for (const outputLog of Object.values(docLog.outputs)) {
              level = Math.max(level, StructuredLogLevel.SedTaskOutput);

              if (outputLog
                && 'dataSets' in outputLog
                && (outputLog as SedReportLog).dataSets
              ) {
                this.numReports++;
                (reportStatusCountsMap.get((outputLog as SedReportLog).status) as StatusCount).count++;
                const dataSetLogs = (outputLog as SedReportLog).dataSets as DataSetLogs;
                for (const dataSetLog of Object.values(dataSetLogs)) {
                  level = Math.max(level, StructuredLogLevel.SedDataSetCurveSurface);
                  break;
                }
              }

              if (outputLog
                && 'curves' in outputLog
                && (outputLog as SedPlot2DLog).curves
              ) {
                this.numPlots++;
                (plotStatusCountsMap.get((outputLog as SedPlot2DLog).status) as StatusCount).count++;
                const curveLogs = (outputLog as SedPlot2DLog).curves as CurveLogs;
                for (const curveLog of Object.values(curveLogs)) {
                  level = Math.max(level, StructuredLogLevel.SedDataSetCurveSurface);
                  break;
                }
              }

              if (outputLog
                && 'surfaces' in outputLog
                && (outputLog as SedPlot3DLog).surfaces
              ) {
                this.numPlots++;
                (plotStatusCountsMap.get((outputLog as SedPlot3DLog).status) as StatusCount).count++;
                const surfaceLogs = (outputLog as SedPlot3DLog).surfaces as SurfaceLogs;
                for (const surfaceLog of Object.values(surfaceLogs)) {
                  level = Math.max(level, StructuredLogLevel.SedDataSetCurveSurface);
                  break;
                }
              }
            }
          }
        }
      }
    }

    this.sedDocumentStatusCounts = this.convertStatusCountsMapToArray(sedDocumentStatusCountsMap);
    this.taskStatusCounts = this.convertStatusCountsMapToArray(taskStatusCountsMap);
    this.reportStatusCounts = this.convertStatusCountsMapToArray(reportStatusCountsMap);
    this.plotStatusCounts = this.convertStatusCountsMapToArray(plotStatusCountsMap);

    this.structuredLogLevel = level;
  }

  private initStatusCountsMap(): StatusCountsMap {
    const statusCounts: StatusCountsMap = new Map<SimulationStatus | null, StatusCount>();
    statusCounts.set(SimulationStatus.QUEUED, {
      color: SimulationStatus.QUEUED,
      label: 'Queued',
      count: 0,
    });
    statusCounts.set(SimulationStatus.RUNNING, {
      color: SimulationStatus.RUNNING,
      label: 'Running',
      count: 0,
    });
    statusCounts.set(SimulationStatus.SUCCEEDED, {
      color: SimulationStatus.SUCCEEDED,
      label: 'Succeeded',
      count: 0,
    });
    statusCounts.set(SimulationStatus.SKIPPED, {
      color: SimulationStatus.SKIPPED,
      label: 'Skipped',
      count: 0,
    });
    statusCounts.set(SimulationStatus.FAILED, {
      color: SimulationStatus.FAILED,
      label: 'Failed',
      count: 0,
    });
    statusCounts.set(null, {
      color: SimulationStatus.SUCCEEDED,
      label: 'Unknown',
      count: 0,
    });
    return statusCounts;
  }

  private convertStatusCountsMapToArray(map: StatusCountsMap): StatusCount[] {
    const order = [
      SimulationStatus.QUEUED,
      SimulationStatus.RUNNING,
      SimulationStatus.SUCCEEDED,
      SimulationStatus.SKIPPED,
      SimulationStatus.FAILED,
      null,
    ];

    const array: StatusCount[] = [];

    order.forEach((key: SimulationStatus | null): void => {
      const statusCount = map.get(key) as StatusCount;
      if (statusCount.count === 0) {
        statusCount.color = SimulationStatus.SUCCEEDED;
      } else {
        array.push(statusCount);
      }
    });

    return array;
  }

  naturalComparator(a: {key: string, value: any}, b: {key: string, value: any}): number {
    return a.key.localeCompare(b.key, undefined, { numeric: true });
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
