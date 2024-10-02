import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@biosimulations/shared/environments';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

if (window.location.hostname === 'run.biosimulations.org') {
  window.location.href = 'https://biosimulations.org';
}

if (window.location.hostname === 'run.biosimulations.dev') {
  window.location.href = 'https://biosimulations.dev';
}
