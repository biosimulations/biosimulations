import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { PublishComponent } from './publish/publish.component';
import { Endpoints } from '@biosimulations/config/common';

import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { SimulationRun } from '@biosimulations/datamodel/common';
import { ClipboardService } from '@biosimulations/shared/angular';

function viewProject(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];
  router.navigate(['/runs', id]);
  return undefined;
}

function rerunProject(url: string, router: Router): void {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];

  const endpoints = new Endpoints();

  new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }))
    .get<SimulationRun>(endpoints.getSimulationRunEndpoint(true, id))
    .subscribe((simulationRun: SimulationRun): void => {
      const queryParams = {
        projectUrl: endpoints.getSimulationRunDownloadEndpoint(true, id),
        simulator: simulationRun.simulator,
        simulatorVersion: simulationRun.simulatorVersion,
        runName: simulationRun.name + ' (rerun)',
      };
      router.navigate(['/runs/new'], { queryParams: queryParams });
    });

  return;
}

function shareProject(url: string, _: Router, clipboardService: ClipboardService): void {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];
  const protocol = window.location.protocol;
  const host = window.location.host;
  const toCopy = protocol + '//' + host + '/runs/' + id;
  clipboardService.copyToClipboard(toCopy, 'The URL for sharing this simulation was copied to your clipboard.');
}

function publishProject(url: string, router: Router): void {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];
  router.navigate(['/runs', id, 'publish']);
  return;
}

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: '', // Catch-all for /runs/* to the RunModule, potentially adjust or refine this setup
    loadChildren: () => import('../run/run.module').then((m) => m.RunModule),
  },
  {
    path: 'new',
    loadChildren: () => import('../run/run.module').then((m) => m.RunModule),
    data: {
      breadcrumb: 'Run',
    },
    pathMatch: 'full',
  },
  {
    path: ':uuid',
    children: [
      {
        path: '',
        component: ViewComponent,
        data: {
          contextButtons: [
            {
              onClick: rerunProject,
              hover: 'Rerun project',
              icon: 'redo',
              label: 'Rerun',
            },
            {
              onClick: shareProject,
              hover: 'Copy project URL to clipboard',
              icon: 'share',
              label: 'Share',
            },
            {
              onClick: publishProject,
              hover: 'Publish project',
              icon: 'publish',
              label: 'Publish',
            },
          ],
        },
      },
      {
        path: 'publish',
        component: PublishComponent,
        data: {
          breadcrumb: 'Publish',
          contextButtons: [
            {
              onClick: viewProject,
              hover: 'View project',
              icon: 'overview',
              label: 'View',
            },
            {
              onClick: rerunProject,
              hover: 'Rerun project',
              icon: 'redo',
              label: 'Rerun',
            },
            {
              onClick: shareProject,
              hover: 'Copy project URL to clipboard',
              icon: 'share',
              label: 'Share',
            },
          ],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule {}
