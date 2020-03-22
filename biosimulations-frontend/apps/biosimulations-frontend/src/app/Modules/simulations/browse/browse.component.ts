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
      {label: 'Simulations'},
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/simulations', 'new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your simulations',
        route: ['/user', 'simulations'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
