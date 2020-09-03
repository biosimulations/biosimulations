import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseSimulatorsComponent } from './browse-simulators/browse-simulators.component';
import { ViewSimulatorComponent } from './view-simulator/view-simulator.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseSimulatorsComponent,
  },
  {
    path: ':id',
    component: ViewSimulatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulatorsRoutingModule { }
