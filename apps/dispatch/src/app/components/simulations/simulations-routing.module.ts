import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { PublishComponent } from './publish/publish.component';
import { urls } from '@biosimulations/config/common';

import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { SimulationRun } from '@biosimulations/dispatch/api-models';

function viewProject(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];
  router.navigate(['/simulations', id]);
  return undefined;
}

function rerunProject(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];

  new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }))
    .get<SimulationRun>(`${urls.dispatchApi}run/${id}`)
    .subscribe((simulationRun: SimulationRun): void => {
      const queryParams = {
        projectUrl: `${urls.dispatchApi}run/${id}/download`,
        simulator: simulationRun.simulator,
        simulatorVersion: simulationRun.simulatorVersion,
        runName: simulationRun.name + ' (rerun)',
      };
      router.navigate(['/run'], { queryParams: queryParams });
    });

  return undefined;
}

function shareProject(url: string): string {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];

  const protocol = window.location.protocol;
  const host = window.location.host;
  navigator.clipboard.writeText(protocol + '//' + host + '/simulations/' + id);
  return 'The URL for sharing this simulation was copied to your clipboard.';
}

function publishProject(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[2].split('#')[0];
  router.navigate(['/simulations', id, 'publish']);
  return undefined;
}

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
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
