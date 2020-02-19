import { Serializer } from './serializer';
import { Simulation } from '../Models/simulation';
import { Algorithm } from '../Models/algorithm';
import { AlgorithmParameter } from '../Models/algorithm-parameter';
import { Format } from '../Models/format';
import { Simulator } from '../Models/simulator';
import { ParameterChange } from '../Models/parameter-change';
import { ModelParameter } from '../Models/model-parameter';
import { ModelSerializer } from './model-serializer';

export class SimulationSerializer extends Serializer<Simulation> {
  modelSerializer: ModelSerializer;
  constructor() {
    super(Simulation);
    this.modelSerializer = new ModelSerializer();
  }
  fromJson(json: any): Simulation {
    const simulation = super.fromJson(json);
    simulation.MODEL = json.model;
    // Model if embedded
    if (typeof json.model === 'string') {
      simulation.MODEL = json.model;
    } else if (typeof json.model === 'object' && json.model !== null) {
      simulation.model = this.modelSerializer.fromJson(json.model);
      simulation.MODEL = simulation.model.id;
    }
    simulation.algorithm = new Algorithm(
      json.algorithm.id,
      json.algorithm.name,
      [new AlgorithmParameter()]
    );
    simulation.format = new Format(
      json.simulatorFormat.name,
      json.simulatorFormat.version,
      json.simulatorFormat.number,
      json.simulatorFormat.url
    );
    simulation.simulator = new Simulator(
      json.simulator.name,
      json.simulator.version,
      json.simulator.dockerHubImageId
    );
    const paramChanges = json.modelParameterChanges;
    if (paramChanges) {
      paramChanges.forEach(change => {
        const parameter = change.parameter;
        const param = new ModelParameter(
          parameter.id,
          parameter.name,
          parameter.value,
          parameter.units
        );
        const paramChange = new ParameterChange(param, change.value);
        simulation.modelParameterChanges.push(paramChange);
      });
    }
    return simulation;
  }

  toJson(obj: any): any {
    return super.toJson(obj);
  }
}
