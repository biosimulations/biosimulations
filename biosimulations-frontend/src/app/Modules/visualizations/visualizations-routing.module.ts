import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Shared/Gaurds/auth.guard';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { ConstructionGuard } from 'src/app/Shared/Gaurds/construction.guard';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: 'new',
    component: EditComponent,
    canActivate: [AuthGuard, ConstructionGuard],
  },
  {
    path: 'new/:simulationId',
    component: EditComponent,
    canActivate: [AuthGuard, ConstructionGuard],
  },
  {
    path: ':id',
    component: ViewComponent,
  },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [AuthGuard, ConstructionGuard],
  },
  {
    path: ':id/fork',
    component: EditComponent,
    canActivate: [AuthGuard, ConstructionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizationsRoutingModule {}
