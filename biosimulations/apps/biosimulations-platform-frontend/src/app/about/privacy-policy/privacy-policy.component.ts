import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['../about.module.sass', './privacy-policy.component.sass'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  scrollToTop($element: any): void {
    $element.parentElement.parentElement.parentElement.parentElement.scrollTo(
      0,
      0,
    );
  }
}
