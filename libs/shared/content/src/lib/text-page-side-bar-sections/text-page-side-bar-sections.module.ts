import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TextPageCitationSideBarSectionComponent } from './text-page-citation-side-bar-section.component';
import { TextPageFeedbackSideBarSectionComponent } from './text-page-feedback-side-bar-section.component';
import { TextPageHelpSideBarSectionComponent } from './text-page-help-side-bar-section.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    BiosimulationsIconsModule,
  ],
  exports: [
    TextPageCitationSideBarSectionComponent,
    TextPageFeedbackSideBarSectionComponent,
    TextPageHelpSideBarSectionComponent,
  ],
  declarations: [
    TextPageCitationSideBarSectionComponent,
    TextPageFeedbackSideBarSectionComponent,
    TextPageHelpSideBarSectionComponent,
  ],
})
export class TextPageSideBarSectionsModule {}
