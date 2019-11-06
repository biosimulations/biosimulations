import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulateComponent } from './simulate/simulate.component';
import { DataComponent } from './data/data.component';
import { FileChooserComponent } from './new-simulation/file-chooser/file-chooser.component';
import { SimulationTaskComponent } from './new-simulation/simulation-task/simulation-task.component';

const routes: Routes = [
  { 
    path: '', component: SimulateComponent, children: [
      { path: '', component: FileChooserComponent },
      { path: 'tasks', component: SimulationTaskComponent}
    ]
  },
  { path: 'browse', component: SimulateComponent },
  { path: 'data', component: DataComponent },
  { path: 'data/:id', component: DataComponent },
  { path: 'new', component: DataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulateRoutingModule {}
