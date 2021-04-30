import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { UtilsRoutingModule } from './utils-routing.module';
import { ValidateSimulationProjectComponent } from './validate-simulation-project/validate-simulation-project.component';
import { SuggestSimulatorComponent } from './suggest-simulator/suggest-simulator.component';

@NgModule({
  declarations: [
    ValidateSimulationProjectComponent,
    SuggestSimulatorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    UtilsRoutingModule,
    
  ],
})
export class UtilsModule {}
