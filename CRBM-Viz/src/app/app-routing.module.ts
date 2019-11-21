import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './Shared/Gaurds/auth.guard';

import { HomeComponent } from './Shared/Components/home/home.component';

import { FourComponent } from './Shared/Components/four/four.component';

import { CallbackComponent } from './Shared/Components/callback/callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'models',
    loadChildren: () =>
      import('./Modules/models/models.module').then(m => m.ModelsModule),
  },
  {
    path: 'simulate',
    loadChildren: () =>
      import('./Modules/simulate/simulate.module').then(m => m.SimulateModule),
  },
  {
    path: 'visualize',
    loadChildren: () =>
      import('./Modules/visualize/visualize.module').then(m => m.VisualizeModule),
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

  { path: '**', component: FourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
