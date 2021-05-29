import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { CreateSimulationProjectRoutingModule } from './create-simulation-project-routing.module';
import { CreateSimulationProjectComponent } from './create-simulation-project/create-simulation-project.component';

@NgModule({
  declarations: [CreateSimulationProjectComponent],
  imports: [
    CommonModule,
    CreateSimulationProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
})
export class CreateSimulationProjectModule {}
