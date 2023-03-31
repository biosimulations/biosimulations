import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SimulationProjectUtilsUiModule } from '@biosimulations/simulation-project-utils/ui';
import { UtilsRoutingModule } from './utils-routing.module';

@NgModule({
  // imports: [CommonModule, SimulationProjectUtilsUiModule, UtilsRoutingModule],
  imports: [CommonModule, UtilsRoutingModule],
})
export class UtilsModule {}
