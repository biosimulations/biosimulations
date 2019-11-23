import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { FileTableComponent } from './file-table/file-table.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { AuthGuard } from 'src/app/Shared/Gaurds/auth.guard';

const routes: Routes = [
  { path: '', component: FileTableComponent },
  { 
    path: 'new', 
    component: UploadComponent,
    canActivate: [AuthGuard],
  },  
  {
    path: 'edit/:modelid',
    component: FileEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
