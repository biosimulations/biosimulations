import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Route, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@biosimulations/shared/environments';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MarkdownModule } from 'ngx-markdown';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import {
  SharedErrorComponentsModule,
  //SharedErrorHandlerModule,
} from '@biosimulations/shared/error-handler';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ConfigService, ScrollService } from '@biosimulations/shared/services';

import config from '../assets/config.json';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'error',
    loadChildren: () => SharedErrorComponentsModule,
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
    data: { breadcrumb: 'Projects' },
  },
  {
    path: '**',
    loadChildren: () => SharedErrorComponentsModule,
  },
];
routes.forEach((route: Route): void => {
  if (route.data) {
    route.data.config = config;
  } else {
    route.data = { config };
  }
});
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //SharedErrorHandlerModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    SharedUiModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'disabled',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    ScrollService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
