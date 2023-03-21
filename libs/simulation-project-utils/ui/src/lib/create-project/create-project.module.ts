import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { CreateProjectRoutingModule } from './create-project-routing.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import {
  UploadModelComponent,
  SimulatorTypeComponent,
  UniformTimeCourseSimulationComponent,
  AlgorithmParametersComponent,
  NamespacesComponent,
  ModelChangesComponent,
  ModelVariablesComponent,
} from './form-steps';

@NgModule({
  declarations: [
    CreateProjectComponent,
    UploadModelComponent,
    SimulatorTypeComponent,
    UniformTimeCourseSimulationComponent,
    AlgorithmParametersComponent,
    AlgorithmParametersComponent,
    NamespacesComponent,
    ModelChangesComponent,
    ModelVariablesComponent,
  ],
  imports: [
    CommonModule,
    CreateProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
})
export class CreateProjectModule {}
