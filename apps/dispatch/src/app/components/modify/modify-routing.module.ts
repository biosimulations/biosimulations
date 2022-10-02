import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyRunComponent } from './modify-run/modify-run.component';

const routes: Routes = [
  {
    path: '',
    component: ModifyRunComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyRoutingModule {}
