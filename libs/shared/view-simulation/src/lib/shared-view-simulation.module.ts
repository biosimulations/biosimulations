import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ProjectMetadataComponent } from './project-metadata/project-metadata.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectSelectVisualizationComponent } from './project-select-visualization/project-select-visualization.component';
import { ProjectVisualizationComponent } from './project-visualization/project-visualization.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    SharedVizUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BiosimulationsIconsModule,
  ],
  exports: [
    ProjectMetadataComponent,
    ProjectFilesComponent,
    ProjectSelectVisualizationComponent,    
    ProjectVisualizationComponent,
  ],
  declarations: [
    ProjectMetadataComponent,
    ProjectFilesComponent,
    ProjectSelectVisualizationComponent,    
    ProjectVisualizationComponent,
  ],
})
export class SharedViewSimulationModule {}
