import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';

import { SimulateRoutingModule } from './simulate-routing.module';

import { SimulateComponent } from './simulate/simulate.component';
import { PastSimulationComponent } from './past-simulation/past-simulation.component';
import { MineComponent } from './mine/mine.component';
import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';

@NgModule({
  declarations: [
    SimulateComponent,
    NewSimulationComponent,
    PastSimulationComponent,
    MineComponent,
    BrowseComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    SimulateRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SimulateModule {}
