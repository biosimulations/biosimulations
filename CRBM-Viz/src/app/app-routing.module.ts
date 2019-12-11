import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './Shared/Components/home/home.component';

import { Error404Component } from './Shared/Components/error-404/error-404.component';

import { CallbackComponent } from './Shared/Components/callback/callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'projects',
    loadChildren: () =>
      import('./Modules/projects/projects.module').then(m => m.ProjectsModule),
  },
  {
    path: 'models',
    loadChildren: () =>
      import('./Modules/models/models.module').then(m => m.ModelsModule),
  },
  {
    path: 'simulations',
    loadChildren: () =>
      import('./Modules/simulations/simulations.module').then(m => m.SimulationsModule),
  },
  {
    path: 'visualizations',
    loadChildren: () =>
      import('./Modules/visualizations/visualizations.module').then(m => m.VisualizationsModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./Modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./Modules/about/about.module').then(m => m.AboutModule),
  },

  { path: 'callback', component: CallbackComponent },

  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
