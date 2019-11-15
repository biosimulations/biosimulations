import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulateRoutingModule } from './simulate-routing.module';
import { SimulateComponent } from './simulate/simulate.component';
import { PastSimulationComponent } from './past-simulation/past-simulation.component';
import { StatusComponent } from './status/status.component';
import { BrowseComponent } from './browse/browse.component';
import { DataComponent } from './data/data.component';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    SimulateComponent,
    NewSimulationComponent,
    PastSimulationComponent,
    StatusComponent,
    BrowseComponent,
    DataComponent,
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
