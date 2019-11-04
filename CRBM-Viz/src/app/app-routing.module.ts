import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './Modules/about/help/help.component';

import { HomeComponent } from './Pages/home/home.component';

import { SimulateComponent } from './Pages/simulate/simulate.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { AuthGuard } from './Shared/Gaurds/auth.guard';
import { UploadComponent } from './Pages/upload/upload.component';
import { FileEditComponent } from './Pages/files/file-edit/file-edit.component';
import { CallbackComponent } from './Components/callback/callback.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ProfileEditComponent } from './Components/profile/profile-edit.component';
import { DataComponent } from './Pages/data/data.component';
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

  { path: 'data', component: DataComponent },
  { path: 'data/:id', component: DataComponent },
  { path: 'simulate', component: SimulateComponent, canActivate: [AuthGuard] },
  {
    path: 'simulate/:id',
    component: UnderConstructionComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'login', component: LoginComponent },
  { path: 'files', component: UploadComponent, canActivate: [AuthGuard] },
  {
    path: 'files/edit/:fileId',
    component: FileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: FourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
