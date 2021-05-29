import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelsComponent } from './models.component';
import { BrowseModelsComponent } from './browse-models/browse-models.component';
import { NewModelComponent } from './new-model/new-model.component';
import { ViewModelComponent } from './view-model/view-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';

const routes: Routes = [
  {
    path: '',
    component: ModelsComponent,
    data: {
      breadcrumb: 'Overview',
    },
  },
  {
    path: 'browse',
    component: BrowseModelsComponent,
    data: {
      breadcrumb: 'Browse',
    },
  },
  {
    path: 'new',
    component: NewModelComponent,
    data: {
      breadcrumb: 'New',
    },
  },
  {
    path: ':id',
    data: {
      breadcrumb: 'Model',
    },
    children: [
      {
        path: '',
        component: ViewModelComponent,
        data: {},
      },
      {
        path: 'edit',
        component: EditModelComponent,
        data: {
          breadcrumb: 'Edit',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
