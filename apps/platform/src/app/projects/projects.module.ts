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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectsCardsBrowseComponent } from './projects-cards-browse/projects-cards-browse.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectSelectVisualizationComponent } from './project-select-visualization/project-select-visualization.component';
import { ProjectVisualizationComponent } from './project-visualization/project-visualization.component';
import { ProjectVegaVisualizationComponent } from './project-vega-visualization/project-vega-visualization.component';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ViewComponent,
    ProjectCardComponent,
    ProjectsCardsBrowseComponent,
    ProjectOverviewComponent,
    ProjectFilesComponent,
    ProjectSelectVisualizationComponent,
    ProjectVisualizationComponent,
    ProjectVegaVisualizationComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatStepperModule,
    MatSortModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
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
