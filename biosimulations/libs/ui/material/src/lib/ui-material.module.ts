import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { StepperButtonsComponent } from './next-previous-buttons/next-previous-buttons.component';
import { BiosimulationsNavigationComponent } from './biosimulations-navigation/biosimulations-navigation.component';
import { MaterialWrapperModule } from './material-wrapper.module';

import { SpinnerComponent } from './spinner/spinner.component';
import { HyperLinkComponent } from './hyper-link/hyper-link.component';
import { BreadCrumbsComponent } from './bread-crumbs/bread-crumbs.component';
import { LogoTextComponent } from './logo-text/logo-text.component';
import { LogoImageComponent } from './logo-image/logo-image.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { RouterModule } from '@angular/router';



import { BiosimulationsIconsModule } from '@biosimulations/ui/icons'
import { RouterLinkComponent } from './router-link/router-link.component';
import { BreadCrumbsModule } from './bread-crumbs/bread-crumbs.module';


@NgModule({
  imports: [CommonModule, MaterialWrapperModule, RouterModule, BiosimulationsIconsModule, BreadCrumbsModule],
  exports: [
  MaterialWrapperModule,
    TopbarComponent,
    TopMenuComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    HyperLinkComponent, SpinnerComponent, LogoTextComponent, LogoImageComponent, PrivacyNoticeComponent, RouterLinkComponent],
  declarations: [
    TopbarComponent,
    TopMenuComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    HyperLinkComponent,
    SpinnerComponent, LogoTextComponent, LogoImageComponent, PrivacyNoticeComponent, RouterLinkComponent],
})
export class UiMaterialModule { }
