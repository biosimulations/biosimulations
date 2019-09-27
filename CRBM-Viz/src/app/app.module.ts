//ng Module
import { NgModule } from '@angular/core';
import {CrbmConfig} from './crbm-config';


// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Defined Modules in Imports
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';
import { MatSelectModule, MatDialogModule } from '@angular/material';


import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from 'angularx-social-login';

const imports = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  MaterialModule,
  SocialLoginModule,
  FormsModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatDialogModule
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
import { LoginComponent } from './Components/login/login.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { UploadComponent } from './Pages/upload/upload.component';
import { AlertComponent } from './Components/alert/alert.component';


const declarations = [
  AppComponent,
  TopbarComponent,
  SearchBarComponent,
  SidebarComponent,
  LogoComponent,
  AboutComponent,
  // VisualizeComponent,
  SimulateComponent,
  HomeComponent,
  VegaViewerComponent,
  FourComponent,
  UnderConstructionComponent,
  LoginComponent,
  UploadComponent,
  AlertComponent
];

//Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';
// import { CrbmAuthService } from './Services/crbm-auth.service';

// Service for Authconfig
const authProviderConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    // The client ID was created from Akhil's Google account
    provider: new GoogleLoginProvider(CrbmConfig.GOOGLE_AUTH_CLIENT_ID)
  }
]);

export function provideConfig() {
  return authProviderConfig;
}

const providers = [
  {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }
];


@NgModule({
  declarations: declarations,
  imports: imports,
  providers: providers,
  bootstrap: [AppComponent],
  entryComponents:[
    AlertComponent
  ]
})
export class AppModule {}
