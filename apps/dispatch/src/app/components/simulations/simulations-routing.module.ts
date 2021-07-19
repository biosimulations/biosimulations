import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { urls } from '@biosimulations/config/common';

import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { SimulationRun } from '@biosimulations/dispatch/api-models';

function rerunSimulation(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[parts.length - 1].split('#')[0];

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

function shareSimulation(url: string): string {
  const protocol = window.location.protocol;
  const host = window.location.host;
  navigator.clipboard.writeText(protocol + '//' + host + url.split('#')[0]);
  return 'The URL for sharing this simulation was copied to your clipboard.';
}

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
  },
  {
    path: ':uuid',
    component: ViewComponent,
    data: {
      contextButtons: [
        {
          onClick: rerunSimulation,
          hover: 'Rerun simulation',
          icon: 'redo',
          label: 'Rerun',
        },
        {
          onClick: shareSimulation,
          hover: 'Click to copy URL to clipboard',
          icon: 'share',
          label: 'Share',
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationsRoutingModule {}
