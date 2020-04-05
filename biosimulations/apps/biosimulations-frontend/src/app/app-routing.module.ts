import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './Shared/Components/home/home.component';

import { Auth0CallbackComponent } from './Shared/Components/auth-0-callback/auth-0-callback.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.module').then(m => m.ProjectsModule),
  },
  {
    path: 'models',
    loadChildren: () =>
      import('./models/models.module').then(m => m.ModelsModule),
  },
  {
    path: 'simulations',
    loadChildren: () =>
      import('./simulations/simulations.module').then(m => m.SimulationsModule),
  },
  {
    path: 'chart-types',
    loadChildren: () =>
      import('./chart-types/chart-types.module').then(m => m.ChartTypesModule),
  },
  {
    path: 'visualizations',
    loadChildren: () =>
      import('./visualizations/visualizations.module').then(
        m => m.VisualizationsModule,
      ),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
  },

  { path: 'callback', component: Auth0CallbackComponent },
  {
    path: 'errors',
    loadChildren: () =>
      import('./errors/errors.module').then(m => m.ErrorsModule),
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
