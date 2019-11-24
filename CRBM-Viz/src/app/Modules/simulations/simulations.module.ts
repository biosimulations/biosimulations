import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';

import { SimulationsRoutingModule } from './simulations-routing.module';

import { SimulateComponent } from './simulate/simulate.component';
import { PastSimulationComponent } from './past-simulation/past-simulation.component';
import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';

@NgModule({
  declarations: [
    SimulateComponent,
    NewSimulationComponent,
    PastSimulationComponent,
    BrowseComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    SimulationsRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SimulationsModule {}
