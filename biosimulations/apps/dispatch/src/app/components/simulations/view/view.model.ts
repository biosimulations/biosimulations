import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  AxisType,
  ScatterTraceMode,
} from './visualization/visualization.component';
export interface FormattedSimulation {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  simulatorUrl: string;
  status: SimulationRunStatus;
  statusRunning: boolean;
  statusSucceeded: boolean;
  statusLabel: string;
  submitted: string;
  updated: string;
  runtime: string;
  projectUrl: string;
  projectSize: string;
  resultsUrl: string;
  resultsSize: string;
}

export interface VizApiResponse {
  message: string;
  data: CombineArchive;
}

export interface CombineArchive {
  [id: string]: string[];
}

export interface AxisLabelType {
  label: string;
  type: AxisType;
}

export const AXIS_LABEL_TYPES: AxisLabelType[] = [
  {
    label: 'Linear',
    type: AxisType.linear,
  },
  {
    label: 'Logarithmic',
    type: AxisType.log,
  },
];

export interface ScatterTraceModeLabel {
  label: string;
  mode: ScatterTraceMode;
}

export const SCATTER_TRACE_MODEL_LABELS: ScatterTraceModeLabel[] = [
  {
    label: 'Line',
    mode: ScatterTraceMode.lines,
  },
  {
    label: 'Scatter',
    mode: ScatterTraceMode.markers,
  },
];

export interface Report {
  [id: string]: any[];
}

export interface DataSetIdDisabled {
  id: string;
  disabled: boolean;
}
