import { Component, Inject, OnInit } from '@angular/core';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../about.module.sass', './about.component.sass'],
})
export class AboutComponent implements OnInit {
  constructor(@Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'About'},
    ];
    const buttons: object[] = [
      {iconType: 'fas', icon: 'question', label: 'Help', route: ['/about/help'], display: 'always'},
    ];
    this.breadCrumbsService.set(crumbs, buttons);
  }

  scrollToElement($element): void {
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  scrollToTop($element): void {
    $element.parentElement.parentElement.parentElement.parentElement.scrollTo(0, 0);
  }
}
