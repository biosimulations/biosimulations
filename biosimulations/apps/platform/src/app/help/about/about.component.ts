import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-about',
  templateUrl: './about.component.html',
  styleUrls: ['../help.module.sass', './about.component.sass'],
})
export class AboutComponent implements OnInit {
  tocFixed = false;

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
  
  scrollToElement($element: Element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    console.log($element)
  }

  scrollToTop($element: any): void {
    $element.parentElement.parentElement.parentElement.parentElement.scrollTo(
      0,
      0,
    );
    console.log($element)
  }
}
