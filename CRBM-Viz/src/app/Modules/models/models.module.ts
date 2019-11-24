import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';

import { ModelsRoutingModule } from './models-routing.module';

import { BrowseComponent } from './browse/browse.component';
import { FileTableComponent } from './file-table/file-table.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { UploadComponent } from './upload/upload.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    BrowseComponent,
    FileTableComponent,
    FileEditComponent,
    UploadComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    ModelsRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ModelsModule {}
