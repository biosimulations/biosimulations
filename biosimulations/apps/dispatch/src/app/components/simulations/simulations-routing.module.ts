import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';

const shareUrl = (url: string): string => {
  const host = window.location.host;
  navigator.clipboard.writeText(host + url);
  return 'URL was copied to clipboard';
};
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
          onClick: shareUrl,
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
