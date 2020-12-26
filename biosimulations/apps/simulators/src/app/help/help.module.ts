import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedContentModule } from '@biosimulations/shared/content';

import { HelpRoutingModule } from './help-routing.module';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [AboutComponent, FaqComponent, HelpComponent, TermsOfServiceComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    SharedContentModule,
    HelpRoutingModule,
    HighlightModule,
  ],
})
export class HelpModule { }
