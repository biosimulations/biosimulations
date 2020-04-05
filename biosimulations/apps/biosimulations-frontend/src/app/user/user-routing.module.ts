import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../Shared/Gaurds/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { ProjectsComponent } from './projects/projects.component';
import { ModelsComponent } from './models/models.component';
import { SimulationsComponent } from './simulations/simulations.component';
import { ChartTypesComponent } from './chart-types/chart-types.component';
import { VisualizationsComponent } from './visualizations/visualizations.component';

const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: ProfileEditComponent, canActivate: [AuthGuard] },

  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'models', component: ModelsComponent, canActivate: [AuthGuard] },
  {
    path: 'simulations',
    component: SimulationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chart-types',
    component: ChartTypesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visualizations',
    component: VisualizationsComponent,
    canActivate: [AuthGuard],
  },

  { path: ':username', component: ProfileComponent },

  { path: ':username/projects', component: ProjectsComponent },
  { path: ':username/models', component: ModelsComponent },
  { path: ':username/simulations', component: SimulationsComponent },
  { path: ':username/chart-types', component: ChartTypesComponent },
  { path: ':username/visualizations', component: VisualizationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
