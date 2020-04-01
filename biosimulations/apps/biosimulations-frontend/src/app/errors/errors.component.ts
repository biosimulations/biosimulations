import { Component, OnInit, Inject } from '@angular/core';
import { BreadCrumbsService } from '../Shared/Services/bread-crumbs.service';
import { NavItem } from '../Shared/Enums/nav-item';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.sass'],
})
export class ErrorsComponent implements OnInit {
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    const crumbs: object[] = [{ label: 'Error' }, { label: 'Unknown Error' }];
    const buttons: NavItem[] = [];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
