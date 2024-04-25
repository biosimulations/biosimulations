import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { RunRoutingModule } from './run-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { SimulationProjectUtilsModule } from '@biosimulations/simulation-project-utils';
import { CustomizeSimulationComponent } from './customize-simulation/customize-simulation.component';
import { SimulationRunsUiModule } from '@biosimulations/simulation-runs/ui';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [DispatchComponent, CustomizeSimulationComponent],
  imports: [
    CommonModule,
    RunRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    SimulationProjectUtilsModule,
    SimulationRunsUiModule,
    MatSlideToggleModule,
  ],
})
export class RunModule {}
