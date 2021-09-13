import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsCardsBrowseComponent } from './projects-cards-browse/projects-cards-browse.component';

import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsCardsBrowseComponent,
    data: { breadcrumb: 'Browse' },
  },
  {
    path: 'browse',
    component: ProjectsCardsBrowseComponent,
    data: { breadcrumb: 'Browse' },
  },
  { path: ':id', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
