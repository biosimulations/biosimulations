// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Third pary modules
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../Modules/app-material.module';

// FontAwesome for icons
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faProjectDiagram,
  faCogs,
  faChartArea,
  faSignInAlt,
  faSignOutAlt,
  faUserPlus,
  faHourglassHalf,
  faLink,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faGoogle,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons';

// Shared components
import { FilterPipe } from './Pipes/filter.pipe';
import { SearchBarComponent } from './Components/search-bar/search-bar.component';
import { AccountMenuComponent } from './Components/account-menu/account-menu.component';
import { LogoComponent } from './Components/logo/logo.component';
import { NavigationComponent } from './Components/navigation/navigation.component';
import { NavIconsComponent } from './Components/nav-icons/nav-icons.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { DataTableComponent } from './Components/data-table/data-table.component';
import { AlertComponent } from './Components/alert/alert.component';
import { CallbackComponent } from './Components/callback/callback.component';
import { HomeComponent } from './Components/home/home.component';
import { FourComponent } from './Components/four/four.component';
import { UnderConstructionComponent } from './Components/under-construction/under-construction.component';
import { GridComponent } from './Components/grid/grid.component';
import { IdRendererGridComponent } from './Components/grid/id-renderer-grid.component';
import { SearchToolPanelGridComponent } from './Components/grid/search-tool-panel-grid.component';
import { SimulationsGridComponent } from './Components/simulations-grid/simulations-grid.component';

@NgModule({
  declarations: [
    FilterPipe,
    SearchBarComponent,
    AccountMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
    DataTableComponent,
    AlertComponent,
    CallbackComponent,
    HomeComponent,
    FourComponent,
    UnderConstructionComponent,
    GridComponent,
    IdRendererGridComponent,
    SearchToolPanelGridComponent,
    SimulationsGridComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FontAwesomeModule,
    AgGridModule.withComponents([IdRendererGridComponent, SearchToolPanelGridComponent]),
    FormsModule,
  ],
  exports: [
    FilterPipe,
    SearchBarComponent,
    AccountMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
    FontAwesomeModule,
    DataTableComponent,
    AlertComponent,
    CallbackComponent,
    HomeComponent,
    FourComponent,
    UnderConstructionComponent,
    GridComponent,
    SimulationsGridComponent,
  ],
  entryComponents: [AlertComponent],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faSignInAlt,
      faSignOutAlt,
      faUserPlus,
      faProjectDiagram,
      faCogs,
      faChartArea,
      faHourglassHalf,
      faLink,
      faEnvelope,
      faGithub,
      faGoogle,
      faOrcid
    );
  }
}
