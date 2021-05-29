import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';
import { urls } from '@biosimulations/config/common';

function rerunSimulation(url: string, router: Router): undefined {
  const parts = url.split('/');
  const id = parts[parts.length - 1].split('#')[0];

  router.navigate(['/run'], {
    queryParams: {
      projectUrl: `${urls.dispatchApi}run/${id}/download`,
    },
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
          hover: 'Re-run simulation',
          icon: 'redo',
          label: 'Re-run',
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
