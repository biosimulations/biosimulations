// ng Module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Third party tools
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// Defined Modules in Imports

// Defined Modules in app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';

// Defined components
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './Shared/Interceptors/auth-interceptor.service';

import { SharedModule } from './Shared/shared.module';
import { BreadCrumbsService } from './Shared/Services/bread-crumbs.service';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

// Pipes defined in app

// Services
// import { VisualizationService } from './Services/visualization.service';
// import { SimulationService } from './Services/simulation.service';

// Service for Authconfig

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxDnDModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,

    LoggerModule.forRoot({ level: environment.logging.level }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    BreadCrumbsService,
  ],
  bootstrap: [AppComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
  }
}
