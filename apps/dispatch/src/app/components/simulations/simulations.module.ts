import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatDialogModule } from '@angular/material/dialog';

import { SimulationsRoutingModule } from './simulations-routing.module';
import { BrowseComponent } from './browse/browse.component';
import { DeleteSimulationsDialogComponent } from './browse/delete-simulations-dialog.component';
import { ViewComponent } from './view/view.component';
import { SimulationLogModule } from './view/simulation-log/simulation-log.module';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  declarations: [
    BrowseComponent,
    DeleteSimulationsDialogComponent,
    ViewComponent,
    PublishComponent,
  ],
  imports: [
    CommonModule,
    SimulationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedUiModule,
    SharedVizUiModule,
    BiosimulationsIconsModule,
    MatDialogModule,
    SimulationLogModule,
  ],
})
export class SimulationsModule {}
