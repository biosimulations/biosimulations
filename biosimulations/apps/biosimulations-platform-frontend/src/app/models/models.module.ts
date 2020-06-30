import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ModelsRoutingModule } from './models-routing.module';
import { ModelsComponent } from './models.component';

const routes: Routes = [
  { path: '', component: ModelsComponent }
];

@NgModule({
  declarations: [ModelsComponent],
  imports: [
    CommonModule,
    ModelsRoutingModule,
    RouterModule.forChild(routes)
  ]
})
export class ModelsModule { }
