import { Serializer } from './serializer';
import { Simulation } from '../Models/simulation';
import { Algorithm } from '../Models/algorithm';
import { AlgorithmParameter } from '../Models/algorithm-parameter';
import { Format } from '../Models/format';
import { Simulator } from '../Models/simulator';

export class SimulationSerializer extends Serializer<Simulation> {
  constructor() {
    super();
  }
  fromJson(json: any): Simulation {
    console.log(json);
    const res = super.fromJson(json);
    let simulation = new Simulation();
    simulation = Object.assign(simulation, res);
    simulation.MODEL = json.model;
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
    return simulation;
  }
  toJson(obj: any): Simulation {
    return super.toJson(obj);
  }
}
