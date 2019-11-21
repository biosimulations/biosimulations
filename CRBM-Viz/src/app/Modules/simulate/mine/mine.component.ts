import { Component, Inject, OnInit } from '@angular/core';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { AuthService } from 'src/app/Shared/Services/auth0.service';

@Component({
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.sass'],
})
export class MineComponent implements OnInit {
  // TODO: only show simulations owned by user
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'Simulate', route: '/simulate'},
      {label: 'My simulations'},
    ];
    const buttons: NavItem[] = [
      {iconType: 'mat', icon: 'view_list', label: 'Browse', route: ['/simulate'], display: NavItemDisplayLevel.always},
      {iconType: 'mat', icon: 'add', label: 'New', route: ['/simulate/new'], display: NavItemDisplayLevel.loggedIn},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
