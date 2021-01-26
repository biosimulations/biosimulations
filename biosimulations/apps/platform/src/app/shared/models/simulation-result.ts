import { ModelVariable } from './model-variable';
import { Simulation } from './simulation';
import { TimePoint } from './time-point';

export class SimulationResult {
  simulation?: Simulation;
  variable?: ModelVariable;

  getTimePoints(): TimePoint[] {
    const timePoints: TimePoint[] = [];
    for (let iTime = 0; iTime < 100; iTime++) {
      const timePoint = new TimePoint();
      timePoint.time = iTime;
      timePoint.value =
        Math.cos((iTime / 100) * 4 * Math.PI) + 0.1 * (Math.random() - 0.5);
      timePoints.push(timePoint);
    }
    return timePoints;
  }
}
