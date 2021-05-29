import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { PlatformPrivacyPolicyComponent } from './platform-privacy-policy.component';
import { DispatchPrivacyPolicyComponent } from './dispatch-privacy-policy.component';
import { SimulatorsPrivacyPolicyComponent } from './simulators-privacy-policy.component';
import { PlatformTermsOfServiceComponent } from './platform-terms-of-service.component';
import { DispatchTermsOfServiceComponent } from './dispatch-terms-of-service.component';
import { SimulatorsTermsOfServiceComponent } from './simulators-terms-of-service.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
  exports: [
    PlatformPrivacyPolicyComponent,
    DispatchPrivacyPolicyComponent,
    SimulatorsPrivacyPolicyComponent,
    PlatformTermsOfServiceComponent,
    DispatchTermsOfServiceComponent,
    SimulatorsTermsOfServiceComponent,
  ],
  declarations: [
    PlatformPrivacyPolicyComponent,
    DispatchPrivacyPolicyComponent,
    SimulatorsPrivacyPolicyComponent,
    PlatformTermsOfServiceComponent,
    DispatchTermsOfServiceComponent,
    SimulatorsTermsOfServiceComponent,
  ],
})
export class PoliciesModule {}
