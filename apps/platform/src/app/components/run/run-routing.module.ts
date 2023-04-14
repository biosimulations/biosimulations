import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DispatchComponent } from './dispatch/dispatch.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RunRoutingModule {}
