import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: ':uuid',
    component: ViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule {}
