import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialWrapperModule } from './material-wrapper.module';
// import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { PrivacyPolicyComponent } from './policies/privacy-policy.component';
@NgModule({
  imports: [CommonModule, SharedUiModule, BiosimulationsIconsModule],
  exports: [
    PrivacyPolicyComponent,
  ],
  declarations: [
    PrivacyPolicyComponent,
  ],
})
export class SharedContentModule { }
