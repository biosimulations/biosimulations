import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { VegaVisualizationComponent } from './vega-visualization/vega-visualization.component';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { PlotlyVisualizationComponent } from './plotly-visualization/plotly-visualization.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

@NgModule({
  imports: [CommonModule, RouterModule, SharedUiModule, PlotlyViaWindowModule, BiosimulationsIconsModule],
  exports: [VegaVisualizationComponent, PlotlyVisualizationComponent],
  declarations: [VegaVisualizationComponent, PlotlyVisualizationComponent],
})
export class SimulationRunsVizModule {}
