import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './Modules/app-material.module';
import { TopbarComponent } from './Layouts/topbar/topbar.component';
import { SearchBarComponent } from './Layouts/search-bar/search-bar.component';
import { SidebarComponent } from './Layouts/sidebar/sidebar.component';
import { LogoComponent } from './Layouts/logo/logo.component';
import { MainMenuComponent } from './Layouts/main-menu/main-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SearchBarComponent,
    SidebarComponent,
    LogoComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
