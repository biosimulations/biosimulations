import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['../about.module.sass', './help.component.sass'],
})
export class HelpComponent implements OnInit {
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
