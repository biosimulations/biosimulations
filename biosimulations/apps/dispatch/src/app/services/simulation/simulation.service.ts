import { Injectable } from '@angular/core';
import { Simulation, SimulationStatus } from '../../datamodel';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private key = 'simulations';
  private simulations: Simulation[] = [];  
  private simulationIds: string[] = [];
  private simulationsSubject = new BehaviorSubject<Simulation[]>(this.simulations);
  public simulations$: Observable<Simulation[]> = this.simulationsSubject.asObservable();  

  // TODO: connect with application configuration
  static refreshIntervalLength = 5 * 60 * 1000; // 5 minutes
  private refreshInterval!: number;

  constructor(private storage: Storage, private httpClient: HttpClient) {
    this.storage.ready().then(() => {
      this.storage.keys().then((keys) => {
        if (keys.includes(this.key)) {
          this.storage.get(this.key).then((simulations): void => {
            this.simulations = simulations;
            this.simulationIds = simulations.map((simulation: Simulation) => simulation.id);
            this.simulationsSubject.next(simulations);
            this.updateSimulations();
            this.refreshInterval = setInterval(() => this.updateSimulations(), SimulationService.refreshIntervalLength);
          });
        } else {
          const simulations: Simulation[] = [];
          this.simulations = simulations;
          this.simulationIds = [];
          this.simulationsSubject.next(simulations);
          this.refreshInterval = setInterval(() => this.updateSimulations(), SimulationService.refreshIntervalLength);
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

  updateSimulations(): void {
    // no updates needed if no simulations
    if (this.simulations.length === 0) {
      return;
    }

    // no updates needed if no simulation is queued or running
    let activeSimulation = false;
    for (const simulation of this.simulations) {
      if (simulation.status !== SimulationStatus.failed && simulation.status !== SimulationStatus.succeeded) {
        activeSimulation = true;
        break;
      }
    }
    if (!activeSimulation) {
      return;
    }

    // update status
    // TODO: connect with API
    const endpoint = `${urls.dispatchApi}/simulations`;
    const ids = this.simulations.map((simulation: Simulation): string => {return simulation.id;}).join(',');

    this.httpClient
      .get(`${endpoint}?ids=${ids}`)
      .subscribe(
        (data: any) => {
          this.setSimulations(data.data);
        },
        (error: HttpErrorResponse) => {
          if (!environment.production) {
            console.error('Unable to update simulations: ' + error.status.toString() + ': ' + error.message);
          }
        }
      );
  }

  setSimulations(simulations: Simulation[], update = false): void {
    this.simulations = simulations;
    this.simulationIds = simulations.map((simulation: Simulation) => simulation.id);
    this.simulationsSubject.next(simulations);
    this.storage.set(this.key, simulations);

    if (update) {
      this.updateSimulations();
    }
  }

  getSimulations(): Simulation[] {
    return this.simulations;
  }
}
