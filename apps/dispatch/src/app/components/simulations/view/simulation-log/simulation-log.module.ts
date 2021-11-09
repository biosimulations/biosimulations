import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { SimulationLogComponent } from './simulation-log.component';
import { StructuredSimulationLogElementComponent } from './structured-simulation-log-element.component';

import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [
    SimulationLogComponent,
    StructuredSimulationLogElementComponent,
  ],
  exports: [SimulationLogComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    HighlightModule,
  ],
})
export class SimulationLogModule {}
