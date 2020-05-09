import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DebugComponent } from './debug/debug.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgreementComponent } from './components/agreement/agreement.component';
import { StepperButtonsComponent } from './components/next-previous-buttons/next-previous-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    AgreementComponent,
    StepperButtonsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    UiMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
