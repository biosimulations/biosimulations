import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateSimulationProjectComponent } from './validate-simulation-project/validate-simulation-project.component';

const routes: Routes = [
  {
    path: '',
    component: ValidateSimulationProjectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateSimulationProjectRoutingModule {}
