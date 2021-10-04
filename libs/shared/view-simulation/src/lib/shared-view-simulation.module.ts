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
import { MetadataComponent } from './metadata/metadata.component';
import { FilesComponent } from './files/files.component';
import { SelectVisualizationComponent } from './select-viz/select-viz.component';
import { RenderVisualizationComponent } from './render-viz/render-viz.component';

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
    MetadataComponent,
    FilesComponent,
    SelectVisualizationComponent,    
    RenderVisualizationComponent,
  ],
  declarations: [
    MetadataComponent,
    FilesComponent,
    SelectVisualizationComponent,
    RenderVisualizationComponent,
  ],
})
export class SharedViewSimulationModule {}
