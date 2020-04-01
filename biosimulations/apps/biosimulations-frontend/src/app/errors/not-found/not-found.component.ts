import { Component, OnInit, Inject } from '@angular/core';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { NavItem } from 'src/app/Shared/Models/nav-item';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass'],
})
export class NotFoundComponent implements OnInit {
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    const crumbs: object[] = [{ label: 'Error' }, { label: 'Page not found' }];
    const buttons: NavItem[] = [];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
