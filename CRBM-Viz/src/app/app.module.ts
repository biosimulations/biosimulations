// ng Module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Angular core components/modules/tools in imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
// Defined Modules in Imports

// Defined Modules in app
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './Modules/app-material.module';

// Defined components
import { AppComponent } from './app.component';

import { AboutComponent } from './Pages/about/about.component';
import { SimulateComponent } from './Pages/simulate/simulate.component';
import { HomeComponent } from './Pages/home/home.component';

import { FourComponent } from './Pages/four/four.component';
import { UnderConstructionComponent } from './Pages/under-construction/under-construction.component';
import { CallbackComponent } from './Components/callback/callback.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AlertComponent } from './Components/alert/alert.component';
import { PastSimulationComponent } from './Components/past-simulation/past-simulation.component';
import { NewSimulationComponent } from './Components/new-simulation/new-simulation.component';
import { UploadComponent } from './Pages/upload/upload.component';
import { FileTableComponent } from './Pages/files/file-table/file-table.component';
import { FileEditComponent } from './Pages/files/file-edit/file-edit.component';
import { AuthInterceptorService } from './Shared/Interceptors/auth-interceptor.service';
import { DataTableComponent } from './Components/data-table/data-table.component';
import { DataComponent } from './Pages/data/data.component';
import { SharedModule } from './Shared/shared.module';
import { FileChooserComponent } from './Pages/simulate/new-simulation/file-chooser/file-chooser.component';
import { SimulationTaskComponent } from './Pages/simulate/new-simulation/simulation-task/simulation-task.component';

// Pipes defined in app

// Services
// import { VisualizationsService } from './Services/visualizations.service';
// import { SimulationService } from './Services/simulation.service';

// Service for Authconfig

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SimulateComponent,
    HomeComponent,
    FourComponent,
    UnderConstructionComponent,
    CallbackComponent,
    ProfileComponent,
    UploadComponent,
    FileEditComponent,
    AlertComponent,
    NewSimulationComponent,
    PastSimulationComponent,
    FileTableComponent,
    FileChooserComponent,
    AlertComponent,
    DataTableComponent,
    DataComponent,
    SimulationTaskComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
