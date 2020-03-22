import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnderConstructionComponent } from './under-construction.component';

const routes: Routes = [{ path: '', component: UnderConstructionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnderConstructionRoutingModule { }
