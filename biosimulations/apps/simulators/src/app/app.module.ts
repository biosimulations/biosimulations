import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@biosimulations/shared/environments';
import { SharedUiModule } from '@biosimulations/shared/ui';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),

  },
  {
    path: 'simulators',
    loadChildren: () =>
      import('./simulators/simulators.module').then((m) => m.SimulatorsModule),
    data: {
      breadcrumb: 'Simulators'
    }
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'Help'
    }
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedUiModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }
