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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'data-viz'],
          icon: 'chart',
          label: 'Data visualizations',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'simulation-logs'],
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
          route: ['/conventions', 'simulator-specs'],
          icon: 'browse',
          label: 'Simulator specs',
        },
        {
          route: ['/conventions', 'simulator-interfaces'],
          icon: 'logs',
          label: 'Simulator interfaces',
        },
        {
          route: ['/conventions', 'simulator-images'],
          icon: 'docker',
          label: 'Simulator images',
        },
        {
          route: ['/conventions', 'simulation-experiments'],
          icon: 'experiment',
          label: 'Simulation experiments',
        },
        {
          route: ['/conventions', 'simulation-reports'],
          icon: 'report',
          label: 'Simulation reports',
        },
        {
          route: ['/conventions', 'data-viz'],
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
export class ConventionsRoutingModule {}
