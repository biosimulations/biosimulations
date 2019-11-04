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

import { HomeComponent } from './Shared/Components/home/home.component';

import { FourComponent } from './Shared/Components/four/four.component';
import { UnderConstructionComponent } from './Shared/Components/under-construction/under-construction.component';
import { CallbackComponent } from './Shared/Components/callback/callback.component';

import { UploadComponent } from './Modules/models/upload/upload.component';
import { FileTableComponent } from './Modules/models/file-table/file-table.component';
import { FileEditComponent } from './Modules/models/file-edit/file-edit.component';
import { AuthInterceptorService } from './Shared/Interceptors/auth-interceptor.service';

import { SharedModule } from './Shared/shared.module';
import { AboutModule } from './Modules/about/about.module';
import { AccountModule } from './Modules/account/account.module';
import { DataComponent } from './Modules/simulate/data/data.component';
import { ModelsModule } from './Modules/models/models.module';

// Pipes defined in app

// Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';

// Service for Authconfig

@NgModule({
  declarations: [AppComponent],
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
    ModelsModule,
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
