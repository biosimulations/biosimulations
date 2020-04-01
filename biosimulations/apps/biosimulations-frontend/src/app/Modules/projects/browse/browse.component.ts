import { Component, Inject, OnInit } from '@angular/core';
import { NavItemDisplayLevel } from '../../../Shared/Enums/nav-item-display-level';
import { NavItem } from '../../../Shared/Enums/nav-item';
import { BreadCrumbsService } from '../../../Shared/Services/bread-crumbs.service';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.sass'],
})
export class BrowseComponent implements OnInit {
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    const crumbs: object[] = [{ label: 'Projects' }];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/projects', 'new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your projects',
        route: ['/user', 'projects'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
