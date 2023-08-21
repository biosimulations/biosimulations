import { Component } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

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

class HomeSubsectionItem {
  public heading: string;
  public icon: BiosimulationsIcon;
  public contentItems: FooterItem[];
  public subheadingSize = 'small';
  public subheading = '';
  public _id = 'subsection';
  public style = 'justify-content: center';

  public constructor(heading: string, icon: BiosimulationsIcon, contentItems: FooterItem[]) {
    this.heading = heading;
    this.icon = icon;
    this.contentItems = contentItems;
  }
}

const helpFooterItems = [
  new FooterItem('faq', 'users/faqs/', 'Frequently Asked Questions'),
  new FooterItem('contact', 'about/contact/', 'Contact Us'),
];

const conventionsFooterItems = [
  new FooterItem('standards', 'concepts/conventions/', 'Standards'),
  new FooterItem('specs', 'concepts/conventions/simulator-capabilities/', 'Simulator Specs'),
  new FooterItem('interfaces', 'concepts/conventions/simulator-interface/', 'Simulator Interfaces'),
  new FooterItem('images', 'concepts/conventions/simulator-images/', 'Simulator Images'),
  new FooterItem('reports', 'concepts/conventions/simulations-run-reports/', 'Simulation Reports'),
  new FooterItem('viz', 'concepts/conventions/simulation-run-visualizations/', 'Data Visualizations'),
  new FooterItem('metadata', 'concepts/conventions/simulation-project-metadata/', 'Simulation Metadata'),
  new FooterItem('logs', 'concepts/conventions/simulation-run-logs/', 'Simulation Logs'),
];

const aboutFooterItems = [
  new FooterItem('about', '', 'About'),
  new FooterItem('terms', 'about/terms/', 'Terms of Service'),
  new FooterItem('privacy', 'about/privacy', 'Privacy Policy'),
  new FooterItem('status', '', 'Status'),
  new FooterItem('vivarium', '', '@Vivarium'),
];

@Component({
  selector: 'biosimulations-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent {
  public homeSubsectionItems = [
    new HomeSubsectionItem('Help', 'help', helpFooterItems),
    new HomeSubsectionItem('Conventions', 'info', conventionsFooterItems),
    new HomeSubsectionItem('About', 'info', aboutFooterItems),
  ];
}
