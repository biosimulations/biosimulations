import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { ValidateSimulationProjectRoutingModule } from './validate-simulation-project-routing.module';
import { ValidateSimulationProjectComponent } from './validate-simulation-project/validate-simulation-project.component';

@NgModule({
  declarations: [ValidateSimulationProjectComponent],
  imports: [
    CommonModule,
    ValidateSimulationProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
})
export class ValidateSimulationProjectModule {}
