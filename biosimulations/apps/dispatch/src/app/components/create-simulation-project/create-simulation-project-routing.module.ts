import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSimulationProjectComponent } from './create-simulation-project/create-simulation-project.component';

const routes: Routes = [
  {
    path: '',
    component: CreateSimulationProjectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSimulationProjectRoutingModule {}
