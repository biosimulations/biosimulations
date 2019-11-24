import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizeComponent } from './visualize/visualize.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizeComponent,
  },
  {
   path: ':id',
   component: VisualizeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizeRoutingModule {}
