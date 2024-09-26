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
import { VerifyModelComponent } from './ui/verify-model/verify-model.component';
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
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    VerifyModelComponent,
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    PlotlyModule,
  ],
  exports: [ModelChangesComponent],
})
export class SimulationProjectUtilsModule {}
