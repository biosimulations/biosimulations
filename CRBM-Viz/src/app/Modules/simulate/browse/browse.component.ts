import { Component, Inject, OnInit } from '@angular/core';
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
    const buttons: object[] = [
      {iconType: 'mat', icon: 'add', label: 'Submit', route: ['/simulate/new']},
      {iconType: 'mat', icon: 'hourglass_empty', label: 'Status', route: ['/simulate/status']},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
