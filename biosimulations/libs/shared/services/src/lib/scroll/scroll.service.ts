import { Injectable } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class ScrollService {
  static scrollContainerId = 'mat-sidenav-content';
  private scrollContainer!: Element;

  constructor(private router: Router) {}

  init(): void {
    this.scrollContainer = document.getElementsByTagName(
      ScrollService.scrollContainerId,
    )[0];
    this.initRestoration();
  }

  initRestoration(): void {
    const scollPositionHistory: number[] = [0];
    let nextScrollPosition: number | undefined;

    this.router.events
      .pipe(
        filter((routerEvent: Event): boolean => {
          return (
            routerEvent instanceof NavigationStart ||
            routerEvent instanceof NavigationEnd
          );
        }),
      )
      .subscribe((routerEvent: Event): void => {
        if (routerEvent instanceof NavigationStart) {
          scollPositionHistory.push(this.getScrollTop());

          if (routerEvent.restoredState == null) {
            this.scrollTo({ top: 0, behavior: 'smooth' });
            nextScrollPosition = undefined;
          } else {
            nextScrollPosition =
              scollPositionHistory[routerEvent.restoredState.navigationId];
          }
        } else {
          this.scrollTo({ top: nextScrollPosition, behavior: 'smooth' });
        }
      });
  }

  getScrollTop(): number {
    return this.scrollContainer.scrollTop;
  }

  scrollTo(arg: any): void {
    this.scrollContainer.scrollTo(arg);
  }

  scrollToTop(offset = 0): void {
    this.scrollTo({ top: 64 + 1 + offset, behavior: 'smooth' });
  }

  scrollToElement(target: Element, offset = 0): void {
    const y = target.getBoundingClientRect().top + this.getScrollTop() - offset;
    this.scrollTo({ top: y, behavior: 'smooth' });
  }

  addScrollListener(listener: (event: any) => void): (event: any) => void {
    const wrappedListener = (event: any): void => {
      if (event.target === this.scrollContainer) {
        listener(event);
      }
    };

    window.addEventListener('scroll', wrappedListener, true);

    return wrappedListener;
  }

  removeScrollListener(wrappedListener: (event: any) => void): void {
    window.removeEventListener('scroll', wrappedListener, true);
  }
}
