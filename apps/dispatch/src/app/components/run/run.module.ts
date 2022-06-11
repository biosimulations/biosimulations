import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { RunRoutingModule } from './run-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import {
  UploadProjectComponent,
  ProjectCapabilitiesComponent,
  SimulationToolComponent,
  CommercialSolversComponent,
  ComputationalResourcesComponent,
  MetadataComponent,
  NotificationsComponent,
} from './form-steps';

@NgModule({
  declarations: [
    DispatchComponent,
    UploadProjectComponent,
    ProjectCapabilitiesComponent,
    SimulationToolComponent,
    CommercialSolversComponent,
    ComputationalResourcesComponent,
    MetadataComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    RunRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
})
export class RunModule {}
