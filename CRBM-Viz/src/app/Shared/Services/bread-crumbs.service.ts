import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbsService {
  private _data = new BehaviorSubject<Object>({crumbs: [], buttons: []});
  public data = this._data.asObservable();

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.clear();
    });
  }

  set(crumbs: Object[], buttons: Object[], classes?: string[]): void {
    if (!classes) {
      classes = [];
    }

    this._data.next({
      crumbs: crumbs,
      buttons: buttons,
      classes: classes,
    });
  }

  clear(): void {
    this._data.next({crumbs: [], buttons: [], classes: []});
  }
}
