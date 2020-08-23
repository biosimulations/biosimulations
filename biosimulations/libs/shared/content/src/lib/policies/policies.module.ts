import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { PrivacyPolicyComponent } from './privacy-policy.component';
@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
  exports: [
    PrivacyPolicyComponent,
  ],
  declarations: [
    PrivacyPolicyComponent,
  ],
})
export class PoliciesModule { }
