import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseComponent,
    data: { breadcrumb: 'Browse' },
  },
  {
    path: 'browse',
    component: BrowseComponent,
    data: { breadcrumb: 'Browse' },
  },
  { path: ':id', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
