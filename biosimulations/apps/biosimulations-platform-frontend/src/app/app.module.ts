import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { ModelService } from './models/services/model.service';
import { ModelHttpService } from './models/services/model-http.service';
import { ModelDataService } from './models/services/model-data.service';
import { HttpClientModule } from '@angular/common/http';
import { BiosimulationsAppModule } from '@biosimulations/shared/biosimulations-ng-utils';
import { SharedModule } from './shared/shared.module';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'models',
    loadChildren: () =>
      import('./models/models.module').then((m) => m.ModelsModule),
  },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BiosimulationsAppModule,
    UiMaterialModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    SharedModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
