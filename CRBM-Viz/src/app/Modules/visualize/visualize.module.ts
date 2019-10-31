import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualizeRoutingModule } from './visualize-routing.module';
import { VisualizeComponent } from './visualize/visualize.component';
import { VegaViewerComponent } from './vega-viewer/vega-viewer.component';
import { SharedModule } from '../../Shared/shared.module';

@NgModule({
  declarations: [VisualizeComponent, VegaViewerComponent],
  imports: [CommonModule, VisualizeRoutingModule, SharedModule],
  exports: [],
})
export class VisualizeModule {}
