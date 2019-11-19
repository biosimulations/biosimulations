import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './Shared/Components/home/home.component';

import { FourComponent } from './Shared/Components/four/four.component';

import { AuthGuard } from './Shared/Gaurds/auth.guard';

import { CallbackComponent } from './Shared/Components/callback/callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'visualize',
    loadChildren: () =>
      import('./Modules/visualize/visualize.module').then(
        m => m.VisualizeModule
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./Modules/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./Modules/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'simulate',
    loadChildren: () =>
      import('./Modules/simulate/simulate.module').then(m => m.SimulateModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'models',
    loadChildren: () =>
      import('./Modules/models/models.module').then(m => m.ModelsModule),
  },

  { path: 'callback', component: CallbackComponent },

  { path: '**', component: FourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
