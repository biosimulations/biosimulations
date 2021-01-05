import { Injectable } from '@angular/core';

import { PreloadingStrategy, Route } from '@angular/router';

import { of, Observable, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarkedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => any): Observable<any> {
    const loadRoute = (delay: number) =>
      delay ? timer(delay).pipe(flatMap((_) => load())) : load();
    return route?.data?.preload?.preload
      ? loadRoute(route.data.preload?.delay)
      : of(null);
  }
}
