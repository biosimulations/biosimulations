// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Third pary modules
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../Modules/app-material.module';
import { NgPipesModule } from 'ngx-pipes';

// FontAwesome for icons
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faFileAlt,
  faCircle,
  faCalendarAlt,
  faClock,
  faSquare,
  faPlusSquare,
  faMinusSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faProjectDiagram,
  faCog,
  faCogs,
  faChartArea,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUsers,
  faUserPlus,
  faHourglassHalf,
  faLink,
  faEnvelope,
  faDna,
  faTag,
  faTags,
  faInfo,
  faQuestion,
  faFlask,
  faHistory,
  faUnlockAlt,
  faTerminal,
  faList,
  faStopwatch,
  faSitemap,
  faKey,
  faClone,
  faCertificate,
  faCircle as FaSolidCircle,
  faAlignJustify,
  faPencilAlt,
  faCalculator,
  faStar,
  faDownload,
  faCodeBranch,
  faPlus,
  faTrashAlt,
  faBars,
  faQuestionCircle,
  faInfoCircle,
  faUserCircle,
  faPlusCircle,
  faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';
import {
  faDocker,
  faGithub,
  faGoogle,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons';

// Shared components
import { UserService } from './Services/user.service';
import { MetadataService } from './Services/metadata.service';
import { ModelService } from './Services/model.service';
import { SimulationService } from './Services/simulation.service';
import { VisualizationService } from './Services/visualization.service';

import { FilterPipe } from './Pipes/filter.pipe';
import { FormatTimeForHumansPipe } from './Pipes/format-time-for-humans.pipe';
import { ScientificNotationPipe } from './Pipes/scientific-notation.pipe';

import { SearchBarComponent } from './Components/search-bar/search-bar.component';
import { UserMenuComponent } from './Components/user-menu/user-menu.component';
import { LogoComponent } from './Components/logo/logo.component';
import { NavigationComponent } from './Components/navigation/navigation.component';
import { NavIconsComponent } from './Components/nav-icons/nav-icons.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { DataTableComponent } from './Components/data-table/data-table.component';
import { AlertComponent } from './Components/alert/alert.component';
import { CallbackComponent } from './Components/callback/callback.component';
import { HomeComponent } from './Components/home/home.component';
import { HomeImageComponent } from './Components/home/home-image.component';
import { FourComponent } from './Components/four/four.component';
import { UnderConstructionComponent } from './Components/under-construction/under-construction.component';
import { GridComponent } from './Components/grid/grid.component';
import { IdRendererGridComponent } from './Components/grid/id-renderer-grid.component';
import { RouteRendererGridComponent } from './Components/grid/route-renderer-grid.component';
import { SearchToolPanelGridComponent } from './Components/grid/search-tool-panel-grid.component';
import { ModelsGridComponent } from './Components/models-grid/models-grid.component';
import { SimulationsGridComponent } from './Components/simulations-grid/simulations-grid.component';
import { AuthorsComponent } from './Components/authors/authors.component';
import { TreeComponent } from './Components/tree/tree.component';
import { ModelCardsComponent } from './Components/model-cards/model-cards.component';
import { SimulationCardsComponent } from './Components/simulation-cards/simulation-cards.component';
import { VisualizationCardsComponent } from './Components/visualization-cards/visualization-cards.component';
import { HyperlinkComponent } from './Components/hyperlink/hyperlink.component';

@NgModule({
  declarations: [
    FilterPipe,
    FormatTimeForHumansPipe,
    ScientificNotationPipe,

    SearchBarComponent,
    UserMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
    DataTableComponent,
    AlertComponent,
    CallbackComponent,
    HomeComponent,
    HomeImageComponent,
    FourComponent,
    UnderConstructionComponent,
    GridComponent,
    IdRendererGridComponent,
    RouteRendererGridComponent,
    SearchToolPanelGridComponent,
    ModelsGridComponent,
    SimulationsGridComponent,
    AuthorsComponent,
    TreeComponent,
    ModelCardsComponent,
    SimulationCardsComponent,
    VisualizationCardsComponent,
    HyperlinkComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FontAwesomeModule,
    AgGridModule.withComponents([
      IdRendererGridComponent,
      RouteRendererGridComponent,
      SearchToolPanelGridComponent,
      ]),
    NgPipesModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  exports: [
    FilterPipe,
    FormatTimeForHumansPipe,
    ScientificNotationPipe,

    SearchBarComponent,
    UserMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
    FontAwesomeModule,
    DataTableComponent,
    AlertComponent,
    CallbackComponent,
    HomeComponent,
    HomeImageComponent,
    FourComponent,
    UnderConstructionComponent,
    GridComponent,
    ModelsGridComponent,
    SimulationsGridComponent,
    AuthorsComponent,
    TreeComponent,
    ModelCardsComponent,
    SimulationCardsComponent,
    VisualizationCardsComponent,
    HyperlinkComponent,
    NgPipesModule,
  ],
  providers: [
    UserService,
    MetadataService,
    ModelService,
    SimulationService,
    VisualizationService,
  ],
  entryComponents: [AlertComponent],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faFileAlt,
      faCircle,
      faCalendarAlt,
      faClock,
      faSquare,
      faPlusSquare,
      faMinusSquare,
      faSignInAlt,
      faSignOutAlt,
      faUser,
      faUsers,
      faUserPlus,
      faProjectDiagram,
      faCog,
      faCogs,
      faChartArea,
      faHourglassHalf,
      faLink,
      faEnvelope,
      faDna,
      faTag,
      faTags,
      faInfo,
      faQuestion,
      faFlask,
      faHistory,
      faUnlockAlt,
      faTerminal,
      faList,
      faStopwatch,
      faSitemap,
      faKey,
      faClone,
      faCertificate,
      FaSolidCircle,
      faAlignJustify,
      faPencilAlt,
      faCalculator,
      faStar,
      faDownload,
      faCodeBranch,
      faPlus,
      faTrashAlt,
      faBars,
      faQuestionCircle,
      faInfoCircle,
      faUserCircle,
      faPlusCircle,
      faGripLinesVertical,
      faDocker,
      faGithub,
      faGoogle,
      faOrcid,
    );
  }
}
