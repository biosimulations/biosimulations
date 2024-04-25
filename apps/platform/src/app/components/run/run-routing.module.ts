import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DispatchComponent } from './dispatch/dispatch.component';
import { CustomizeSimulationComponent } from './customize-simulation/customize-simulation.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchComponent,
  },
  {
    path: 'customize',
    component: CustomizeSimulationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RunRoutingModule {}
