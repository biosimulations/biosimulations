import { Component, Inject, OnInit } from '@angular/core';

import { NavItem } from '../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../about.module.sass', './about.component.sass'],
})
export class AboutComponent implements OnInit {
  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    const crumbs: object[] = [{ label: 'About' }];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'question',
        label: 'Help',
        route: ['/about/help'],
        display: NavItemDisplayLevel.always,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }

  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  scrollToTop($element): void {
    $element.parentElement.parentElement.parentElement.parentElement.scrollTo(
      0,
      0,
    );
  }
}
