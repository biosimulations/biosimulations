import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateSimulationProjectComponent } from './validate-simulation-project/validate-simulation-project.component';
import { SuggestSimulatorComponent } from './suggest-simulator/suggest-simulator.component';

const routes: Routes = [
  {
    path: 'validate',
    component: ValidateSimulationProjectComponent,
    data: {
      breadcrumb: 'Validate a simulation project',
      contextButtons: [
        { route: ['/utils', 'suggest-simulator'], icon: 'simulator', label: 'Suggest a simulator' },
      ],
    },
  },
  {
    path: 'suggest-simulator',
    component: SuggestSimulatorComponent,
    data: {
      breadcrumb: 'Suggest a simulator',
      contextButtons: [
        { route: ['/utils', 'validate'], icon: 'bug', label: 'Validate a simulation project' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilsRoutingModule {}
