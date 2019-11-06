import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelsRoutingModule } from './models-routing.module';
import { FileTableComponent } from './file-table/file-table.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { UploadComponent } from './upload/upload.component';
import { MaterialModule } from '../app-material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FileTableComponent, FileEditComponent, UploadComponent],
  imports: [
    CommonModule,
    ModelsRoutingModule,
    CommonModule,
    MaterialModule,
    FormsModule,
  ],
})
export class ModelsModule {}
