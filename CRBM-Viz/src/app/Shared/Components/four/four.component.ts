import { Component, OnInit, Inject } from '@angular/core';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';


@Component({
  selector: 'app-four',
  templateUrl: './four.component.html',
  styleUrls: ['./four.component.sass'],
})
export class FourComponent implements OnInit {
 
  constructor(@Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'Error'},
      {label: 'Page not found'},
    ];
    const buttons: NavItem[] = [
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
