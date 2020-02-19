import { ChartType } from '../Models/chart-type';
import { Serializer } from './serializer';

export class ChartTypeSerializer extends Serializer<ChartType> {
  constructor() {
    super(ChartType);
  }
  fromJson(json: any): ChartType {
    const chart = super.fromJson(json);
    return chart;
  }
  toJson(chart: ChartType): any {
    return super.toJson(chart);
  }
}
