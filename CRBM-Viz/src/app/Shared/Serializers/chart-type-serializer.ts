import { ChartType } from '../Models/chart-type';
import { Serializer } from './serializer';

export class ChartTypeSerializer extends Serializer<ChartType> {
  constructor() {
    super();
  }
  fromJson(json: any): ChartType {
    const res = super.fromJson(json);
    const chart = Object.assign(new ChartType(), res);
    return chart;
  }
  toJson(chart: ChartType): any {
    return super.toJson(chart);
  }
}
