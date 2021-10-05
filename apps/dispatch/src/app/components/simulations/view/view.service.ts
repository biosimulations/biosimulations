import { Injectable } from '@angular/core';
import { urls } from '@biosimulations/config/common';
import { Simulation } from '../../../datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { FormattedSimulation } from './view.model';
import { UtilsService } from '@biosimulations/shared/services';
import { Purpose } from '@biosimulations/datamodel/common';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor() {}

  public formatSimulation(simulation: Simulation): FormattedSimulation {
    simulation = simulation as Simulation;
    const statusRunning = SimulationStatusService.isSimulationStatusRunning(
      simulation.status,
    );
    const statusSucceeded = SimulationStatusService.isSimulationStatusSucceeded(
      simulation.status,
    );
    return {
      id: simulation.id,
      name: simulation.name,
      simulator: simulation.simulator,
      simulatorVersion: simulation.simulatorVersion,
      cpus: simulation.cpus || 1,
      memory: UtilsService.formatDigitalSize((simulation.memory || 8) * 1e9),
      maxTime: UtilsService.formatDuration((simulation.maxTime || 20) * 60),
      envVars: simulation.envVars || [],
      purpose: simulation.purpose || Purpose.other,
      status: simulation.status,
      statusRunning: statusRunning,
      statusSucceeded: statusSucceeded,
      statusLabel: SimulationStatusService.getSimulationStatusMessage(
        simulation.status,
        true,
      ),
      // runtime:
      //   simulation.runtime !== undefined
      //     ? Math.round(simulation.runtime / 1000).toString() + ' s'
      //     : 'N/A',
      submitted: UtilsService.formatTime(new Date(simulation.submitted)),
      updated: UtilsService.formatTime(new Date(simulation.updated)),
      simulatorUrl: `${urls.simulators}/simulators/${simulation.simulator}/${simulation.simulatorVersion}`,
    };
  }
}
