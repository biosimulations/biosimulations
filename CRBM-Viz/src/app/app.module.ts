import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './Modules/app-material.module';
import { TopbarComponent } from './Layout/topbar/topbar.component';
import { SearchBarComponent } from './Layout/search-bar/search-bar.component';
import { SidebarComponent } from './Layout/sidebar/sidebar.component';
import { LogoComponent } from './Layout/logo/logo.component';
import { AboutComponent } from './Pages/about/about.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { HomeComponent } from './Pages/home/home.component';
import { VegaViewerComponent } from './Components/vega-viewer/vega-viewer.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { VisualizeService } from './Services/visualize.service';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SearchBarComponent,
    SidebarComponent,
    LogoComponent,
    AboutComponent,
    VisualizeComponent,
    SimulateComponent,
    HomeComponent,
    VegaViewerComponent,
    FourComponent,
    UnderConstructionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [VisualizeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
