import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/view-visualizations';
import { SharedProjectUiModule } from '@biosimulations/view-projects';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatDialogModule } from '@angular/material/dialog';

import { SimulationsRoutingModule } from './simulations-routing.module';
import { BrowseComponent } from './browse/browse.component';
import { DeleteSimulationsDialogComponent } from './browse/delete-simulations-dialog.component';
import { ViewComponent } from './view/view.component';
import { OverviewComponent } from './view/overview/overview.component';
import { SimulationLogModule } from './view/simulation-log/simulation-log.module';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  declarations: [
    BrowseComponent,
    DeleteSimulationsDialogComponent,
    ViewComponent,
    OverviewComponent,
    PublishComponent,
  ],
  imports: [
    CommonModule,
    SimulationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SharedUiModule,
    SharedVizUiModule,
    SharedProjectUiModule,
    BiosimulationsIconsModule,
    MatDialogModule,
    SimulationLogModule,
  ],
})
export class SimulationsModule {}
