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
import { VegaVisualizationComponent } from './vega-visualization/vega-visualization.component';
import { VegaEmbedComponent } from './vega-embed/vega-embed.component';
import { ColumnsComponent } from './columns/columns.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialWrapperModule,
    RouterModule,
    BiosimulationsIconsModule,
    BreadCrumbsModule,
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
    VegaVisualizationComponent,
    VegaEmbedComponent,
    ColumnsComponent,
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
    VegaVisualizationComponent,
    VegaEmbedComponent,
    ColumnsComponent,
  ],
})
export class SharedUiModule {}
