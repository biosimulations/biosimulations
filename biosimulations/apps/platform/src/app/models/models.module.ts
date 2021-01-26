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
import { ModelService } from './services/model.service';
import { ModelHttpService } from './services/model-http.service';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { ResourceViewModule } from '@biosimulations/platform/view';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
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
    SharedUiModule,
    BiosimulationsIconsModule,
    MatPaginatorModule,
    MatExpansionModule,
    SharedDebugModule,
    MatCheckboxModule,
    DragDropModule,
    ResourceViewModule,
  ],
  providers: [],
})
export class ModelsModule {}
