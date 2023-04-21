import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SimulationRunsVizModule } from '@biosimulations/simulation-runs/viz';
import { SimulationRunsUiModule } from '@biosimulations/simulation-runs/ui';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ViewComponent } from './view/view.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ApiClientModule } from '@biosimulations/angular-api-client';

import { JsonLdModule } from '@biosimulations/angular-json-ld';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewComponent, ProjectTableComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedUiModule,
    SimulationRunsVizModule,
    SimulationRunsUiModule,
    JsonLdModule,
    BiosimulationsIconsModule,
    SharedDebugModule,
    SharedErrorComponentsModule,
    LazyLoadImageModule,
    ApiClientModule,
    FormsModule,
  ],
})
export class ProjectsModule {}
