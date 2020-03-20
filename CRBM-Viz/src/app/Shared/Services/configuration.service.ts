import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NgxLoggerLevel } from 'ngx-logger';

export interface ConfigurationSerialized {
  production: boolean;
  showUnderConstructionPage: boolean;
  logLevel: number;
}
class Configuration implements ConfigurationSerialized {
  constructor(
    public production = false,
    public dev = false,
    public showUnderConstructionPage = true,
    public logLevel = NgxLoggerLevel.DEBUG
  ) {}
}
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configuration$: Observable<ConfigurationSerialized>;

  constructor() {}

  public loadConfigurations(): Observable<ConfigurationSerialized> {
    if (!this.configuration$) {
      this.configuration$ = this.getConfig$().pipe(shareReplay(1));
    }
    return this.configuration$;
  }

  get showUnderConstructionPage$(): Observable<boolean> {
    return this.loadConfigurations().pipe(pluck('showUnderConstructionPage'));
  }
  private getConfig$(): Observable<ConfigurationSerialized> {
    const config = new Configuration();
    if (environment.production) {
      config.showUnderConstructionPage = true;
      config.logLevel = NgxLoggerLevel.ERROR;
    }
    return of(config);
  }
}
