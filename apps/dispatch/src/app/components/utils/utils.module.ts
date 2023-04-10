import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationProjectUtilsModule } from '@biosimulations/simulation-project-utils';
import { UtilsRoutingModule } from './utils-routing.module';

@NgModule({
  imports: [CommonModule, SimulationProjectUtilsModule, UtilsRoutingModule],
})
export class UtilsModule {}
