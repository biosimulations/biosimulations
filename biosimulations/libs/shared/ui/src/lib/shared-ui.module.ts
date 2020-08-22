import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialWrapperModule } from './material-wrapper.module';
import { RouterModule } from '@angular/router';
import { BreadCrumbsModule } from './bread-crumbs/bread-crumbs.module';
import { TopbarComponent } from './topbar/topbar.component';
import { TopbarMenuComponent } from './topbar/topbar-menu.component';
import { TopbarMenuItemComponent } from './topbar/topbar-menu-item.component';
import { HoverOpenMenuComponent } from './hover-open-menu/hover-open-menu.component';
import { DropdownMenuItemComponent } from './dropdown-menu-item/dropdown-menu-item.component';
import { StepperButtonsComponent } from './next-previous-buttons/next-previous-buttons.component';
import { BiosimulationsNavigationComponent } from './biosimulations-navigation/biosimulations-navigation.component';
import { HyperLinkComponent } from './hyper-link/hyper-link.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LogoTextComponent } from './logo-text/logo-text.component';
import { LogoImageComponent } from './logo-image/logo-image.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons'
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { BiosimulationsNavigationItemComponent } from './biosimulations-navigation/biosimulations-navigation-item.component';
import { BiosimulationsNavigationSubitemComponent } from './biosimulations-navigation/biosimulations-navigation-subitem.component';
@NgModule({
  imports: [CommonModule, MaterialWrapperModule, RouterModule, BiosimulationsIconsModule, BreadCrumbsModule],
  exports: [MaterialWrapperModule, TopbarComponent, TopbarMenuComponent, TopbarMenuItemComponent,
    HoverOpenMenuComponent, DropdownMenuItemComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    HyperLinkComponent, SpinnerComponent, LogoTextComponent, LogoImageComponent, RouterLinkComponent, PrivacyNoticeComponent, BiosimulationsNavigationItemComponent, BiosimulationsNavigationSubitemComponent],
  declarations: [TopbarComponent, TopbarMenuComponent, TopbarMenuItemComponent,
    HoverOpenMenuComponent, DropdownMenuItemComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    HyperLinkComponent,
    SpinnerComponent, LogoTextComponent, LogoImageComponent, RouterLinkComponent, PrivacyNoticeComponent, BiosimulationsNavigationItemComponent, BiosimulationsNavigationSubitemComponent],
})
export class SharedUiModule { }
