import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { Error404Component } from './error-404.component';
import { Error500Component } from './error-500.component';
import { UnderConstructionComponent } from './under-construction.component';
import { UnderMaintainenceComponent } from './under-maintainence.component';

export const errorRoutes: Routes = [
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '500',
    component: Error500Component,
  },
  {
    path: 'construction',
    component: UnderConstructionComponent,
  },
  {
    path: 'maintainence',
    component: UnderMaintainenceComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(errorRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class ErrorModule {}
