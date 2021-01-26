import { Injectable } from '@angular/core';
import { urls } from '@biosimulations/config/common';
import { Simulation } from '../../../datamodel';
import { SimulationStatusService } from '../../../services/simulation/simulation-status.service';
import { FormattedSimulation } from './view.model';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor() {}

  public formatSimulation(simulation: Simulation): FormattedSimulation {
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
      status: simulation.status,
      statusRunning: statusRunning,
      statusSucceeded: statusSucceeded,
      statusLabel: SimulationStatusService.getSimulationStatusMessage(
        simulation.status,
        true,
      ),
      runtime:
        simulation.runtime !== undefined
          ? Math.round(simulation.runtime / 1000).toString() + ' s'
          : 'N/A',
      submitted: new Date(simulation.submitted).toLocaleString(),
      updated: new Date(simulation.updated).toLocaleString(),
      projectSize:
        simulation.projectSize !== undefined
          ? (simulation.projectSize / 1024).toFixed(2) + ' KB'
          : '',
      resultsSize:
        simulation.resultsSize !== undefined
          ? (simulation.resultsSize / 1024).toFixed(2) + ' KB'
          : 'N/A',
      projectUrl: `${urls.dispatchApi}run/${simulation.id}/download`,
      simulatorUrl: `${urls.simulators}/simulators/${simulation.simulator}/${simulation.simulatorVersion}`,
      resultsUrl: `${urls.dispatchApi}download/result/${simulation.id}`,
    };
  }
}
