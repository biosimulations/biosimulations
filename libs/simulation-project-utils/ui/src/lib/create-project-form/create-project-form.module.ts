import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  UploadModelComponent,
  SimulatorTypeComponent,
  UniformTimeCourseSimulationComponent,
  AlgorithmParametersComponent,
  NamespacesComponent,
  ModelChangesComponent,
  ModelVariablesComponent,
  SimpleAlgorithmParametersComponent,
} from './form-steps';

@NgModule({
  declarations: [
    UploadModelComponent,
    SimulatorTypeComponent,
    UniformTimeCourseSimulationComponent,
    AlgorithmParametersComponent,
    NamespacesComponent,
    ModelChangesComponent,
    ModelVariablesComponent,
    SimpleAlgorithmParametersComponent,
  ],
  exports: [
    UploadModelComponent,
    SimulatorTypeComponent,
    UniformTimeCourseSimulationComponent,
    AlgorithmParametersComponent,
    NamespacesComponent,
    ModelChangesComponent,
    ModelVariablesComponent,
    SimpleAlgorithmParametersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class CreateProjectFormModule {}
