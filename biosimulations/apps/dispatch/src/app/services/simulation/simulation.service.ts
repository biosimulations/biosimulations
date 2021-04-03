import { Injectable } from '@angular/core';
import { Simulation } from '../../datamodel';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationStatusService } from './simulation-status.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@biosimulations/shared/services';
import { concatAll, debounceTime, shareReplay, map } from 'rxjs/operators';
import { SimulationRun } from '@biosimulations/dispatch/api-models';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private key = 'simulations';
  private simulations: Simulation[] = [];

  // Memory/HTTP cache
  private simulationsMap$: { [key: string]: BehaviorSubject<Simulation> } = {};
  private simulationsMapSubject = new BehaviorSubject(this.simulationsMap$);
  private simulationsArrSubject = new BehaviorSubject<Simulation[]>([]);
  // Local Storage Map
  private simulationsMap: { [key: string]: Simulation } = {};
  private simulationsSubject = new BehaviorSubject<Simulation[]>(
    this.simulations,
  );
  public simulations$: Observable<
    Simulation[]
  > = this.simulationsSubject.asObservable();
  private storageInitialized = false;
  private simulationsAddedBeforeStorageInitialized: Simulation[] = [];

  public constructor(
    private config: ConfigService,
    private storage: Storage,
    private httpClient: HttpClient,
  ) {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys: string[]): void => {
        if (keys.includes(this.key)) {
          this.storage.get(this.key).then((simulations: Simulation[]): void => {
            // type case dates to `Date` -- necessary for WebSQL which converts dates to strings
            simulations = this.parseDates(simulations);

            this.initSimulations(simulations);
          });
        } else {
          this.initSimulations([]);
        }
      });
    });
    this.createSimulationsArray();
  }

  private parseDates(simulations: Simulation[]) {
    simulations.forEach((simulation: Simulation): void => {
      if (typeof simulation.submitted === 'string') {
        simulation.submitted = new Date(simulation.submitted);
      }
      if (typeof simulation.updated === 'string') {
        simulation.updated = new Date(simulation.updated);
      }
    });
    return simulations;
  }
  /**
   * Subscribes to the map of the simulators creates and observable list of simulators. This simplifies returning the simulators.
   * @see getSimulations
   */
  private createSimulationsArray() {
    this.simulationsMapSubject
      .pipe(shareReplay(1))
      .subscribe((simulationMap) => {
        if (Object.values(simulationMap).length) {
          combineLatest(
            Object.values(simulationMap).map((sims) => sims.asObservable()),
          ).subscribe((arr) => {
            this.simulationsArrSubject.next(arr);
          });
        } else {
          this.simulationsArrSubject.next([]);
        }
      });
  }
  private initSimulations(storedSimulations: Simulation[]): void {
    const simulations = storedSimulations.concat(
      this.simulationsAddedBeforeStorageInitialized,
    );
    simulations.forEach((simulation: Simulation): void => {
      // Save to local storage map
      if (!(simulation.id in this.simulationsMap)) {
        this.simulations.push(simulation);
        this.simulationsMap[simulation.id] = simulation;
      }
      this.simulationsSubject.next(this.simulations);

      // save to http map
      if (this.simulationsMap$[simulation.id]) {
        this.cacheSimulation(simulation);
      } else {
        this.simulationsMap$[simulation.id] = new BehaviorSubject(simulation);
      }
      this.simulationsMapSubject.next(this.simulationsMap$);
    });

    this.updateSimulations();

    this.storageInitialized = true;
    if (this.simulationsAddedBeforeStorageInitialized.length) {
      this.storage.set(this.key, this.simulations);
    }
  }

  public storeNewLocalSimulation(simulation: Simulation): void {
    this.storeSimulations([simulation]);
    this.addSimulation(simulation);
  }

  public storeExistingExternalSimulations(simulations: Simulation[]): void {
    simulations = this.parseDates(simulations);
    simulations.forEach((simulation) => {
      simulation.submittedLocally = false;
      this.addSimulation(simulation);
      this.storeSimulations([simulation]);
    });
    this.storeSimulations(simulations);
  }

  /**
   * @Author Jonathan
   * @param newSimulations An array of Simulations
   *
   * Store to LOCAL storage
   */
  private storeSimulations(newSimulations: Simulation[]): void {
    if (this.storageInitialized) {
      newSimulations.forEach((newSimulation: Simulation): void => {
        if (newSimulation.id in this.simulationsMap) {
          const submittedLocally = this.simulationsMap[newSimulation.id]
            ?.submittedLocally;
          Object.assign(this.simulationsMap[newSimulation.id], newSimulation);
          this.simulationsMap[newSimulation.id].submittedLocally =
            submittedLocally || false;
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
    for (const sim of newSimulations) {
      this.updateSimulation(sim.id);
    }
    for (const sim of this.simulations) {
      this.updateSimulation(sim.id);
    }
  }

  /**
   * Delete a simulation
   */
  public removeSimulation(id: string): void {
    const simulation: Simulation = this.simulationsMap[id];
    const iSimulation = this.simulations.indexOf(simulation);
    this.simulations.splice(iSimulation, 1);
    delete this.simulationsMap[id];
    delete this.simulationsMap$[id];
    this.simulationsMapSubject.next(this.simulationsMap$);

    this.storeSimulations([]);
  }

  /**
   * Delete all simulations
   */
  public removeSimulations(): void {
    while (this.simulations.length) {
      const simulation: Simulation = this.simulations.pop() as Simulation;
      delete this.simulationsMap[simulation.id];
      delete this.simulationsMap$[simulation.id];
    }
    this.simulationsMapSubject.next(this.simulationsMap$);
    this.storeSimulations([]);
  }

  public getSimulations(): Observable<Simulation[]> {
    return this.simulationsArrSubject.asObservable().pipe(shareReplay(1));
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   */
  private getSimulationHttp(uuid: string): Observable<Simulation> {
    return this.httpClient.get<SimulationRun>(`${urls.dispatchApi}run/${uuid}`)
      .pipe(
        map((dispatchSimulation: SimulationRun) => {
          const simulation: Simulation = {
            name: dispatchSimulation.name,
            email: dispatchSimulation.email || undefined,
            id: dispatchSimulation.id,
            runtime: dispatchSimulation?.runtime || undefined,
            status: (dispatchSimulation.status as unknown) as SimulationRunStatus,
            submitted: new Date(dispatchSimulation.submitted),
            submittedLocally: false,
            simulator: dispatchSimulation.simulator,
            simulatorVersion: dispatchSimulation.simulatorVersion,
            cpus: dispatchSimulation.cpus,
            memory: dispatchSimulation.memory,
            maxTime: dispatchSimulation.maxTime,
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
          newSim.submittedLocally =
            currentSim.submittedLocally || newSim.submittedLocally;
          this.storeSimulations([newSim]);
          this.cacheSimulation(newSim);
        });
      }
    });
  }
  private cacheSimulation(newSim: Simulation): void {
    if (this.simulationsMap$[newSim.id]) {
      this.simulationsMap$[newSim.id].next(newSim);
      this.simulationsMapSubject.next(this.simulationsMap$);
    }
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * Just a simple wrapper to hide the private behaviorsubjects
   */
  private getSimulationFromCache(uuid: string): Observable<Simulation> {
    return this.simulationsMap$[uuid].asObservable().pipe(shareReplay(1));
  }

  /**
   * Add a simulation to the http cache
   * @param simulation
   */
  public addSimulation(simulation: Simulation): boolean {
    if (!(simulation.id in this.simulationsMap$)) {
      const simSubject = new BehaviorSubject(simulation);
      this.simulationsMap$[simulation.id] = simSubject;
      this.simulationsMapSubject.next(this.simulationsMap$);
      this.updateSimulation(simulation.id);
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Bilal
   * @param uuid The id of the simulation
   * If we have the simulations in cache(a map of behavior subjects), return it, and trigger an update
   * If not, then get it via http, store it to cache, trigger an update (to start polling), and return the simulator from cache
   * In both cases we want to return from cache. This is because the cache contains behavior subjects already configured to poll the api
   * The recieving method can simply pipe or subscribe to have the latest data
   */
  public getSimulation(uuid: string): Observable<Simulation> {
    if (uuid in this.simulationsMap$) {
      return this.getSimulationFromCache(uuid);
    } else {
      const sim = this.getSimulationHttp(uuid).pipe(
        map((value: Simulation) => {
          // LOCAL Storage
          this.storeSimulations([value]);
          this.addSimulation(value);

          return this.getSimulationFromCache(uuid);
        }),
        concatAll(),
        shareReplay(1),
      );

      return sim;
    }
  }
}
