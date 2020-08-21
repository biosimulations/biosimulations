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
      contextButtons: [
        {route: ['/models', 'browse'], icon: 'browse', label: 'Browse'},
        {route: ['/models', 'submit'], icon: 'new', label: 'Submit'},
      ]
    }
  },
  {
    path: 'browse',
    component: BrowseModelsComponent,
    data: {
      breadcrumb: 'Browse',
      contextButtons: [
        {route: ['/models', 'submit'], icon: 'new', label: 'Submit'},
      ]
    }
  },
  {
    path: 'submit',
    component: NewModelComponent,
    data: {
      breadcrumb: 'submit',
      contextButtons: [
        {route: ['/models', 'browse'], icon: 'browse', label: 'Browse'},
      ]
    }
  },
  {
    path: ':id',
    data: {
      breadcrumb: 'Model'
    },
    children: [
      {
        path: '',
        component: ViewModelComponent,
        data: {
          contextButtons: [
            {route: ['/models', 'browse'], icon: 'browse', label: 'Browse'},
            {route: ['/models', ':id', 'edit'], icon: 'author', label: 'Edit'},
            {route: ['/models', 'submit'], icon: 'new', label: 'Submit'},
          ]
        }
      },
      {
        path: 'edit',
        component: EditModelComponent,
        data: {
          breadcrumb: 'Edit',
          contextButtons: [
            {route: ['/models', 'browse'], icon: 'browse', label: 'Browse'},
            {route: ['/models', 'submit'], icon: 'new', label: 'Submit'},
          ]
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule { }
