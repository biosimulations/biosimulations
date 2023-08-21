import { Component } from '@angular/core';

interface FooterItemInterface {
  cssClass: string;
  href?: string;
  title: string;
  target: string;
}
class FooterItem implements FooterItemInterface {
  public cssClass: string;
  public href: string;
  public title: string;
  public target = 'biosimulations-docs';

  public constructor(cssClass: string, href: string, title: string) {
    this.cssClass = 'footer-item ' + ' ' + cssClass;
    if (cssClass == 'status') {
      this.href = 'https://status.biosimulations.org/';
    } else if (cssClass == 'vivarium') {
      this.href = 'https://vivarium-collective.github.io/';
    } else {
      this.href = 'https://docs.biosimulations.org/' + href;
    }
    this.title = title;
  }
}

@Component({
  selector: 'biosimulations-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent {
  public helpFooterItems = [
    new FooterItem('faq', 'users/faqs/', 'Frequently Asked Questions'),
    new FooterItem('contact', 'about/contact/', 'Contact Us'),
  ];

  //public conventionFooterItems!: FooterItem[];

  public aboutFooterItems = [
    new FooterItem('about', '', 'About'),
    new FooterItem('terms', 'about/terms/', 'Terms of Service'),
    new FooterItem('privacy', 'about/privacy', 'Privacy Policy'),
    new FooterItem('status', '', 'Status'),
    new FooterItem('vivarium', '', '@Vivarium'),
  ];
}
