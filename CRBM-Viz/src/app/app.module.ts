// ng Module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Defined Modules in Imports

// Defined Modules in app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';

// Defined components
import { AppComponent } from './app.component';

import { SimulateComponent } from './Pages/simulate/simulate.component';
import { HomeComponent } from './Pages/home/home.component';

import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { CallbackComponent } from './Components/callback/callback.component';

import { PastSimulationComponent } from './Components/past-simulation/past-simulation.component';
import { NewSimulationComponent } from './Components/new-simulation/new-simulation.component';
import { UploadComponent } from './Pages/upload/upload.component';
import { FileTableComponent } from './Pages/files/file-table/file-table.component';
import { FileEditComponent } from './Pages/files/file-edit/file-edit.component';
import { AuthInterceptorService } from './Shared/Interceptors/auth-interceptor.service';
import { DataComponent } from './Pages/data/data.component';
import { SharedModule } from './Shared/shared.module';
import { AboutModule } from './Modules/about/about.module';
import { AccountModule } from './Modules/account/account.module';

// Pipes defined in app

// Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';

// Service for Authconfig

@NgModule({
  declarations: [
    AppComponent,

    SimulateComponent,
    HomeComponent,
    FourComponent,
    UnderConstructionComponent,

    CallbackComponent,

    UploadComponent,
    FileEditComponent,

    NewSimulationComponent,
    PastSimulationComponent,
    FileTableComponent,

    DataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    AboutModule,
    AccountModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
  }
}
