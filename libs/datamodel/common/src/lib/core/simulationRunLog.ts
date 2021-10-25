export enum SimulationRunLogStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SKIPPED = 'SKIPPED',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN',
}

export interface Exception {
  category: string;
  message: string;
}

export interface SedOutputElementLog {
  id: string;
  status: SimulationRunLogStatus;
}

export interface SedOutputLog {
  id: string;
  status: SimulationRunLogStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
}

export interface SedReportLog extends SedOutputLog {
  dataSets: SedOutputElementLog[] | null;
}

export interface SedPlot2DLog extends SedOutputLog {
  curves: SedOutputElementLog[] | null;
}

export interface SedPlot3DLog extends SedOutputLog {
  surfaces: SedOutputElementLog[] | null;
}

export interface SimulatorDetail {
  key: string;
  value: any;
}

export interface SedTaskLog {
  id: string;
  status: SimulationRunLogStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  algorithm: string | null;
  simulatorDetails: SimulatorDetail[] | null;
}

export interface SedDocumentLog {
  location: string;
  status: SimulationRunLogStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  tasks: SedTaskLog[] | null;
  outputs: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null;
}

export interface CombineArchiveLog {
  status: SimulationRunLogStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  sedDocuments: SedDocumentLog[] | null;
}
