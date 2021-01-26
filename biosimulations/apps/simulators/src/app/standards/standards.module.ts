import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';

import { StandardsRoutingModule } from './standards-routing.module';

import { OverviewComponent } from './overview/overview.component';
import { SimulatorSpecsComponent } from './simulator-specs/simulator-specs.component';
import { SimulatorInterfacesComponent } from './simulator-interfaces/simulator-interfaces.component';
import { SimulatorImagesComponent } from './simulator-images/simulator-images.component';
import { SimulationExperimentsComponent } from './simulation-experiments/simulation-experiments.component';
import { SimulationLogsComponent } from './simulation-logs/simulation-logs.component';
import { SimulationReportsComponent } from './simulation-reports/simulation-reports.component';

import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [
    OverviewComponent,
    SimulatorSpecsComponent,
    SimulatorInterfacesComponent,
    SimulatorImagesComponent,
    SimulationExperimentsComponent,
    SimulationLogsComponent,
    SimulationReportsComponent,
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    SharedContentModule,
    StandardsRoutingModule,
    HighlightModule,
  ],
})
export class StandardsModule {}
