import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { SimulationLogComponent } from './simulation-log.component';
import { RawSimulationLogComponent } from './raw-simulation-log.component';
import { StructuredSimulationLogElementComponent } from './structured-simulation-log-element.component';

@NgModule({
  declarations: [
    SimulationLogComponent,
    RawSimulationLogComponent,
    StructuredSimulationLogElementComponent,
  ],
  exports: [SimulationLogComponent],
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
})
export class SimulationLogModule {}
