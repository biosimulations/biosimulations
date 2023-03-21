import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { CreateProjectRoutingModule } from './create-project-routing.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateProjectFormModule } from '../create-project-form/create-project-form.module';

@NgModule({
  declarations: [CreateProjectComponent],
  imports: [CommonModule, CreateProjectRoutingModule, SharedUiModule, CreateProjectFormModule],
})
export class CreateProjectModule {}
