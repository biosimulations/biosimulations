import { Component, Input, ViewChild } from '@angular/core';
import {
  RawSimulationLog,
  CombineArchiveLog,
  SedDocumentLog,
  SedTaskLog,
  SedReportLog,
  SedPlot2DLog,
  SedPlot3DLog,
  StructuredLogLevel,
} from '../../../../simulation-logs-datamodel';
import {
  SimulationRunLogStatus,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
import {
  TocSection,
  TocSectionsContainerDirective,
} from '@biosimulations/shared/ui';
import { ScrollService } from '@biosimulations/shared/services';
import { Observable } from 'rxjs';

interface StatusCount {
  color: string;
  label: string;
  count: number;
}

type StatusCountsMap = Map<SimulationRunLogStatus | null, StatusCount>;

@Component({
  selector: 'biosimulations-simulation-log',
  templateUrl: './simulation-log.component.html',
  styleUrls: ['./simulation-log.component.scss'],
})
export class SimulationLogComponent {
  constructor(private scrollService: ScrollService) {}

  @Input()
  status!: SimulationRunLogStatus;

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

  taskLogs: { doc: SedDocumentLog; task: SedTaskLog }[] = [];
  reportLogs: { doc: SedDocumentLog; report: SedReportLog }[] = [];
  plotLogs: { doc: SedDocumentLog; plot: SedPlot2DLog | SedPlot3DLog }[] = [];

  @Input()
  set structuredLog(value: CombineArchiveLog | undefined) {
    this._structuredLog = value;
    this.procssStructuredLog(value);
  }

  get structuredLog(): CombineArchiveLog | undefined {
    return this._structuredLog;
  }

  private procssStructuredLog(log: CombineArchiveLog | undefined) {
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
        this.numSedDocuments = log.sedDocuments.length;
        log.sedDocuments.sort(this.locationComparator);

        for (const docLog of log.sedDocuments) {
          level = Math.max(level, StructuredLogLevel.SedDocument);
          (sedDocumentStatusCountsMap.get(docLog.status) as StatusCount)
            .count++;

          if (docLog?.tasks) {
            this.logHasTasks = true;
            this.numTasks += docLog.tasks.length;
            docLog.tasks.sort(this.idComparator);

            for (const taskLog of docLog.tasks) {
              level = Math.max(level, StructuredLogLevel.SedTaskOutput);
              (taskStatusCountsMap.get(taskLog.status) as StatusCount).count++;
              break;
            }
          }

          if (docLog?.outputs) {
            this.logHasReports = true;
            this.logHasPlots = true;
            docLog.outputs.sort(this.idComparator);

            for (const outputLog of docLog.outputs) {
              level = Math.max(level, StructuredLogLevel.SedTaskOutput);

              if (
                outputLog &&
                'dataSets' in outputLog &&
                (outputLog as SedReportLog).dataSets
              ) {
                const reportLog = outputLog as SedReportLog;
                this.numReports++;
                (reportStatusCountsMap.get(reportLog.status) as StatusCount)
                  .count++;
                if (reportLog.dataSets) {
                  level = Math.max(
                    level,
                    StructuredLogLevel.SedDataSetCurveSurface,
                  );
                }
              }

              if (
                outputLog &&
                'curves' in outputLog &&
                (outputLog as SedPlot2DLog).curves
              ) {
                this.numPlots++;
                const plot2dLog = outputLog as SedPlot2DLog;
                (plotStatusCountsMap.get(plot2dLog.status) as StatusCount)
                  .count++;
                if (plot2dLog.curves) {
                  level = Math.max(
                    level,
                    StructuredLogLevel.SedDataSetCurveSurface,
                  );
                }
              }

              if (
                outputLog &&
                'surfaces' in outputLog &&
                (outputLog as SedPlot3DLog).surfaces
              ) {
                this.numPlots++;
                const plot3dLog = outputLog as SedPlot3DLog;
                (plotStatusCountsMap.get(plot3dLog.status) as StatusCount)
                  .count++;
                if (plot3dLog.surfaces) {
                  level = Math.max(
                    level,
                    StructuredLogLevel.SedDataSetCurveSurface,
                  );
                }
              }
            }
          }
        }
      }
    }

    if (level >= StructuredLogLevel.SedTaskOutput) {
      const tasks: { doc: SedDocumentLog; task: SedTaskLog }[] = [];
      const reports: { doc: SedDocumentLog; report: SedReportLog }[] = [];
      const plots: {
        doc: SedDocumentLog;
        plot: SedPlot2DLog | SedPlot3DLog;
      }[] = [];

      log?.sedDocuments?.forEach((docLog: SedDocumentLog): void => {
        docLog?.tasks?.forEach((taskLog: SedTaskLog): void => {
          tasks.push({ doc: docLog, task: taskLog });
        });

        docLog?.outputs?.forEach(
          (outputLog: SedReportLog | SedPlot2DLog | SedPlot3DLog): void => {
            if ('dataSets' in outputLog) {
              reports.push({ doc: docLog, report: outputLog });
            } else {
              plots.push({ doc: docLog, plot: outputLog });
            }
          },
        );
      });

      this.taskLogs = tasks;
      this.reportLogs = reports;
      this.plotLogs = plots;
    } else {
      this.taskLogs = [];
      this.reportLogs = [];
      this.plotLogs = [];
    }

    this.sedDocumentStatusCounts = this.convertStatusCountsMapToArray(
      sedDocumentStatusCountsMap,
    );
    this.taskStatusCounts = this.convertStatusCountsMapToArray(
      taskStatusCountsMap,
    );
    this.reportStatusCounts = this.convertStatusCountsMapToArray(
      reportStatusCountsMap,
    );
    this.plotStatusCounts = this.convertStatusCountsMapToArray(
      plotStatusCountsMap,
    );

    this.structuredLogLevel = level;
  }

  private initStatusCountsMap(): StatusCountsMap {
    const statusCounts: StatusCountsMap = new Map<
      SimulationRunLogStatus | null,
      StatusCount
    >();
    statusCounts.set(SimulationRunLogStatus.QUEUED, {
      color: SimulationRunLogStatus.QUEUED,
      label: 'Queued',
      count: 0,
    });
    statusCounts.set(SimulationRunLogStatus.RUNNING, {
      color: SimulationRunLogStatus.RUNNING,
      label: 'Running',
      count: 0,
    });
    statusCounts.set(SimulationRunLogStatus.SUCCEEDED, {
      color: SimulationRunLogStatus.SUCCEEDED,
      label: 'Succeeded',
      count: 0,
    });
    statusCounts.set(SimulationRunLogStatus.SKIPPED, {
      color: SimulationRunLogStatus.SKIPPED,
      label: 'Skipped',
      count: 0,
    });
    statusCounts.set(SimulationRunLogStatus.FAILED, {
      color: SimulationRunLogStatus.FAILED,
      label: 'Failed',
      count: 0,
    });
    statusCounts.set(SimulationRunLogStatus.UNKNOWN, {
      color: SimulationRunLogStatus.SUCCEEDED,
      label: 'Unknown',
      count: 0,
    });
    statusCounts.set(null, {
      color: SimulationRunLogStatus.SUCCEEDED,
      label: 'Unknown',
      count: 0,
    });
    return statusCounts;
  }

  private convertStatusCountsMapToArray(map: StatusCountsMap): StatusCount[] {
    const order = [
      SimulationRunLogStatus.QUEUED,
      SimulationRunLogStatus.RUNNING,
      SimulationRunLogStatus.SUCCEEDED,
      SimulationRunLogStatus.SKIPPED,
      SimulationRunLogStatus.FAILED,
      SimulationRunLogStatus.UNKNOWN,
      null,
    ];

    const array: StatusCount[] = [];

    order.forEach((key: SimulationRunLogStatus | null): void => {
      const statusCount = map.get(key) as StatusCount;
      if (statusCount.count === 0) {
        statusCount.color = SimulationRunLogStatus.SUCCEEDED;
      } else {
        array.push(statusCount);
      }
    });

    return array;
  }

  locationComparator(a: any, b: any): number {
    return a.location.localeCompare(b.location, undefined, { numeric: true });
  }

  idComparator(a: any, b: any): number {
    return a.id.localeCompare(b.id, undefined, { numeric: true });
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

  private scrollOffset = 64 + 32 + 32;

  scrollToElement(id: string): void {
    const scrollTarget = document.getElementById(id) as HTMLElement;
    this.scrollService.scrollToElement(scrollTarget, this.scrollOffset);
  }

  downloadRawLog(): void {
    this.downloadLog(this.rawLog, 'log.txt', 'text/plain');
  }

  downloadStructuredLog(): void {
    this.downloadLog(
      JSON.stringify(this.structuredLog, null, 2),
      'log.json',
      'application/json',
    );
  }

  private downloadLog(log: string, fileName: string, mimeType: string): void {
    const blob = new Blob([log], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }
}
