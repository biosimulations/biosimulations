import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ModelsRoutingModule } from './models-routing.module';
import { ModelsComponent } from './models.component';
import { BrowseModelsComponent } from './browse-models/browse-models.component';
import { NewModelComponent } from './new-model/new-model.component';
import { ViewModelComponent } from './view-model/view-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
const routes: Routes = [{ path: '', component: ModelsComponent }];

@NgModule({
  declarations: [
    ModelsComponent,
    BrowseModelsComponent,
    NewModelComponent,
    ViewModelComponent,
    EditModelComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
    MatSortModule,
    ModelsRoutingModule,
    RouterModule.forChild(routes),
  ],
})
export class ModelsModule {}
