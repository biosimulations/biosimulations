import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Shared/Gaurds/auth.guard';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: BrowseComponent },
  { path: 'new', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'new/:modelId', component: EditComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ViewComponent },
  { path: ':id/edit', component: EditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule {}
