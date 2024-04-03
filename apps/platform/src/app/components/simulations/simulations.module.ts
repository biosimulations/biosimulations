import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SimulationRunsVizModule } from '@biosimulations/simulation-runs/viz';
import { SimulationRunsUiModule } from '@biosimulations/simulation-runs/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedAngularModule } from '@biosimulations/shared/angular';
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
    SimulationLogModule,
    MatCardModule,
  ],
})
export class SimulationsModule {}
