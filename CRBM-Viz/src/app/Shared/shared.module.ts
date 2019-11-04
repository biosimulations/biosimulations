// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Shared components
import { FilterPipe } from './Pipes/filter.pipe';
import { SearchBarComponent } from './Components/search-bar/search-bar.component';
import { AccountMenuComponent } from './Components/account-menu/account-menu.component';
import { LogoComponent } from './Components/logo/logo.component';
import { NavigationComponent } from './Components/navigation/navigation.component';
import { NavIconsComponent } from './Components/nav-icons/nav-icons.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { DataTableComponent } from './Components/data-table/data-table.component';
import { MaterialModule } from '../Modules/app-material.module';
import { AgGridModule } from 'ag-grid-angular';
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
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faGoogle,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons';
import { AlertComponent } from './Components/alert/alert.component';
import { CallbackComponent } from './Components/callback/callback.component';

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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FontAwesomeModule,
    AgGridModule.withComponents([]),
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
  ],
  entryComponents: [AlertComponent],
})
export class SharedModule {
  static FormsModule: any[] | Type<any> | ModuleWithProviders<{}>;
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
      faGithub,
      faGoogle,
      faOrcid
    );
  }
}
