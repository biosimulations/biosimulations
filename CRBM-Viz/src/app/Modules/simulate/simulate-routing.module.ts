import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';
import { SimulateComponent } from './simulate/simulate.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  { path: '', component: SimulateComponent },
  { path: 'browse', component: SimulateComponent },
  { path: 'data', component: DataComponent },
  { path: 'data/:id', component: DataComponent },
  { path: 'new', component: DataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulateRoutingModule {}
