/* Raw log */
export type RawSimulationLog = string;

/* Structured log */
export enum StructuredLogLevel {
  None = 0,
  CombineArchive = 1,
  SedDocument = 2,
  SedTaskOutput = 3,
  SedDataSetCurveSurface = 4,
}

export enum SimulationStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}

export interface Exception {
  category: string;
  message: string;
}

export interface StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
}

export interface SedOutputLog extends StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
}

export type DataSetLogs = {
  [dataSetId: string]: SimulationStatus;
};

export type CurveLogs = {
  [curveId: string]: SimulationStatus;
};

export type SurfaceLogs = {
  [surfaceId: string]: SimulationStatus;
};

export interface SedReportLog extends SedOutputLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  dataSets: DataSetLogs | null;
}

export interface SedPlot2DLog extends SedOutputLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  curves: CurveLogs | null;
}

export interface SedPlot3DLog extends SedOutputLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  surfaces: SurfaceLogs | null;
}

export interface SedTaskLog extends StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  algorithm: string;
  simulatorDetails: {[key: string]: any}
}

export interface SedDocumentLog extends StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  tasks: {[taskId: string]: SedTaskLog} | null;
  outputs: {[outputId: string]: SedOutputLog | null} | null;
}

export interface CombineArchiveLog extends StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  sedDocuments: {[sedDocumentId: string]: SedDocumentLog} | null;
}

/* Logs */
export interface SimulationLogs {
  raw: RawSimulationLog;
  structured: CombineArchiveLog | undefined;
}

/* Descriptions of KiSAO terms */
export enum AlgorithmKisaoDescriptionFragmentType {
  text = 'text',
  href = 'href',
}

export interface AlgorithmKisaoDescriptionFragment {
  type: AlgorithmKisaoDescriptionFragmentType;
  value: string;
}
