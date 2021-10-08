import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateModelComponent } from './validate-model/validate-model.component';
import { ValidateSimulationComponent } from './validate-simulation/validate-simulation.component';
import { ValidateMetadataComponent } from './validate-metadata/validate-metadata.component';
import { ValidateProjectComponent } from './validate-project/validate-project.component';
import { SuggestSimulatorComponent } from './suggest-simulator/suggest-simulator.component';
import { ConvertComponent } from './convert/convert.component';

const routes: Routes = [
  {
    path: 'convert',
    component: ConvertComponent,
    data: {
      breadcrumb: 'Convert a file',
      contextButtons: [
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'simulator',
          label: 'Suggest a simulator',
        },
        {
          route: ['/utils', 'validate-model'],
          icon: 'bug',
          label: 'Validate a model',
        },
        {
          route: ['/utils', 'validate-simulation'],
          icon: 'bug',
          label: 'Validate a simulation',
        },
        {
          route: ['/utils', 'validate-metadata'],
          icon: 'bug',
          label: 'Validate metadata',
        },
        {
          route: ['/utils', 'validate-project'],
          icon: 'bug',
          label: 'Validate a project',
        },
      ],
    },
  },
  {
    path: 'validate-model',
    component: ValidateModelComponent,
    data: {
      breadcrumb: 'Validate a model (e.g., SBML)',
      contextButtons: [
        {
          route: ['/utils', 'convert'],
          icon: 'convert',
          label: 'Convert a file',
        },
        {
          route: ['/utils', 'validate-simulation'],
          icon: 'bug',
          label: 'Validate a simulation',
        },
        {
          route: ['/utils', 'validate-metadata'],
          icon: 'bug',
          label: 'Validate metadata',
        },
        {
          route: ['/utils', 'validate-project'],
          icon: 'bug',
          label: 'Validate a project',
        },
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'simulator',
          label: 'Suggest a simulator',
        },
      ],
    },
  },
  {
    path: 'validate-simulation',
    component: ValidateSimulationComponent,
    data: {
      breadcrumb: 'Validate a simulation experiment (SED-ML)',
      contextButtons: [
        {
          route: ['/utils', 'convert'],
          icon: 'convert',
          label: 'Convert a file',
        },
        {
          route: ['/utils', 'validate-model'],
          icon: 'bug',
          label: 'Validate a model',
        },
        {
          route: ['/utils', 'validate-metadata'],
          icon: 'bug',
          label: 'Validate metadata',
        },
        {
          route: ['/utils', 'validate-project'],
          icon: 'bug',
          label: 'Validate a project',
        },
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'simulator',
          label: 'Suggest a simulator',
        },
      ],
    },
  },
  {
    path: 'validate-metadata',
    component: ValidateMetadataComponent,
    data: {
      breadcrumb: 'Validate metadata (OMEX Metadata)',
      contextButtons: [
        {
          route: ['/utils', 'convert'],
          icon: 'convert',
          label: 'Convert a file',
        },
        {
          route: ['/utils', 'validate-model'],
          icon: 'bug',
          label: 'Validate a model',
        },
        {
          route: ['/utils', 'validate-simulation'],
          icon: 'bug',
          label: 'Validate a simulation',
        },
        {
          route: ['/utils', 'validate-project'],
          icon: 'bug',
          label: 'Validate a project',
        },
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'simulator',
          label: 'Suggest a simulator',
        },
      ],
    },
  },
  {
    path: 'validate-project',
    component: ValidateProjectComponent,
    data: {
      breadcrumb: 'Validate a simulation project (COMBINE/OMEX archive)',
      contextButtons: [
        {
          route: ['/utils', 'convert'],
          icon: 'convert',
          label: 'Convert a file',
        },
        {
          route: ['/utils', 'validate-model'],
          icon: 'bug',
          label: 'Validate a model',
        },
        {
          route: ['/utils', 'validate-simulation'],
          icon: 'bug',
          label: 'Validate a simulation',
        },
        {
          route: ['/utils', 'validate-metadata'],
          icon: 'bug',
          label: 'Validate metadata',
        },
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'simulator',
          label: 'Suggest a simulator',
        },
      ],
    },
  },
  {
    path: 'suggest-simulator',
    component: SuggestSimulatorComponent,
    data: {
      breadcrumb: 'Suggest a simulation tool',
      contextButtons: [
        {
          route: ['/utils', 'convert'],
          icon: 'convert',
          label: 'Convert a file',
        },
        {
          route: ['/utils', 'validate-model'],
          icon: 'bug',
          label: 'Validate a model',
        },
        {
          route: ['/utils', 'validate-simulation'],
          icon: 'bug',
          label: 'Validate a simulation',
        },
        {
          route: ['/utils', 'validate-metadata'],
          icon: 'bug',
          label: 'Validate metadata',
        },
        {
          route: ['/utils', 'validate-project'],
          icon: 'bug',
          label: 'Validate a project',
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilsRoutingModule {}
