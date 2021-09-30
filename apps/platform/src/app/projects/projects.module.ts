import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { ResourceViewModule } from '@biosimulations/platform/view';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ViewComponent } from './view/view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectsCardsBrowseComponent } from './projects-cards-browse/projects-cards-browse.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectFigureComponent } from './project-figure/project-figure.component';
import { ProjectSimulationComponent } from './project-simulation/project-simulation.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ViewComponent,
    ProjectCardComponent,
    ProjectsCardsBrowseComponent,
    ProjectOverviewComponent,
    ProjectFigureComponent,
    ProjectSimulationComponent,
    ProjectFilesComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
    MatSortModule,
    MatTabsModule,
    MatCarouselModule.forRoot(),
    SharedUiModule,
    BiosimulationsIconsModule,
    MatPaginatorModule,
    MatExpansionModule,
    SharedDebugModule,
    MatCheckboxModule,
    DragDropModule,
    ResourceViewModule,
    SharedErrorComponentsModule,
    LazyLoadImageModule,
  ],
})
export class ProjectsModule {}
