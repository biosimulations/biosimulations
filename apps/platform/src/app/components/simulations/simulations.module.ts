import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedUiModule } from '../../../../../../libs/shared/ui/src';
import { SimulationRunsVizModule } from '../../../../../../libs/simulation-runs/viz/src';
import { SimulationRunsUiModule } from '../../../../../../libs/simulation-runs/ui/src';
import { BiosimulationsIconsModule } from '../../../../../../libs/shared/icons/src';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedAngularModule } from '../../../../../../libs/shared/angular/src';
import { SimulationsRoutingModule } from './simulations-routing.module';
import { BrowseComponent } from './browse/browse.component';
import { DeleteSimulationsDialogComponent } from './browse/delete-simulations-dialog.component';
import { ViewComponent } from './view/view.component';
import { OverviewComponent } from './view/overview/overview.component';
import { SimulationLogModule } from './view/simulation-log/simulation-log.module';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  declarations: [BrowseComponent, DeleteSimulationsDialogComponent, ViewComponent, OverviewComponent, PublishComponent],
  imports: [
    CommonModule,
    SimulationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedUiModule,
    SimulationRunsVizModule,
    SimulationRunsUiModule,
    BiosimulationsIconsModule,
    MatDialogModule,
    SimulationLogModule,
    SharedAngularModule,
  ],
})
export class SimulationsModule {}
