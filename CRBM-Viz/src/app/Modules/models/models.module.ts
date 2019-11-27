import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';

import { ModelsRoutingModule } from './models-routing.module';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { UploadComponent } from './upload/upload.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    BrowseComponent,
    EditComponent,
    UploadComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    ModelsRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class ModelsModule {}
