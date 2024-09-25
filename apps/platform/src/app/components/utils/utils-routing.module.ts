import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ConvertFileComponent,
  ValidateModelComponent,
  ValidateSimulationComponent,
  ValidateMetadataComponent,
  ValidateProjectComponent,
  SuggestSimulatorComponent,
  CreateProjectComponent,
  VerifyModelComponent,
} from '@biosimulations/simulation-project-utils';

const routes: Routes = [
  {
    path: 'verify-model',
    component: VerifyModelComponent,
    data: {
      breadcrumb: 'Verify a model file',
      contextButtons: [
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
      ],
    },
  },
  {
    path: 'convert-file',
    component: ConvertFileComponent,
    data: {
      breadcrumb: 'Convert a file',
      contextButtons: [
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
      ],
    },
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
    data: {
      breadcrumb: 'Create a simulation project (COMBINE/OMEX archive)',
      contextButtons: [
        {
          route: ['/utils', 'convert-file'],
          icon: 'convert',
          label: 'Convert a file',
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
      ],
    },
    pathMatch: 'full',
  },
  {
    path: 'validate-model',
    component: ValidateModelComponent,
    data: {
      breadcrumb: 'Validate a model (e.g., SBML)',
      contextButtons: [
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
          route: ['/utils', 'validate-project'],
          icon: 'review',
          label: 'Validate a project',
        },
        {
          route: ['/utils', 'suggest-simulator'],
          icon: 'idea',
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
          route: ['/utils', 'suggest-simulator'],
          icon: 'idea',
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
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilsRoutingModule {}
