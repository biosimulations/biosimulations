import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './Pages/about/about.component';
import { HomeComponent } from './Pages/home/home.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './Gaurds/auth.guard';
import { UploadComponent } from './Pages/upload/upload.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: '', component: HomeComponent },
  // { path: 'visualize', component: VisualizeComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'visualize/:id', component: VisualizeComponent },
  { path: 'simulate', component: SimulateComponent, canActivate: [AuthGuard] },
  {
    path: 'simulate/:id',
    component: UnderConstructionComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'login', component: LoginComponent },
  { path: 'files', component: UploadComponent, canActivate: [AuthGuard] },
  { path: '**', component: FourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
