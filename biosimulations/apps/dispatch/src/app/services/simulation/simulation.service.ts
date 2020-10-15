import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
import { Injectable } from '@angular/core';
import { Simulation, SimulationStatus } from '../../datamodel';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';
import { ConfigService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private key = 'simulations';
  private simulations: Simulation[] = [];
  private simulationIds: string[] = [];
  private simulationsSubject = new BehaviorSubject<Simulation[]>(
    this.simulations
  );
  public simulations$: Observable<
    Simulation[]
  > = this.simulationsSubject.asObservable();

  private refreshInterval!: any;

  constructor(
    config: ConfigService,
    private storage: Storage,
    private httpClient: HttpClient
  ) {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys) => {
        if (keys.includes(this.key)) {
          this.storage.get(this.key).then((simulations): void => {
            this.simulations = simulations;
            this.simulationIds = simulations.map(
              (simulation: Simulation) => simulation.id
            );
            this.simulationsSubject.next(simulations);
            this.updateSimulations();
            this.refreshInterval = setInterval(
              () => this.updateSimulations(),
              config.appConfig?.simulationStatusRefreshIntervalSec * 1000
            );
          });
        } else {
          const simulations: Simulation[] = [];
          this.simulations = simulations;
          this.simulationIds = [];
          this.simulationsSubject.next(simulations);
          this.refreshInterval = setInterval(
            () => this.updateSimulations(),
            config.appConfig?.simulationStatusRefreshIntervalSec * 1000
          );
        }
      });
    });
  }

  storeSimulation(simulation: Simulation): void {
    if (this.simulationIds.includes(simulation.id)) {
      return;
    }

    this.simulations.push(simulation);
    this.simulationIds.push(simulation.id);
    this.simulationsSubject.next(this.simulations);
    this.storage.set(this.key, this.simulations);
  }

  private updateSimulations(): void {
    // no updates needed if no simulations
    if (this.simulations.length === 0) {
      return;
    }

    // no updates needed if no simulation is queued or running
    let activeSimulation = false;
    for (const simulation of this.simulations) {
      if (
        simulation.status !== SimulationStatus.failed &&
        simulation.status !== SimulationStatus.succeeded
      ) {
        activeSimulation = true;
        break;
      }
    }
    if (!activeSimulation) {
      return;
    }

    // update status
    // TODO: connect with API
    // TODO: only get and update status of
    const endpoint = `${urls.dispatchApi}/jobinfo`;
    const ids = this.simulations
      .filter((simulation: Simulation): boolean => {
        return !(
          simulation.status === SimulationStatus.succeeded ||
          simulation.status === SimulationStatus.failed
        );
      })
      .map((simulation: Simulation): string => {
        return simulation.id;
      })
      .join(',');

    this.httpClient.post(`${endpoint}`, ids.split(',')).subscribe(
      (data: any) => {
        // Reformatting simulations according to Simulation interface
        const simulations: Simulation[] = [];
        for (const sim of data.data) {
          // console.log(sim);
          const dispatchSim: DispatchSimulationModelDB = sim;
          simulations.push({
            name: dispatchSim.nameOfSimulation,
            email: dispatchSim.authorEmail,
            runtime: dispatchSim.duration,
            id: dispatchSim.uuid,
            status: (dispatchSim.currentStatus as unknown) as SimulationStatus,
            submitted: dispatchSim.submittedTime as Date,
            submittedLocally: true,
            updated: dispatchSim.statusModifiedTime as Date,
            resultSize: dispatchSim.resultSize,
            projectSize: dispatchSim.projectSize
          })
        };
        this.setSimulations(simulations, false, true);
      },
      (error: HttpErrorResponse) => {
        if (!environment.production) {
          console.error(
            'Unable to update simulations: ' +
              error.status.toString() +
              ': ' +
              error.message
          );
        }
      }
    );
  }

  setSimulations(
    simulations: Simulation[],
    getStatus = false,
    updateStatus = false
  ): void {
    let newSimulations: Simulation[];
    if (updateStatus) {
      newSimulations = [...this.simulations];

      const simulationIdToIndex: { [id: string]: number } = {};
      newSimulations.forEach(
        (simulation: Simulation, iSimulation: number): void => {
          simulationIdToIndex[simulation.id] = iSimulation;
        }
      );

      simulations.forEach((simulation: Simulation): void => {
        newSimulations.splice(
          simulationIdToIndex[simulation.id],
          1,
          simulation
        );
      });
    } else {
      newSimulations = simulations;
      this.simulationIds = newSimulations.map(
        (simulation: Simulation): string => simulation.id
      );
    }
    this.simulations = newSimulations;
    this.simulationsSubject.next(newSimulations);
    this.storage.set(this.key, newSimulations);

    if (getStatus) {
      this.updateSimulations();
    }
  }

  getSimulations(): Simulation[] {
    return this.simulations;
  }

  getSimulationByUuid(uuid: string): Simulation {
    return this.simulations.filter(element => element.id === uuid)[0] as Simulation;
  }
}
