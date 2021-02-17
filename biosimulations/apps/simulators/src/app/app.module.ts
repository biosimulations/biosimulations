import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Route, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from '@biosimulations/shared/environments';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  MARKED_PRELOADING_STRATEGY,
  RoutesModule,
} from '@biosimulations/shared/utils/routes';

import config from '../assets/config.json';
import {
  SharedErrorComponentsModule,
  SharedErrorHandlerModule,
} from '@biosimulations/shared/error-handler';

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
      breadcrumb: 'Simulators',
      preload: {
        preload: true,
        delay: 500,
      },
    },
  },
  {
    path: 'standards',
    loadChildren: () =>
      import('./standards/standards.module').then((m) => m.StandardsModule),
    data: {
      breadcrumb: 'Standards',
      preload: {
        preload: true,
        delay: 1000,
      },
    },
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'Help',
      preload: {
        preload: true,
        delay: 1000,
      },
    },
  },
  {
    path: 'error',
    loadChildren: () => SharedErrorComponentsModule,
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
    SharedUiModule,
    RoutesModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'disabled',
      preloadingStrategy: MARKED_PRELOADING_STRATEGY,
      relativeLinkResolution: 'legacy',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'localstorage'],
    }),
    HighlightModule,
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ConfigService, useValue: config },
    ScrollService,

    {
      // Requires type declarations provided in the highlight.d.ts file in src
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
          json: () => import('highlight.js/lib/languages/json'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
