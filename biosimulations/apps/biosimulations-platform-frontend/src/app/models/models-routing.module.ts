import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelsComponent } from './models.component';
import { BrowseModelsComponent } from './browse-models/browse-models.component';
import { NewModelComponent } from './new-model/new-model.component';
import { ViewModelComponent } from './view-model/view-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';

const routes: Routes = [
  { path: '', component: ModelsComponent },
  {
    path: 'browse',
    component: BrowseModelsComponent,
  },
  {
    path: 'new',
    component: NewModelComponent,
  },
  {
    path: ':id',
    component: ViewModelComponent,
  },
  {
    path: ':id/edit',
    component: EditModelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
