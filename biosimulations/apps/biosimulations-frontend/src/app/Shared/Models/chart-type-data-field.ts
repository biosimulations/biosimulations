import {
  ChartTypeDataFieldShape,
  ChartTypeDataFieldDTO,
  ChartTypeDataFieldType,
} from '@biosimulations/datamodel/core';

export class ChartTypeDataField extends ChartTypeDataFieldDTO {
  name: string;
  shape: ChartTypeDataFieldShape;
  type: ChartTypeDataFieldType;
  constructor(data: ChartTypeDataFieldDTO) {
    super();
    Object.assign(this, data);
  }
}
