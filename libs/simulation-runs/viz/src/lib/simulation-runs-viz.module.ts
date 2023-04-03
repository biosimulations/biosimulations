import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { VegaVisualizationComponent } from './vega-visualization/vega-visualization.component';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { PlotlyVisualizationComponent } from './plotly-visualization/plotly-visualization.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NgxResizeObserverModule } from 'ngx-resize-observer';

PlotlyViaCDNModule.setPlotlyVersion('2.11.1'); // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.setPlotlyBundle('basic'); // optional: can be null (for full) or
// 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    PlotlyViaCDNModule,
    BiosimulationsIconsModule,
    NgxResizeObserverModule,
  ],
  exports: [VegaVisualizationComponent, PlotlyVisualizationComponent],
  declarations: [VegaVisualizationComponent, PlotlyVisualizationComponent],
})
export class SimulationRunsVizModule {}
