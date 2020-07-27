import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelsComponent } from './models.component';
import { BrowseModelsComponent } from './browse-models/browse-models.component';
import { NewModelComponent } from './new-model/new-model.component';
import { ViewModelComponent } from './view-model/view-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';

const routes: Routes = [
  {
    path: '', component: ModelsComponent, data: {
      breadcrumb: 'Models'
    }
  },
  {
    path: 'browse',
    component: BrowseModelsComponent,
    data: {
      breadcrumb: "Browse"
    }
  },
  {
    path: 'new',
    component: NewModelComponent,
    data: {
      breadcrumb: "New"
    }
  },
  {
    path: ':id',
    component: ViewModelComponent,
    data: {
      breadcrumb: "View"
    }
  },
  {
    path: 'edit/:id',
    component: EditModelComponent,
    data: {
      breadcrumb: "Edit"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule { }
