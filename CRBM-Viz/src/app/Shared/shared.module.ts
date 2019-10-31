import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './Pipes/filter.pipe';
import { SearchBarComponent } from './Components/search-bar/search-bar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { AccountMenuComponent } from './Components/account-menu/account-menu.component';
import { LogoComponent } from './Components/logo/logo.component';
import { NavigationComponent } from './Components/navigation/navigation.component';
import { NavIconsComponent } from './Components/nav-icons/nav-icons.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { MaterialModule } from '../Modules/app-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FilterPipe,
    SearchBarComponent,
    FooterComponent,
    AccountMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [
    FilterPipe,
    SearchBarComponent,
    FooterComponent,
    AccountMenuComponent,
    LogoComponent,
    NavigationComponent,
    NavIconsComponent,
    SidebarComponent,
  ],
})
export class SharedModule {}
