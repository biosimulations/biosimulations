import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SimulationRunsVizModule } from '@biosimulations/simulation-runs/viz';
import { SimulationRunsUiModule } from '@biosimulations/simulation-runs/ui';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ViewComponent } from './view/view.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { BrowseComponent } from './browse/browse.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ApiClientModule } from '@biosimulations/angular-api-client';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';

@NgModule({
  declarations: [ViewComponent, ProjectCardComponent, BrowseComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedUiModule,
    SimulationRunsVizModule,
    SimulationRunsUiModule,
    BiosimulationsIconsModule,
    SharedDebugModule,
    SharedErrorComponentsModule,
    LazyLoadImageModule,
    ApiClientModule,
    NgxJsonLdModule,
  ],
})
export class ProjectsModule {}
