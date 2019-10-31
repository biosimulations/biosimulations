import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualizeLandingComponent } from './visualize-landing/visualize-landing.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizeLandingComponent,
  },
  { path: 'one', component: VisualizeLandingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizeRoutingModule {}
