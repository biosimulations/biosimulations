import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';
import { SimulateComponent } from './simulate/simulate.component';
import { BrowseComponent } from './browse/browse.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  { path: '', component: BrowseComponent },  
  { path: 'new', component: SimulateComponent },  
  { path: 'status', component: SimulateComponent }, // switch to status component
  { path: ':id', component: DataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulateRoutingModule {}
