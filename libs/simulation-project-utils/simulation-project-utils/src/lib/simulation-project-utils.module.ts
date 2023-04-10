import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { ConvertFileComponent } from './ui/convert-file/convert-file.component';
import { ValidateModelComponent } from './ui/validate-model/validate-model.component';
import { ValidateSimulationComponent } from './ui/validate-simulation/validate-simulation.component';
import { ValidateMetadataComponent } from './ui/validate-metadata/validate-metadata.component';
import { ValidateProjectComponent } from './ui/validate-project/validate-project.component';
import { SuggestSimulatorComponent } from './ui/suggest-simulator/suggest-simulator.component';
import { CreateProjectComponent } from './ui/create-project/create-project/create-project.component';
import {
  AlgorithmParametersComponent,
  ModelChangesComponent,
  ModelVariablesComponent,
  NamespacesComponent,
  SimulatorTypeComponent,
  UniformTimeCourseSimulationComponent,
  UploadModelComponent,
} from './ui/create-project/form-steps';
import { FormHostDirective, PagingFormComponent } from './ui/create-project/create-project/forms';

@NgModule({
  declarations: [
    ConvertFileComponent,
    ValidateModelComponent,
    ValidateSimulationComponent,
    ValidateMetadataComponent,
    ValidateProjectComponent,
    SuggestSimulatorComponent,
    CreateProjectComponent,
    UploadModelComponent,
    SimulatorTypeComponent,
    UniformTimeCourseSimulationComponent,
    AlgorithmParametersComponent,
    NamespacesComponent,
    ModelChangesComponent,
    ModelVariablesComponent,
    FormHostDirective,
    PagingFormComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedUiModule, BiosimulationsIconsModule],
})
export class SimulationProjectUtilsModule {}
