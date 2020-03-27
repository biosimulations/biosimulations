import { ChartTypeDataFieldShape } from '../enums/chart-type-data-field-shape';
import { ChartTypeDataFieldType } from '../enums/chart-type-data-field-type';

export class ChartTypeDataFieldDTO {
  name?: string;
  shape?: ChartTypeDataFieldShape;
  type?: ChartTypeDataFieldType;
}
