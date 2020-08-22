import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HelpRoutingModule } from './help-routing.module';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

@NgModule({
  declarations: [AboutComponent, FaqComponent, HelpComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,    
    HelpRoutingModule,
    BiosimulationsIconsModule,
  ]
})
export class HelpModule { }
