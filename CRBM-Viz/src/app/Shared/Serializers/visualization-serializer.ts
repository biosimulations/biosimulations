import { Serializer } from './serializer';
import { Visualization } from '../Models/visualization';

export class VisualizationSerializer extends Serializer<Visualization> {
  constructor() {
    super(Visualization);
  }
  fromJson(json: any): Visualization {
    const visualization = super.fromJson(json);
    return visualization;
  }
  toJson(obj: Visualization): any {
    return super.toJson(obj);
  }
}
