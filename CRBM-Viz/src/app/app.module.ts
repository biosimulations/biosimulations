//ng Module
import { NgModule } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Defined Modules in Imports
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';

const imports = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  MaterialModule,
];

//Defined components
import { AppComponent } from './app.component';
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
import { LoginComponent } from './Components/login/login.component';

const declarations = [
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
  LoginComponent,
];

//Services
import { VisualizationsService } from './Services/visualizations.service';
import { SimulationService } from './Services/simulation.service';
import { AuthService } from './Services/auth.service';
const providers = [VisualizationsService, SimulationService, AuthService];
@NgModule({
  declarations: declarations,
  imports: imports,
  providers: providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
