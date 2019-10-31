import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MaterialModule } from '../Modules/app-material.module';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { LogoComponent } from './logo/logo.component';
import { NavIconsComponent } from './nav-icons/nav-icons.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SharedModule } from '../Shared/shared.module';

@NgModule({
  declarations: [
    SearchBarComponent,
    FooterComponent,
    AccountMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule, SharedModule],
  exports: [
    SearchBarComponent,
    FooterComponent,
    AccountMenuComponent,
    LogoComponent,
    NavIconsComponent,
    SidebarComponent,
    NavigationComponent,
  ],
})
export class LayoutModule {}
