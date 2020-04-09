import { ChartDataFieldShape } from '../enums/chart-type-data-field-shape';
import { ChartDataFieldType } from '../enums/chart-type-data-field-type';
import { DTO } from '@biosimulations/datamodel/utils';

export interface ChartDataFieldCore {
  name?: string;
  shape?: ChartDataFieldShape;
  type?: ChartDataFieldType;
}

export type ChartDataFieldDTO = DTO<ChartDataFieldCore>;
