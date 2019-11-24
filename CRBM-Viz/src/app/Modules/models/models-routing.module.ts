import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/Shared/Gaurds/auth.guard';

import { BrowseComponent } from './browse/browse.component';
import { FileTableComponent } from './file-table/file-table.component';
import { UploadComponent } from './upload/upload.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
   path: 'new',
   component: UploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'list',
    component: FileTableComponent,
  },
  {
    path: 'edit/:modelid',
    component: FileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: ':id', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
