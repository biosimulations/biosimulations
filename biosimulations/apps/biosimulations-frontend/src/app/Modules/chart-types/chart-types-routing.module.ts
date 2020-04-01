import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { AuthGuard } from '../../Shared/Gaurds/auth.guard';
import { ConstructionGuard } from '../../Shared/Gaurds/construction.guard';

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
  { path: ':id', component: ViewComponent },
  {
    path: ':id/edit',
    component: EditComponent,
    canActivate: [AuthGuard, ConstructionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartTypesRoutingModule {}
