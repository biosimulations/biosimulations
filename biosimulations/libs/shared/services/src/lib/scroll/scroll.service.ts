import { Injectable } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class ScrollService {
  static scrollContainerId = 'mat-sidenav-content';
  scrollContainer!: Element;

  constructor(private router: Router) {}

  init(): void {
    this.scrollContainer = document.getElementsByTagName(ScrollService.scrollContainerId)[0];
    this.initRestoration();
  }

  initRestoration(): void {
    const scollPositionHistory: number[] = [0];
    let nextScrollPosition: number | undefined;

    this.router.events
      .pipe(
        filter((routerEvent: Event): boolean => {
          return routerEvent instanceof NavigationStart || routerEvent instanceof NavigationEnd;
       }))
      .subscribe((routerEvent: Event): void => {
        if (routerEvent instanceof NavigationStart) {
          scollPositionHistory.push(this.scrollContainer.scrollTop);

          if (routerEvent.restoredState == null) {
            this.scrollContainer.scrollTo({top: 0, behavior: 'smooth'});
            nextScrollPosition = undefined;
          } else {
            nextScrollPosition = scollPositionHistory[routerEvent.restoredState.navigationId];
          }

        } else {
          this.scrollContainer.scrollTo({top: nextScrollPosition, behavior: 'smooth'});
        }
      });
  }
}
