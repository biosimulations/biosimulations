import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { RunRoutingModule } from './run-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { SimulationProjectUtilsModule } from '@biosimulations/simulation-project-utils';

@NgModule({
  declarations: [DispatchComponent],
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
  ],
})
export class RunModule {}
