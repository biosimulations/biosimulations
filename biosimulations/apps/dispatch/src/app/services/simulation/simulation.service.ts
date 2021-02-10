import { Injectable } from '@angular/core';
import { Simulation } from '../../datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationStatusService } from './simulation-status.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of, combineLatest } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@biosimulations/shared/services';
import { map } from 'rxjs/internal/operators/map';
import { concatAll, debounceTime } from 'rxjs/operators';
import { SimulationRun } from '@biosimulations/dispatch/api-models';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private key = 'simulations';
  private simulations: Simulation[] = [];
  //Bilal
  private simulationsMap$: { [key: string]: BehaviorSubject<Simulation> } = {};

  private simulationsMap: { [key: string]: Simulation } = {};
  private simulationsSubject = new BehaviorSubject<Simulation[]>(
    this.simulations,
  );
  public simulations$: Observable<
    Simulation[]
  > = this.simulationsSubject.asObservable();
  private storageInitialized = false;
  private simulationsAddedBeforeStorageInitialized: Simulation[] = [];

  private refreshInterval!: any;

  constructor(
    private config: ConfigService,
    private storage: Storage,
    private httpClient: HttpClient,
  ) {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys: string[]): void => {
        if (keys.includes(this.key)) {
          this.storage.get(this.key).then((simulations: Simulation[]): void => {
            // type case dates to `Date` -- necessary for WebSQL which converts dates to strings
            simulations.forEach((simulation: Simulation): void => {
              if (typeof simulation.submitted === 'string') {
                simulation.submitted = new Date(simulation.submitted);
              }
              if (typeof simulation.updated === 'string') {
                simulation.updated = new Date(simulation.updated);
              }
            });

            this.initSimulations(simulations);
          });
        } else {
          this.initSimulations([]);
        }
      });
    });
  }

  private initSimulations(storedSimulations: Simulation[]): void {
    const simulations = storedSimulations.concat(
      this.simulationsAddedBeforeStorageInitialized,
    );
    simulations.forEach((simulation: Simulation): void => {
      //this.getSimulation(simulation.id);
      if (!(simulation.id in this.simulationsMap)) {
        this.simulations.push(simulation);
        this.simulationsMap[simulation.id] = simulation;
      }
    });

    this.simulationsSubject.next(this.simulations);
    this.updateSimulations();
    this.refreshInterval = setInterval(
      () => this.updateSimulations(),
      this.config.appConfig?.simulationStatusRefreshIntervalSec * 1000,
    );
    this.storageInitialized = true;
    if (this.simulationsAddedBeforeStorageInitialized.length) {
      this.storage.set(this.key, this.simulations);
    }
  }

  storeNewLocalSimulation(simulation: Simulation): void {
    this.storeSimulations([simulation]);
  }

  storeExistingExternalSimulations(simulations: Simulation[]): void {
    simulations.forEach((simulation: any) => {
      simulation.submittedLocally = false;
    });
    this.updateSimulations(simulations);
  }

  private storeSimulations(newSimulations: Simulation[]): void {
    if (this.storageInitialized) {
      newSimulations.forEach((newSimulation: Simulation): void => {
        if (newSimulation.id in this.simulationsMap) {
          const submittedLocally = this.simulationsMap[newSimulation.id]
            .submittedLocally;
          Object.assign(this.simulationsMap[newSimulation.id], newSimulation);
          this.simulationsMap[
            newSimulation.id
          ].submittedLocally = submittedLocally;
        } else {
          this.simulations.push(newSimulation);
          this.simulationsMap[newSimulation.id] = newSimulation;
        }
      });
      this.simulationsSubject.next(this.simulations);
      this.storage.set(this.key, this.simulations);
    } else {
      newSimulations.forEach((newSimulation: Simulation): void => {
        this.simulationsAddedBeforeStorageInitialized.push(newSimulation);
      });
    }
  }

  private updateSimulations(newSimulations: Simulation[] = []): void {
    // determine ids of simulations whose status needs to be updated
    const simulationIds = Array.from(
      new Set(
        this.simulations
          .filter((simulation: Simulation): boolean => {
            return (
              SimulationStatusService.isSimulationStatusRunning(
                simulation.status,
              ) ||
              (simulation.status === SimulationRunStatus.SUCCEEDED &&
                simulation.resultsSize === undefined)
            );
          })
          .map((simulation: Simulation): string => {
            return simulation.id;
          })
          .concat(
            newSimulations.map((simulation: Simulation): string => {
              return simulation.id;
            }),
          ),
      ),
    );

    // stop if no simulations need to be updated
    if (simulationIds.length === 0) {
      return;
    }

    // @author Bilal below
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
          submittedLocally:
            this.simulationsMap?.[dispatchSim.id]?.submittedLocally || false,
          simulator: dispatchSim.simulator,
          simulatorVersion: dispatchSim.simulatorVersion,
          updated: new Date(dispatchSim.updated),
          resultsSize: dispatchSim.resultsSize,
          projectSize: dispatchSim.projectSize,
        });
      }
      this.storeSimulations(simulations);
    });
  }

  removeSimulation(id: string): void {
    const simulation: Simulation = this.simulationsMap[id];
    const iSimulation = this.simulations.indexOf(simulation);
    this.simulations.splice(iSimulation, 1);
    delete this.simulationsMap[id];
    this.storeSimulations([]);
  }

  getSimulations(): Simulation[] {
    return this.simulations;
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   */
  private getSimulationHttp(uuid: string): Observable<Simulation> {
    return this.httpClient
      .get<SimulationRun>(`${urls.dispatchApi}run/${uuid}`)
      .pipe(
        map((data: SimulationRun) => {
          const dispatchSimulation = data;
          const simulation: Simulation = {
            name: dispatchSimulation.name,
            email: dispatchSimulation.email || undefined,
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

          return simulation;
        }),
      );
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * Contains the logic for the polling update.
   * Pull the simulator from cache, but add a debounce. Then, following subscription then must wait some numer of seconds before firing.
   * If the cached suimulation is still running, call the http service to get the latest simulation. Then, save it to the cache
   * Since this is happening inside a subscription of the simulator from cache, saving it triggers the subscription again.
   * This will repeat until the simulator is no longer in a running state, and therefore wont be saved to the cache, and wont cause a repeat
   * When saving it to the cache also save to local storage
   */
  private updateSimulation(uuid: string): void {
    const current = this.getSimulationFromCache(uuid).pipe(
      debounceTime(
        this.config.appConfig.simulationStatusRefreshIntervalSec * 1000,
      ),
    );
    current.subscribe((currentSim) => {
      if (
        SimulationStatusService.isSimulationStatusRunning(currentSim.status)
      ) {
        this.getSimulationHttp(uuid).subscribe((newSim) => {
          this.storeSimulations([newSim]);
          this.cacheSimulation(newSim);
        });
      }
    });
  }
  private cacheSimulation(newSim: Simulation): void {
    this.simulationsMap$[newSim.id].next(newSim);
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * Just a simple wrapper to hide the private behaviorsubjects
   */
  private getSimulationFromCache(uuid: string): Observable<Simulation> {
    return this.simulationsMap$[uuid].asObservable();
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * If we have the simulations in cache(a map of behavior subjects), return it, and trigger an update
   * If not, then get it via http, store it to cache, trigger an update (to start polling), and return the simulator from cache
   * In both cases we want to return from cache. This is because the cache contains behavior subjects already configured to poll the api
   * The recieving method can simply pipe or subscribe to have the latest data
   */
  getSimulation(uuid: string): Observable<Simulation> {
    if (uuid in this.simulationsMap$) {
      this.updateSimulation(uuid);
      return this.getSimulationFromCache(uuid);
    } else {
      const sim = this.getSimulationHttp(uuid).pipe(
        map((value: Simulation) => {
          const simSubject = new BehaviorSubject<Simulation>(value);
          this.simulationsMap$[uuid] = simSubject;
          this.updateSimulation(uuid);
          return this.getSimulationFromCache(uuid);
        }),
        concatAll(),
      );

      return sim;
    }
  }
}
