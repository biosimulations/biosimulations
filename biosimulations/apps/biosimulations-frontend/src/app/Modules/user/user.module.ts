import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { ProjectsComponent } from './projects/projects.component';
import { ModelsComponent } from './models/models.component';
import { SimulationsComponent } from './simulations/simulations.component';
import { ChartTypesComponent } from './chart-types/chart-types.component';
import { VisualizationsComponent } from './visualizations/visualizations.component';
import { SharedModule } from '../../Shared/shared.module';
import { MaterialModule } from '../app-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    ProjectsComponent,
    ModelsComponent,
    SimulationsComponent,
    ChartTypesComponent,
    VisualizationsComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    MaterialModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
