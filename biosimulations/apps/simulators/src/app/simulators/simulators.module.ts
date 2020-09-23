import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { SimulatorsRoutingModule } from './simulators-routing.module';
import { BrowseSimulatorsComponent } from './browse-simulators/browse-simulators.component';
import { ViewSimulatorComponent } from './view-simulator/view-simulator.component';
const routes: Routes = [{ path: '', component: BrowseSimulatorsComponent }];

@NgModule({
  declarations: [BrowseSimulatorsComponent, ViewSimulatorComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    SimulatorsRoutingModule,
    SharedDebugModule,
  ],
  providers: [],
})
export class SimulatorsModule {}
