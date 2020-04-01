import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NavItem } from '../Enums/nav-item';
import { NavItemDisplayLevel } from '../Enums/nav-item-display-level';
import { AccessLevel, accessLevels } from '@biosimulations/datamodel/core';
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
  setEditModel(model?, delFunct?: (model) => void) {
    const crumbs: object[] = [{ label: 'Models', route: ['/models'] }];

    if (model.id) {
      crumbs.push({
        label: 'Model ' + model.id,
        route: ['/models', model.id],
      });
      crumbs.push({
        label: 'Edit',
      });
    } else {
      crumbs.push({
        label: 'New',
      });
    }
    const buttons: NavItem[] = [
      {
        iconType: 'mat',
        icon: 'timeline',
        label: 'Simulate',
        route: ['/simulations', 'new', model?.id],
        display: model?.id
          ? NavItemDisplayLevel.always
          : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'bars',
        label: 'View',
        route: ['/models', model?.id],
        display: model?.id
          ? NavItemDisplayLevel.always
          : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'trash-alt',
        label: 'Delete',
        click: () => {
          delFunct(model);
        },
        display:
          model?.access === AccessLevel.public || delFunct == null
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: model?.owner,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/models', 'new'],
        display: model?.id
          ? NavItemDisplayLevel.always
          : NavItemDisplayLevel.never,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your models',
        route: ['/user', 'models'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/models'],
        display: NavItemDisplayLevel.always,
      },
    ];

    this.set(crumbs, buttons);
  }

  clear(): void {
    this.dataSubject.next({ crumbs: [], buttons: [], classes: [] });
  }
}
