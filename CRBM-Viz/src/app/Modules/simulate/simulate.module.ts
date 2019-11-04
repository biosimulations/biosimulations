import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulateRoutingModule } from './simulate-routing.module';
import { SimulateComponent } from './simulate/simulate.component';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';
import { PastSimulationComponent } from './past-simulation/past-simulation.component';

@NgModule({
  declarations: [
    SimulateComponent,
    NewSimulationComponent,
    PastSimulationComponent,
  ],
  imports: [CommonModule, SimulateRoutingModule],
})
export class SimulateModule {}
