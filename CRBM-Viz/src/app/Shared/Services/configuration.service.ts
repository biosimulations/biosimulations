import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
export interface ConfigurationSerialized {
  production: boolean;
  showUnderConstructionPage: boolean;
}
class Configuration implements ConfigurationSerialized {
  constructor(
    public production = false,
    public showUnderConstructionPage = true
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
    return of(new Configuration());
  }
}
