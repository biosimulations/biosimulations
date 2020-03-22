import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';

const routes: Routes = [{ path: '', component: ErrorsComponent }, { path: 'underConstruction', loadChildren: () => import('./under-construction/under-construction.module').then(m => m.UnderConstructionModule) }, { path: '/404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
