import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { environment } from '@biosimulations/shared/environments';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgreementComponent } from './components/agreement/agreement.component';

import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: 'register',
          loadChildren: () =>
            import('./registration/registration.module').then(
              m => m.RegistrationModule,
            ),
        },
        { path: '', redirectTo: 'register', pathMatch: 'full' },
      ],
      { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' },
    ),
    SharedUiModule,

    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
  providers: [
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
