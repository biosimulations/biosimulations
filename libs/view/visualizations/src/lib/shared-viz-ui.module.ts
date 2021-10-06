import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { VegaEmbedComponent } from './vega-embed/vega-embed.component';
import { VegaVisualizationComponent } from './vega-visualization/vega-visualization.component';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { PlotlyVisualizationComponent } from './plotly-visualization/plotly-visualization.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedUiModule, PlotlyViaWindowModule],
  exports: [
    VegaEmbedComponent,
    VegaVisualizationComponent,
    PlotlyVisualizationComponent,
  ],
  declarations: [
    VegaEmbedComponent,
    VegaVisualizationComponent,
    PlotlyVisualizationComponent,
  ],
})
export class SharedVizUiModule {}
