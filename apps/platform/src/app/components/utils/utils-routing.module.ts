import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import {
  ConvertFileComponent,
  ValidateModelComponent,
  ValidateSimulationComponent,
  ValidateMetadataComponent,
  ValidateProjectComponent,
  SuggestSimulatorComponent,
  CreateProjectComponent,
  // VerifyModelComponent,
} from '@biosimulations/simulation-project-utils';

interface ContextButton {
  route: string[];
  icon: string;
  label: string;
}

const contextButtons: ContextButton[] = [
  {
    route: ['/utils', 'convert-file'],
    icon: 'convert',
    label: 'Convert a file',
  },
  {
    route: ['/utils', 'create-project'],
    icon: 'write',
    label: 'Create a project',
  },
  {
    route: ['/utils', 'validate-model'],
    icon: 'review',
    label: 'Validate a model',
  },
  {
    route: ['/utils', 'validate-simulation'],
    icon: 'review',
    label: 'Validate a simulation',
  },
  {
    route: ['/utils', 'validate-metadata'],
    icon: 'review',
    label: 'Validate metadata',
  },
  {
    route: ['/utils', 'validate-project'],
    icon: 'review',
    label: 'Validate a project',
  },
  {
    route: ['/utils', 'suggest-simulator'],
    icon: 'idea',
    label: 'Suggest a simulator',
  },
  {
    route: ['/utils', 'verify-model'],
    icon: 'idea',
    label: 'Verify model',
  },
];

function generateRoute(path: string, component: any, breadcrumb: string): Route {
  return {
    path: path,
    component: component,
    data: {
      breadcrumb,
      contextButtons,
    },
  };
}

const routes: Routes = [
  generateRoute('convert-file', ConvertFileComponent, 'Convert a file'),
  generateRoute('create-project', CreateProjectComponent, 'Create a simulation project (COMBINE/OMEX archive)'),
  generateRoute('validate-model', ValidateModelComponent, 'Validate a model (e.g., SBML)'),
  generateRoute('validate-simulation', ValidateSimulationComponent, 'Validate a simulation experiment (SED-ML)'),
  generateRoute('validate-metadata', ValidateMetadataComponent, 'Validate metadata (OMEX Metadata)'),
  generateRoute('validate-project', ValidateProjectComponent, 'Validate a simulation project (COMBINE/OMEX archive)'),
  generateRoute('suggest-simulator', SuggestSimulatorComponent, 'Suggest a simulation tool'),
  // generateRoute('verify-model', VerifyModelComponent, 'Verify a model file')
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilsRoutingModule {}
