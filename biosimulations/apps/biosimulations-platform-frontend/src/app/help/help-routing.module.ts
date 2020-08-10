import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'help', component: HelpComponent, data: { breadcrumb: 'Help' } },
    { path: 'privacy', component: PrivacyPolicyComponent, data: { breadcrumb: 'Privacy policy' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
