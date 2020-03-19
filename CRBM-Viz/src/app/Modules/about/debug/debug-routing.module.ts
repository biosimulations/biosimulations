import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebugComponent } from './debug.component';

const routes: Routes = [{ path: '', component: DebugComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebugRoutingModule { }
