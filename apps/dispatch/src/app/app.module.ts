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
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { PwaModule } from '@biosimulations/shared/pwa';
import { SharedErrorComponentsModule, SharedErrorHandlerModule } from '@biosimulations/shared/error-handler';
import config from '../assets/config.json';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@biosimulations/shared/environments';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { AngularAnalyticsModule } from '@biosimulations/angular-analytics';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'runs',
    loadChildren: () => import('./components/simulations/simulations.module').then((m) => m.SimulationsModule),
    data: {
      breadcrumb: 'Your simulation runs',
    },
  },
  { path: 'simulations/:id', redirectTo: 'runs/:id', pathMatch: 'prefix' },
  {
    path: 'utils',
    loadChildren: () => import('./components/utils/utils.module').then((m) => m.UtilsModule),
    data: {
      breadcrumb: 'Utilities',
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
  declarations: [AppComponent, HomeComponent],
  imports: [
    MatCardModule,
    BrowserModule,
    SharedUiModule,
    SharedErrorHandlerModule,
    BiosimulationsIconsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PwaModule,
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
      /* Requires type declarations provided in the highlight.d.ts file in src */
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
