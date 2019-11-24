import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Shared/Gaurds/auth.guard';
import { NewSimulationComponent } from './new-simulation/new-simulation.component';
import { SimulateComponent } from './simulate/simulate.component';
import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: BrowseComponent },
  { path: 'new', component: SimulateComponent, canActivate: [AuthGuard] },
  { path: 'new/:id', component: SimulateComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule {}
