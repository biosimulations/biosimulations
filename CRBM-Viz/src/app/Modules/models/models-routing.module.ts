import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { FileTableComponent } from './file-table/file-table.component';

const routes: Routes = [
  { path: 'new', component: UploadComponent },
  { path: '', component: FileTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelsRoutingModule {}
