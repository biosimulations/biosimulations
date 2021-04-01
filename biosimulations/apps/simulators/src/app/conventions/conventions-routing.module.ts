import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { SimulatorSpecsComponent } from './simulator-specs/simulator-specs.component';
import { SimulatorInterfacesComponent } from './simulator-interfaces/simulator-interfaces.component';
import { SimulatorImagesComponent } from './simulator-images/simulator-images.component';
import { SimulationExperimentsComponent } from './simulation-experiments/simulation-experiments.component';
import { SimulationReportsComponent } from './simulation-reports/simulation-reports.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';
import { SimulationLogsComponent } from './simulation-logs/simulation-logs.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    data: {
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'simulator-specs',
    component: SimulatorSpecsComponent,
    data: {
      breadcrumb: 'Simulator specs',
      contextButtons: [
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'simulator-interfaces',
    component: SimulatorInterfacesComponent,
    data: {
      breadcrumb: 'Simulator interfaces',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'simulator-images',
    component: SimulatorImagesComponent,
    data: {
      breadcrumb: 'Simulator images',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'simulation-experiments',
    component: SimulationExperimentsComponent,
    data: {
      breadcrumb: 'Simulation experiments',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },  
  {
    path: 'simulation-reports',
    component: SimulationReportsComponent,
    data: {
      breadcrumb: 'Simulation reports',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'data-viz',
    component: DataVisualizationComponent,
    data: {
      breadcrumb: 'Data visualizations',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'simulation-logs'],
          icon: 'progress',
          label: 'Simulation logs',
        },
      ],
    },
  },
  {
    path: 'simulation-logs',
    component: SimulationLogsComponent,
    data: {
      breadcrumb: 'Project Simulation logs',
      contextButtons: [
        {
          route: ['/standards', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/standards', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/standards', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/standards', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/standards', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/standards', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StandardsRoutingModule {}
