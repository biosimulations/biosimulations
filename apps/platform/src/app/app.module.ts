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
import { SharedErrorComponentsModule, SharedErrorHandlerModule } from '@biosimulations/shared/error-handler';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { PwaModule } from '@biosimulations/shared/pwa';

import config from '../assets/config.json';
import { AngularAnalyticsModule } from '@biosimulations/angular-analytics';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'runs',
    loadChildren: () =>
      import('../../../../apps/platform/src/app/components/simulations/simulations.module').then(
        (m) => m.SimulationsModule,
      ),
    data: {
      breadcrumb: 'Your simulation runs',
    },
  },
  { path: 'simulations/:id', redirectTo: 'runs/:id', pathMatch: 'prefix' },
  {
    path: 'utils',
    loadChildren: () =>
      import('../../../../apps/platform/src/app/components/utils/utils.module').then((m) => m.UtilsModule),
    data: {
      breadcrumb: 'Utilities',
    },
  },
  {
    path: 'error',
    loadChildren: () => SharedErrorComponentsModule,
  },
  {
    path: 'projects',
    loadChildren: () => import('./components/projects/projects.module').then((m) => m.ProjectsModule),
    data: { breadcrumb: 'Simulation projects' },
  },
  {
    path: 'stats',
    loadChildren: () => import('@biosimulations/statistics/summary-page').then((m) => m.StatisticsSummaryPageModule),
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
    SharedErrorHandlerModule,
    BiosimulationsIconsModule,

    MarkdownModule.forRoot({ loader: HttpClient }),
    SharedUiModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'disabled',
    }),
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    PwaModule,
    ScullyLibModule,
    HighlightModule,
    AngularAnalyticsModule.forRoot(config.appName, config.analyticsId),
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    ScrollService,
    HealthService,
    {
      // Requires type declarations provided in the highlight.d.ts file in src
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
