import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './Pages/about/about.component';
import { HomeComponent } from './Pages/home/home.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { LoginComponent } from './Pages/login/login.component';
const routes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: '', component: HomeComponent },
    { path: 'visualize', component: VisualizeComponent },
    {path:'login', component: LoginComponent},
    { path: 'visualize/:id', component: UnderConstructionComponent },
    { path: 'simulate', component: SimulateComponent },
    { path: 'simulate/:id', component: UnderConstructionComponent },
    { path: '**', component: FourComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
