import { Component, Inject, OnInit } from '@angular/core';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { AuthService } from 'src/app/Shared/Services/auth0.service';

@Component({
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.sass'],
})
export class StatusComponent implements OnInit {
  // TODO: only show simulations owned by user
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'Simulate', route: '/simulate'},
      {label: 'Status'},
    ];
    const buttons: object[] = [
      {iconType: 'mat', icon: 'view_list', label: 'Browse', route: ['/simulate']},
      {iconType: 'mat', icon: 'add', label: 'Submit', route: ['/simulate/new']},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
