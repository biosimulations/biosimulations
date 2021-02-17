import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { PwaModule } from '@biosimulations/shared/pwa';
import { SharedErrorHandlerModule } from '@biosimulations/shared/error-handler';
import config from '../assets/config.json';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@biosimulations/shared/environments';
import { ScullyLibModule } from '@scullyio/ng-lib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'run',
    loadChildren: () =>
      import('apps/dispatch/src/app/components/run/run.module').then(
        (m) => m.RunModule,
      ),
    data: {
      breadcrumb: 'Run',
    },
    pathMatch: 'full',
  },
  {
    path: 'simulations',
    loadChildren: () =>
      import(
        'apps/dispatch/src/app/components/simulations/simulations.module'
      ).then((m) => m.SimulationsModule),
    data: {
      breadcrumb: 'Your simulations',
    },
  },
  {
    path: 'help',
    loadChildren: () =>
      import('apps/dispatch/src/app/components/help/help.module').then(
        (m) => m.HelpModule,
      ),
    data: {
      breadcrumb: 'Help',
    },
  },
  {
    path: 'error',
    loadChildren: () =>
      import(
        'libs/shared/error-handler/src/lib/shared-error-components.module'
      ).then((m) => m.SharedErrorComponentsModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import(
        'libs/shared/error-handler/src/lib/shared-error-components.module'
      ).then((m) => m.SharedErrorComponentsModule),
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
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    SharedUiModule,
    SharedErrorHandlerModule,
    BiosimulationsIconsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PwaModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'disabled',
      relativeLinkResolution: 'legacy',
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'localstorage'],
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    ScullyLibModule,
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    ScrollService,
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
