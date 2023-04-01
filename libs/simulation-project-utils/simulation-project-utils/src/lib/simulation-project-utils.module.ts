import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { ConvertFileComponent } from './ui/convert-file/convert-file.component';
import { ValidateModelComponent } from './ui/validate-model/validate-model.component';
import { ValidateSimulationComponent } from './ui/validate-simulation/validate-simulation.component';
import { ValidateMetadataComponent } from './ui/validate-metadata/validate-metadata.component';
import { ValidateProjectComponent } from './ui/validate-project/validate-project.component';
import { SuggestSimulatorComponent } from './ui/suggest-simulator/suggest-simulator.component';

@NgModule({
  declarations: [
    ConvertFileComponent,
    ValidateModelComponent,
    ValidateSimulationComponent,
    ValidateMetadataComponent,
    ValidateProjectComponent,
    SuggestSimulatorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
})
export class SimulationProjectUtilsModule {}
