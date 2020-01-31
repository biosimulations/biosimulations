import { Serializer } from './serializer';
import { Visualization } from '../Models/visualization';

export class VisualizationSerializer extends Serializer<Visualization> {
  constructor() {
    super();
  }
  fromJson(json: any): Visualization {
    const res = super.fromJson(json);
    const visualization = Object.assign(new Visualization(), res);
    return visualization;
  }
  toJson(obj: Visualization): any {
    return super.toJson(obj);
  }
}
