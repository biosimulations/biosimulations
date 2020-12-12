import { Injectable } from '@angular/core';
import { Simulation } from '../../datamodel';
import { SimulationRunStatus } from '../../datamodel';
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
  private simulationsSubject = new BehaviorSubject<Simulation[]>(this.simulations);
  public simulations$: Observable<
    Simulation[]
  > = this.simulationsSubject.asObservable();
  private storageInitialized = false;
  private simulationsAddedBeforeStorageInitialized: Simulation[] = [];

  private refreshInterval!: any;

  constructor(
    private config: ConfigService,
    private storage: Storage,
    private httpClient: HttpClient
  ) {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys) => {
        if (keys.includes(this.key)) {
          this.storage.get(this.key).then((simulations: Simulation[]): void => {
            this.initSimulations(simulations);
          });
        } else {
          this.initSimulations([]);
        }
      });
    });
  }

  private initSimulations(storedSimulations: Simulation[]): void {
    const simulations = storedSimulations.concat(this.simulationsAddedBeforeStorageInitialized);
    simulations.forEach((simulation: Simulation): void => {
      if (!(simulation.id in this.simulationsMap)) {
        this.simulations.push(simulation);
        this.simulationsMap[simulation.id] = simulation;
      }
    });
    this.simulationsSubject.next(this.simulations);
    this.updateSimulations();
    this.refreshInterval = setInterval(
      () => this.updateSimulations(),
      this.config.appConfig?.simulationStatusRefreshIntervalSec * 1000
    );
    this.storageInitialized = true;
    if (this.simulationsAddedBeforeStorageInitialized.length) {
      this.storage.set(this.key, this.simulations);
    }
  }

  storeSimulation(newSimulation: Simulation, getStatus = false): void {
    this.storeSimulations([newSimulation], getStatus);
  }

  storeSimulations(newSimulations: Simulation[], getStatus = false): void {
    if (this.storageInitialized) {
      newSimulations.forEach((newSimulation: Simulation): void => {
        if (newSimulation.id in this.simulationsMap) {
          Object.assign(this.simulationsMap[newSimulation.id], newSimulation);
        } else {
          this.simulations.push(newSimulation);
          this.simulationsMap[newSimulation.id] = newSimulation;
        }
      });
      this.simulationsSubject.next(this.simulations);
      this.storage.set(this.key, this.simulations);
      if (getStatus) {
        this.updateSimulations();
      }
    } else {
       newSimulations.forEach((newSimulation: Simulation): void => {
        this.simulationsAddedBeforeStorageInitialized.push(newSimulation);
      });
    }
  }

  private updateSimulations(): void {
    // determine ids of simulations whose status needs to be updated
    const simulationIds = this.simulations
      .filter((simulation: Simulation): boolean => {
        return SimulationStatusService.isSimulationStatusRunning(
          simulation.status
        );
      })
      .map((simulation: Simulation): string => {
        return simulation.id;
      });
    
    // stop if no simulations need to be updated
    if (simulationIds.length === 0) {
      return;
    }

    // get status of simulations
    const promises = [];
    for (const simId of simulationIds) {
      const promise = this.httpClient
        .get(`${urls.dispatchApi}run/${simId}`)
        .toPromise();
      promises.push(promise);
    }

    // update status
    Promise.all(promises).then((data: any) => {
      const simulations: Simulation[] = [];
      for (const sim of data) {
        const dispatchSim = sim;
        simulations.push({
          name: dispatchSim.name,
          email: dispatchSim.email,
          runtime: dispatchSim.runtime,
          id: dispatchSim.id,
          status: (dispatchSim.status as unknown) as SimulationRunStatus,
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
      this.storeSimulations(simulations, false);
    });
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
            status: (dispatchSimulation.status as unknown) as SimulationRunStatus,
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
