export interface FileInfo {
  size?: number;
  url: string;
}

export enum OutputFileName {
  OUTPUT_ARCHIVE = 'output.zip',
  LOG = 'log.yml',
  PLOTS = 'plots.zip',
  REPORTS = 'reports.h5',
  RAW_LOG = 'rawLog.txt',
}
