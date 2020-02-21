import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbsService {
  private dataSubject = new BehaviorSubject<object>({
    crumbs: [],
    buttons: [],
  });
  public data = this.dataSubject.asObservable();

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.clear();
    });
  }

  set(crumbs: object[], buttons: object[], classes: string[] = []): void {
    this.dataSubject.next({ crumbs, buttons, classes });
  }

  clear(): void {
    this.dataSubject.next({ crumbs: [], buttons: [], classes: [] });
  }
}
