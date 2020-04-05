import { Component, Inject, OnInit } from '@angular/core';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { NavItem } from '../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    const crumbs: object[] = [{ label: 'Chart types' }];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/chart-types', 'new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your chart types',
        route: ['/user', 'chart-types'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
