import { CombineArchiveLog } from '../../../../libs/datamodel/common/src';

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
