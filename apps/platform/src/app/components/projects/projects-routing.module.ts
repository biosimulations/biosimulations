import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectTableComponent,
    data: { breadcrumb: 'Browse' },
  },
  {
    path: 'browse',
    component: ProjectTableComponent,
    data: { breadcrumb: 'Browse' },
  },
  { path: ':id', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
