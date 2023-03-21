import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SimulationRunsVizModule } from '@biosimulations/simulation-runs/viz';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MetadataComponent } from './metadata/metadata.component';
import { MetadataDialogComponent } from './metadata-dialog/metadata-dialog.component';
import { FilesComponent } from './files/files.component';
import { SelectVisualizationComponent } from './select-viz/select-viz.component';
import { DesignHistogram1DVisualizationComponent } from './design-histogram-1d-viz/design-histogram-1d-viz.component';
import { DesignHeatmap2DVisualizationComponent } from './design-heatmap-2d-viz/design-heatmap-2d-viz.component';
import { DesignLine2DVisualizationComponent } from './design-line-2d-viz/design-line-2d-viz.component';
import { RenderVisualizationComponent } from './render-viz/render-viz.component';
import { ApiClientModule } from '@biosimulations/angular-api-client';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    SimulationRunsVizModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    BiosimulationsIconsModule,
    ApiClientModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true, // Github-flavored markdown see (https://github.com/biosimulations/biosimulations/issues/3963)
        },
      },
    }),
    MatDialogModule,
  ],
  exports: [
    MetadataComponent,
    MetadataDialogComponent,
    FilesComponent,
    SelectVisualizationComponent,
    DesignHistogram1DVisualizationComponent,
    DesignHeatmap2DVisualizationComponent,
    DesignLine2DVisualizationComponent,
    RenderVisualizationComponent,
  ],
  declarations: [
    MetadataComponent,
    MetadataDialogComponent,
    FilesComponent,
    SelectVisualizationComponent,
    DesignHistogram1DVisualizationComponent,
    DesignHeatmap2DVisualizationComponent,
    DesignLine2DVisualizationComponent,
    RenderVisualizationComponent,
  ],
})
export class SimulationRunsUiModule {}
