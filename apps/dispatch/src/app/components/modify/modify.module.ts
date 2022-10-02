import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { CreateProjectFormModule } from '@biosimulations/simulation-project-utils/ui';
import { ModifyRoutingModule } from './modify-routing.module';
import { ModifyRunComponent } from './modify-run/modify-run.component';

@NgModule({
  declarations: [ModifyRunComponent],
  imports: [CommonModule, ModifyRoutingModule, SharedUiModule, CreateProjectFormModule],
})
export class ModifyModule {}
