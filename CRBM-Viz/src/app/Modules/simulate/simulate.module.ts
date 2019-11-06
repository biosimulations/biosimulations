import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulateRoutingModule } from './simulate-routing.module';
import { SimulateComponent } from './simulate/simulate.component';
import { PastSimulationComponent } from './past-simulation/past-simulation.component';
import { DataComponent } from './data/data.component';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { FileChooserComponent } from './new-simulation/file-chooser/file-chooser.component';
import { SimulationTaskComponent } from './new-simulation/simulation-task/simulation-task.component';

@NgModule({
  declarations: [
    SimulateComponent,
    PastSimulationComponent,
    DataComponent,
    FileChooserComponent,
    SimulationTaskComponent
  ],
  imports: [
    CommonModule,
    SimulateRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
  ],
})
export class SimulateModule {}
