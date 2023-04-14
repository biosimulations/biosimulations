import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationProjectUtilsModule } from '../../../../../../libs/simulation-project-utils/simulation-project-utils/src';
import { UtilsRoutingModule } from './utils-routing.module';

@NgModule({
  imports: [CommonModule, SimulationProjectUtilsModule, UtilsRoutingModule],
})
export class UtilsModule {}
