import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../Shared/Gaurds/auth.guard';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { EditModelsComponent } from './edit-models/edit-models.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: 'new',
    component: EditModelsComponent,
    canActivate: [AuthGuard],
  },
  { path: ':id', component: ViewComponent },
  {
    path: ':id/edit',
    component: EditModelsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
