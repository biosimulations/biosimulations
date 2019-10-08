import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './Pages/about/about.component';
import { HomeComponent } from './Pages/home/home.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { AuthGuard } from './Gaurds/auth.guard';
<<<<<<< HEAD
=======
import { UploadComponent } from './Pages/upload/upload.component';
import { FileEditComponent } from './Pages/files/file-edit/file-edit.component';
>>>>>>> master
import { CallbackComponent } from './Components/callback/callback.component';
import { ProfileComponent } from './Components/profile/profile.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: '', component: HomeComponent },
  { path: 'visualize', component: VisualizeComponent },
  { path: 'visualize/:id', component: VisualizeComponent },
  { path: 'simulate', component: SimulateComponent, canActivate: [AuthGuard] },
  {
    path: 'simulate/:id',
    component: UnderConstructionComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'login', component: LoginComponent },
  { path: 'files', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'files/edit/:fileId', component: FileEditComponent },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: FourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
