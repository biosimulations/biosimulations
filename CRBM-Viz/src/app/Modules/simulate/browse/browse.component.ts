import { Component, Inject, OnInit } from '@angular/core';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  constructor(@Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'Simulate'},
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'mat',
        icon: 'add',
        label: 'New',
        route: ['/simulate/new'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'mat',
        icon: 'hourglass_empty',
        label: 'My simulations',
        route: ['/simulate/mine'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
