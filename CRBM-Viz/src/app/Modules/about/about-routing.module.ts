import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  {
    path: 'debug',
    loadChildren: () =>
      import('../about/debug/debug.module').then(m => m.DebugModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}
