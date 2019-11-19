import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbsService {
  private dataSubject = new BehaviorSubject<object>({crumbs: [], buttons: []});
  public data = this.dataSubject.asObservable();

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.clear();
    });
  }

  set(crumbs: object[], buttons: object[], classes?: string[]): void {
    if (!classes) {
      classes = [];
    }

    this.dataSubject.next({crumbs, buttons, classes});
  }

  clear(): void {
    this.dataSubject.next({crumbs: [], buttons: [], classes: []});
  }
}
