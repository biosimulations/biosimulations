/* Raw log */
export type RawSimulationLog = string;

/* Structured log */
export enum StructuredLogLevel {
  None = 0,
  CombineArchive = 1,
  SedDocument = 2,
  SedTaskOutput = 3,
  SedDataSetCurveSurface = 4
}

export enum SimulationStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED'
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
  id: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
}

export interface DataSetLog {
  id: string;
  status: SimulationStatus;
}

export interface CurveLog {
  id: string;
  status: SimulationStatus;
}

export interface SurfaceLog {
  id: string;
  status: SimulationStatus;
}

export interface SedReportLog extends SedOutputLog {
  id: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  dataSets: DataSetLog[] | null;
}

export interface SedPlot2DLog extends SedOutputLog {
  id: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  curves: CurveLog[] | null;
}

export interface SedPlot3DLog extends SedOutputLog {
  id: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  surfaces: SurfaceLog[] | null;
}

export interface SimulatorDetail {
  key: string;
  value: any;
}

export interface SedTaskLog extends StructuredSimulationLog {
  id: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  algorithm: string | null;
  simulatorDetails: SimulatorDetail[] | null;
}

export interface SedDocumentLog extends StructuredSimulationLog {
  location: string;
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  tasks: SedTaskLog[] | null;
  outputs: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null;
}

export interface CombineArchiveLog extends StructuredSimulationLog {
  status: SimulationStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  sedDocuments: SedDocumentLog[] | null;
}

/* Logs */
export interface SimulationLogs {
  raw: RawSimulationLog;
  structured: CombineArchiveLog | undefined;
}

/* Descriptions of KiSAO terms */
export enum AlgorithmKisaoDescriptionFragmentType {
  text = 'text',
  href = 'href'
}

export interface AlgorithmKisaoDescriptionFragment {
  type: AlgorithmKisaoDescriptionFragmentType;
  value: string;
}
