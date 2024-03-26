import { Injectable, NgModule } from '@angular/core';
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
import { BiosimulationsNavigationItemComponent } from './biosimulations-navigation/biosimulations-navigation-item.component';
import { BiosimulationsNavigationSubitemComponent } from './biosimulations-navigation/biosimulations-navigation-subitem.component';
import { HyperLinkComponent } from './hyper-link/hyper-link.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FullPageSpinnerComponent } from './spinner/full-page-spinner.component';
import { LogoTextComponent } from './logo-text/logo-text.component';
import { LogoImageComponent } from './logo-image/logo-image.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NoticeComponent } from './notice/notice.component';
import { TableComponent } from './table/table.component';
import { TableTabularDataComponent } from './table/table-tabular-data.component';
import { TableControlsComponent } from './table/table-controls.component';
import { StackedTableComponent } from './table/stacked-table.component';
import { ResponsiveTableComponent } from './table/responsive-table.component';
import { PageComponent } from './page/page.component';
import { TabPageComponent } from './tab-page/tab-page.component';
import { TabPageTabComponent } from './tab-page/tab-page-tab.component';
import { TextPageComponent } from './text-page/text-page.component';
import { TextPageSectionComponent } from './text-page/text-page-section.component';
import { TextPageSideBarSectionComponent } from './text-page/text-page-side-bar-section.component';
import { TextPageContentSectionComponent } from './text-page/text-page-content-section.component';
import { TextPageTocItemComponent } from './text-page/text-page-toc-item.component';
import { QAComponent } from './q-a/q-a.component';
import { HomeSectionComponent } from './home/home-section.component';
import { HomeSubsectionComponent } from './home/home-subsection.component';
import { HomeTeaserComponent } from './home/home-teaser.component';
import { HomeTeaserButtonComponent } from './home/home-teaser-button.component';
import { HomeLogoComponent } from './home/home-logo.component';
import { TocSectionDirective } from './toc/toc-section.directive';
import { TocSectionsContainerDirective } from './toc/toc-sections-container.directive';
import { ColumnsComponent } from './columns/columns.component';
import { CarouselComponent } from './carousel/carousel.component';
import { HtmlSnackBarComponent } from './html-snack-bar/html-snack-bar.component';
import { SliderComponent } from './slider/slider.component';
import { MatCarouselComponent } from './mat-carousel/carousel.component';
import { MatCarouselSlideComponent } from './mat-carousel/carousel-slide/carousel-slide.component';
import { BlankTargetDirective } from './blank-target-link/blank-target-link.directive';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { HeroBannerUtilButtonComponent } from './hero-banner-util-button/hero-banner-util-button.component';
import { MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { RunCustomSimulationComponent } from './run-custom-simulation/run-custom-simulation.component';

const TOOLTIP_DELAY = 500;

@Injectable()
export class MatCarouselHammerConfig extends HammerGestureConfig {
  public overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
  };
}
@NgModule({
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: MatCarouselHammerConfig },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { showDelay: TOOLTIP_DELAY } },
  ],
  imports: [
    CommonModule,
    MaterialWrapperModule,
    RouterModule,
    BiosimulationsIconsModule,
    BreadCrumbsModule,
    HammerModule,
    MatTooltipModule,
  ],
  exports: [
    MaterialWrapperModule,
    TopbarComponent,
    TopbarMenuComponent,
    TopbarMenuItemComponent,
    HoverOpenMenuComponent,
    DropdownMenuItemComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    BiosimulationsNavigationItemComponent,
    BiosimulationsNavigationSubitemComponent,
    HyperLinkComponent,
    SpinnerComponent,
    FullPageSpinnerComponent,
    LogoTextComponent,
    LogoImageComponent,
    RouterLinkComponent,
    NoticeComponent,
    TableComponent,
    TableTabularDataComponent,
    TableControlsComponent,
    StackedTableComponent,
    ResponsiveTableComponent,
    PageComponent,
    TabPageComponent,
    TabPageTabComponent,
    TextPageComponent,
    TextPageSectionComponent,
    TextPageSideBarSectionComponent,
    TextPageContentSectionComponent,
    TextPageTocItemComponent,
    QAComponent,
    HomeSectionComponent,
    HomeSubsectionComponent,
    HomeTeaserComponent,
    HomeTeaserButtonComponent,
    HomeLogoComponent,
    TocSectionDirective,
    TocSectionsContainerDirective,
    ColumnsComponent,
    CarouselComponent,
    BreadCrumbsModule,
    BlankTargetDirective,
    HeroBannerUtilButtonComponent,
    AppFooterComponent,
    RunCustomSimulationComponent,
  ],
  declarations: [
    TopbarComponent,
    TopbarMenuComponent,
    TopbarMenuItemComponent,
    HoverOpenMenuComponent,
    DropdownMenuItemComponent,
    StepperButtonsComponent,
    BiosimulationsNavigationComponent,
    BiosimulationsNavigationItemComponent,
    BiosimulationsNavigationSubitemComponent,
    HyperLinkComponent,
    SpinnerComponent,
    FullPageSpinnerComponent,
    LogoTextComponent,
    LogoImageComponent,
    RouterLinkComponent,
    NoticeComponent,
    TableComponent,
    TableTabularDataComponent,
    TableControlsComponent,
    StackedTableComponent,
    ResponsiveTableComponent,
    PageComponent,
    TabPageComponent,
    TabPageTabComponent,
    TextPageComponent,
    TextPageSectionComponent,
    TextPageSideBarSectionComponent,
    TextPageContentSectionComponent,
    TextPageTocItemComponent,
    QAComponent,
    HomeSectionComponent,
    HomeSubsectionComponent,
    HomeTeaserComponent,
    HomeTeaserButtonComponent,
    HomeLogoComponent,
    TocSectionDirective,
    TocSectionsContainerDirective,
    ColumnsComponent,
    CarouselComponent,
    HtmlSnackBarComponent,
    SliderComponent,
    MatCarouselComponent,
    MatCarouselSlideComponent,
    BlankTargetDirective,
    HeroBannerUtilButtonComponent,
    AppFooterComponent,
    RunCustomSimulationComponent,
  ],
})
export class SharedUiModule {}
