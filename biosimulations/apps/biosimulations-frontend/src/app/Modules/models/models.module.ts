import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../app-material.module';
import { SharedModule } from '../../Shared/shared.module';

import { ModelsRoutingModule } from './models-routing.module';

import { BrowseComponent } from './browse/browse.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { EditModelsComponent } from './edit-models/edit-models.component';

@NgModule({
  declarations: [
    BrowseComponent,
    EditComponent,
    ViewComponent,
    EditModelsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MaterialModule,
    SharedModule,
    ModelsRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModelsModule {}
