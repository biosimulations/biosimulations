import { ChartTypeDataFieldShape } from '../enums/chart-type-data-field-shape';
import { ChartTypeDataFieldType } from '../enums/chart-type-data-field-type';

export class ChartTypeDataFieldDTO {
  constructor(
    public name = null,
    public shape: ChartTypeDataFieldShape = null,
    public type: ChartTypeDataFieldType = null,
  ) {}
}
