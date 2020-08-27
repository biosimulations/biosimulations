import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { PlatformPrivacyPolicyComponent } from './platform-privacy-policy.component';
// import { SimulatorsPrivacyPolicyComponent } from './simulators-privacy-policy.component';
@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
  exports: [
    PlatformPrivacyPolicyComponent,
    // SimulatorsPrivacyPolicyComponent,
  ],
  declarations: [
    PlatformPrivacyPolicyComponent,
    // SimulatorsPrivacyPolicyComponent,
  ],
})
export class PoliciesModule { }
