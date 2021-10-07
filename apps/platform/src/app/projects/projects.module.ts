import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/view-visualizations';
import { SharedProjectUiModule } from '@biosimulations/view-projects';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ViewComponent } from './view/view.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { BrowseComponent } from './browse/browse.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ApiClientModule } from '@biosimulations/angular-api-client';
@NgModule({
  declarations: [ViewComponent, ProjectCardComponent, BrowseComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedUiModule,
    SharedVizUiModule,
    SharedProjectUiModule,
    BiosimulationsIconsModule,
    SharedDebugModule,
    SharedErrorComponentsModule,
    LazyLoadImageModule,
    ApiClientModule,
  ],
})
export class ProjectsModule {}
