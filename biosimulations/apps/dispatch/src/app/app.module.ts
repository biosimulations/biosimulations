import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Route, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import {
  ErrorHandler as BiosimulationsErrorHandler,
  errorRoutes,
  Error404Component
} from '@biosimulations/shared/ui';

import config from '../assets/config.json';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@biosimulations/shared/environments';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'run',
    loadChildren: () =>
      import('./components/run/run.module').then((m) => m.RunModule),
    data: {
      breadcrumb: 'Run'
    }
  },
  {
    path: 'simulations',
    loadChildren: () =>
      import('./components/simulations/simulations.module').then(
        (m) => m.SimulationsModule
      ),
    data: {
      breadcrumb: 'Your simulations'
    }
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./components/help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'Help'
    }
  },
  {
    path: 'error',
    children: errorRoutes
  },
  {
    path: '**',
    component: Error404Component
  }
];
routes.forEach((route: Route): void => {
  if (route.data) {
    route.data.config = config;
  } else {
    route.data = { config };
  }
});

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'disabled',
      relativeLinkResolution: 'legacy'
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'localstorage']
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    ScrollService,
    { provide: ErrorHandler, useClass: BiosimulationsErrorHandler }
  ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule { }
