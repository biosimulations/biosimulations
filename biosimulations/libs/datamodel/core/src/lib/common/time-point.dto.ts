import { DTO } from '@biosimulations/datamodel/utils';

export interface TimePointCore {
  time: number;
  value: number;
}

export type TimePointDTO = DTO<TimePointCore>;
