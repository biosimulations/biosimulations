// ng Module
import { NgModule } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Defined Modules in Imports
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';

// Third party modules in Imports
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

// Defined components
import { AppComponent } from './app.component';
import { SearchBarComponent } from './Layout/search-bar/search-bar.component';
import { LogoComponent } from './Layout/logo/logo.component';
import { AboutComponent } from './Pages/about/about.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { HomeComponent } from './Pages/home/home.component';
import { VegaViewerComponent } from './Components/vega-viewer/vega-viewer.component';
import { LoginComponent } from './Components/login/login.component';
import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { NavigationComponent } from './Layout/navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LinksComponent } from './Layout/links/links.component';

// Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';
// import { CrbmAuthService } from './Services/crbm-auth.service';

// Service for Authconfig
const authProviderConfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    // The client ID was created from Akhil's Google account
    provider: new GoogleLoginProvider(
      '161690628487-3op0mi5vi1n1ajafqboo11boj6sm7rut.apps.googleusercontent.com'
    ),
  },
]);

export function provideConfig() {
  return authProviderConfig;
}

const providers = [
  {
    provide: AuthServiceConfig,
    useFactory: provideConfig,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    LogoComponent,
    AboutComponent,
    VisualizeComponent,
    SimulateComponent,
    HomeComponent,
    VegaViewerComponent,
    FourComponent,
    UnderConstructionComponent,
    LoginComponent,
    NavigationComponent,
    LinksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    SocialLoginModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
