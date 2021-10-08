import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { UtilsRoutingModule } from './utils-routing.module';
import { ValidateModelComponent } from './validate-model/validate-model.component';
import { ValidateSimulationComponent } from './validate-simulation/validate-simulation.component';
import { ValidateMetadataComponent } from './validate-metadata/validate-metadata.component';
import { ValidateProjectComponent } from './validate-project/validate-project.component';
import { SuggestSimulatorComponent } from './suggest-simulator/suggest-simulator.component';
import { ConvertComponent } from './convert/convert.component';

@NgModule({
  declarations: [
    ValidateModelComponent,
    ValidateSimulationComponent,
    ValidateMetadataComponent,
    ValidateProjectComponent,
    SuggestSimulatorComponent,
    ConvertComponent,
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
