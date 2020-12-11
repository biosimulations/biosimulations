import { Injectable } from '@angular/core';
import { Simulation, SimulationStatus } from '../../datamodel';
import { SimulationStatusService } from './simulation-status.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';
import { ConfigService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private key = 'simulations';
  private simulations: Simulation[] = [];
  private simulationsMap: { [key: string]: Simulation } = {};
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
            this.simulationsMap = {};
            this.simulations.forEach((simulation: Simulation): void => {
              this.simulationsMap[simulation.id] = simulation;
            });
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
          this.simulationsMap = {};
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
    this.simulations.push(simulation);
    this.simulationsMap[simulation.id] = simulation;
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
        SimulationStatusService.isSimulationStatusRunning(simulation.status)
      ) {
        activeSimulation = true;
        break;
      }
    }
    if (!activeSimulation) {
      return;
    }

    // update status of simulations that haven't completed
    const simulationIds = this.simulations
      .filter((simulation: Simulation): boolean => {
        return SimulationStatusService.isSimulationStatusRunning(
          simulation.status
        );
      })
      .map((simulation: Simulation): string => {
        return simulation.id;
      });

    const promises = [];
    for (const simId of simulationIds) {
      const promise = this.httpClient
        .get(`${urls.dispatchApi}run/${simId}`)
        .toPromise();
      promises.push(promise);
    }

    Promise.all(promises).then((data: any) => {
      const simulations: Simulation[] = [];
      for (const sim of data) {
        const dispatchSim = sim;
        simulations.push({
          name: dispatchSim.name,
          email: dispatchSim.email,
          runtime: dispatchSim.runtime,
          id: dispatchSim.id,
          status: (dispatchSim.status as unknown) as SimulationStatus,
          submitted: new Date(dispatchSim.submitted),
          submittedLocally: this.simulationsMap[dispatchSim.id]
            .submittedLocally,
          simulator: dispatchSim.simulator,
          simulatorVersion: dispatchSim.simulatorVersion,
          updated: new Date(dispatchSim.updated),
          resultsSize: dispatchSim.resultsSize,
          projectSize: dispatchSim.projectSize,
        });
      }
      this.setSimulations(simulations, false);
    });
  }

  setSimulations(setSimulations: Simulation[], getStatus = false): void {
    const newSimulations: Simulation[] = [...this.simulations];

    const newSimulationIdToIndex: { [id: string]: number } = {};
    newSimulations.forEach(
      (newSimulation: Simulation, iSimulation: number): void => {
        newSimulationIdToIndex[newSimulation.id] = iSimulation;
      }
    );

    setSimulations.forEach((setSimulation: Simulation): void => {
      if (setSimulation.id in this.simulationsMap) {
        newSimulations.splice(
          newSimulationIdToIndex[setSimulation.id],
          1,
          setSimulation
        );
      } else {
        newSimulations.push(setSimulation);
      }
      this.simulationsMap[setSimulation.id] = setSimulation;
    });

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

  getSimulationByUuid(uuid: string): Observable<Simulation> {
    if (uuid in this.simulationsMap) {
      return of(this.simulationsMap[uuid]);
    } else {
      const simulationSubject = new Subject<Simulation>();
      this.httpClient
        .get(`${urls.dispatchApi}run/${uuid}`)
        .subscribe((data: any) => {
          const dispatchSimulation = data;
          const simulation: Simulation = {
            name: dispatchSimulation.name,
            email: dispatchSimulation.email,
            runtime: dispatchSimulation.runtime,
            id: dispatchSimulation.id,
            status: (dispatchSimulation.status as unknown) as SimulationStatus,
            submitted: new Date(dispatchSimulation.submitted),
            submittedLocally: false,
            simulator: dispatchSimulation.simulator,
            simulatorVersion: dispatchSimulation.simulatorVersion,
            updated: new Date(dispatchSimulation.updated),
            resultsSize: dispatchSimulation.resultsSize,
            projectSize: dispatchSimulation.projectSize,
          };
          simulationSubject.next(simulation);
          this.storeSimulation(simulation);
        });
      return simulationSubject.asObservable();
    }
  }
}
