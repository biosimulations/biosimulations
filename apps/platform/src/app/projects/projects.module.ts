import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { SharedProjectUiModule } from '@biosimulations/shared/project-ui';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ViewComponent } from './view/view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectCardComponent } from './project-card/project-card.component';
import { BrowseComponent } from './browse/browse.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ViewComponent,
    ProjectCardComponent,
    BrowseComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatTabsModule,
    SharedUiModule,
    SharedVizUiModule,
    SharedProjectUiModule,
    BiosimulationsIconsModule,
    SharedDebugModule,
    SharedErrorComponentsModule,
    LazyLoadImageModule,
  ],
})
export class ProjectsModule {}
