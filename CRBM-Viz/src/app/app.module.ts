// ng Module
import { NgModule } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Defined Modules in Imports
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';
import {
  MatSelectModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule,
} from '@angular/material';

// Defined components
import { AppComponent } from './app.component';
import { SearchBarComponent } from './Layout/search-bar/search-bar.component';
import { LogoComponent } from './Layout/logo/logo.component';
import { AboutComponent } from './Pages/about/about.component';
import { VisualizeComponent } from './Pages/visualize/visualize.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { HomeComponent } from './Pages/home/home.component';
import { VegaViewerComponent } from './Components/vega-viewer/vega-viewer.component';
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
import { CallbackComponent } from './Components/callback/callback.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AlertComponent } from './Components/alert/alert.component';
import { PastSimulationComponent } from './Components/past-simulation/past-simulation.component';
import { NewSimulationComponent } from './Components/new-simulation/new-simulation.component';
import { UploadComponent } from './Pages/upload/upload.component';
import { FileTableComponent } from './Pages/files/file-table/file-table.component';
import { FileEditComponent } from './Pages/files/file-edit/file-edit.component';
import { AuthInterceptorService } from './Interceptors/auth-interceptor.service';
import { LoadingSpinnerComponent } from './Components/loading-spinner/loading-spinner.component';

// Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';

// Service for Authconfig

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
    NavigationComponent,
    LinksComponent,
    CallbackComponent,
    ProfileComponent,
    UploadComponent,
    FileEditComponent,
    AlertComponent,
    NewSimulationComponent,
    PastSimulationComponent,
    FileTableComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule, 
    MatDialogModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent],
})
export class AppModule {}
