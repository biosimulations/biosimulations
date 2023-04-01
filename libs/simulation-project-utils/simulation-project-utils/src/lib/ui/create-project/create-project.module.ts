import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { FormHostDirective, PagingFormComponent } from './create-project/forms';

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
    FormHostDirective,
    PagingFormComponent,
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
