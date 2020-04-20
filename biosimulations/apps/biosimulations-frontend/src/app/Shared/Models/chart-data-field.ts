import {
  ChartDataFieldShape,
  ChartDataFieldDTO,
  ChartDataFieldType,
} from '@biosimulations/datamodel/core';

export class ChartTypeDataField implements ChartDataFieldDTO {
  name: string;
  shape: ChartDataFieldShape;
  type: ChartDataFieldType;
  constructor(data: ChartDataFieldDTO) {
    Object.assign(this, data);
  }
}
