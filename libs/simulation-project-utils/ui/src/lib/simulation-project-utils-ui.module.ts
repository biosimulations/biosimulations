import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { ConvertFileComponent } from './convert-file/convert-file.component';
import { ValidateModelComponent } from './validate-model/validate-model.component';
import { ValidateSimulationComponent } from './validate-simulation/validate-simulation.component';
import { ValidateMetadataComponent } from './validate-metadata/validate-metadata.component';
import { ValidateProjectComponent } from './validate-project/validate-project.component';
import { SuggestSimulatorComponent } from './suggest-simulator/suggest-simulator.component';

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
export class SimulationProjectUtilsUiModule {}
