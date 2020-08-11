import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['../help.module.sass', './faq.component.sass'],
})
export class FaqComponent implements OnInit {
  tocFixed: boolean = false;

  constructor() { 
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    this.tocFixed = event.srcElement.scrollTop > 64;
  };
  
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
