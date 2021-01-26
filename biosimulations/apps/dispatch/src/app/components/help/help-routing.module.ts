import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent,
    data: {
      contextButtons: [
        { route: ['/help', 'faq'], icon: 'help', label: 'FAQ' },
        { route: ['/help', 'about'], icon: 'info', label: 'About' },
        { route: ['/help', 'terms'], icon: 'legal', label: 'Terms of service' },
        {
          route: ['/help', 'privacy'],
          icon: 'policy',
          label: 'Privacy policy',
        },
      ],
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      breadcrumb: 'About',
      contextButtons: [
        { route: ['/help'], icon: 'tutorial', label: 'Tutorial' },
        { route: ['/help', 'faq'], icon: 'help', label: 'FAQ' },
        { route: ['/help', 'terms'], icon: 'legal', label: 'Terms of service' },
        {
          route: ['/help', 'privacy'],
          icon: 'policy',
          label: 'Privacy policy',
        },
      ],
    },
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      breadcrumb: 'FAQ',
      contextButtons: [
        { route: ['/help'], icon: 'tutorial', label: 'Tutorial' },
        { route: ['/help', 'about'], icon: 'info', label: 'About' },
        { route: ['/help', 'terms'], icon: 'legal', label: 'Terms of service' },
        {
          route: ['/help', 'privacy'],
          icon: 'policy',
          label: 'Privacy policy',
        },
      ],
    },
  },
  {
    path: 'terms',
    component: TermsOfServiceComponent,
    data: {
      breadcrumb: 'Terms of service',
      contextButtons: [
        { route: ['/help'], icon: 'tutorial', label: 'Tutorial' },
        { route: ['/help', 'faq'], icon: 'help', label: 'FAQ' },
        { route: ['/help', 'about'], icon: 'info', label: 'About' },
        {
          route: ['/help', 'privacy'],
          icon: 'policy',
          label: 'Privacy policy',
        },
      ],
    },
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
    data: {
      breadcrumb: 'Privacy policy',
      contextButtons: [
        { route: ['/help'], icon: 'tutorial', label: 'Tutorial' },
        { route: ['/help', 'faq'], icon: 'help', label: 'FAQ' },
        { route: ['/help', 'about'], icon: 'info', label: 'About' },
        { route: ['/help', 'terms'], icon: 'legal', label: 'Terms of service' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
