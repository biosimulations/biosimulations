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
    const defaultHrefs: { [key: string]: string } = {
      status: 'https://status.biosimulations.org/',
      vivarium: 'https://vivarium-collective.github.io/',
    };
    this.href = defaultHrefs[cssClass] || 'https://docs.biosimulations.org/' + href;
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

const footerItemDataMap = {
  help: [
    ['faq', 'users/faqs/', 'Frequently Asked Questions'],
    ['contact', 'about/contact/', 'Contact Us'],
  ],
  conventions: [
    ['standards', 'concepts/conventions/', 'Standards'],
    ['specs', 'concepts/conventions/simulator-capabilities/', 'Simulator Specs'],
    ['interfaces', 'concepts/conventions/simulator-interfaces/', 'Simulator Interfaces'],
    ['images', 'concepts/conventions/simulator-images/', 'Simulator Images'],
    ['reports', 'concepts/conventions/simulations-run-reports/', 'Simulation Reports'],
    ['viz', 'concepts/conventions/simulation-run-visualizations/', 'Data Visualizations'],
    ['metadata', 'concepts/conventions/simulation-project-metadata/', 'Simulation Metadata'],
    ['logs', 'concepts/conventions/simulation-run-logs/', 'Simulation Logs'],
  ],
  about: [
    ['about', '', 'About'],
    ['terms', 'about/terms/', 'Terms of Service'],
    ['privacy', 'about/privacy', 'Privacy Policy'],
    ['status', '', 'Status'],
    ['vivarium', '', '@Vivarium'],
  ],
};

const createFooterItems = (footerItemsArray: string[][]) => {
  return footerItemsArray.map((item) => new FooterItem(item[0], item[1], item[2]));
};

const helpFooterItems: FooterItem[] = createFooterItems(footerItemDataMap.help);
const conventionsFooterItems: FooterItem[] = createFooterItems(footerItemDataMap.conventions);
const aboutFooterItems: FooterItem[] = createFooterItems(footerItemDataMap.about);

@Component({
  selector: 'biosimulations-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent {
  public homeSubsectionItems: HomeSubsectionItem[] = [
    new HomeSubsectionItem('Help', 'help', helpFooterItems),
    new HomeSubsectionItem('Conventions', 'info', conventionsFooterItems),
    new HomeSubsectionItem('About', 'info', aboutFooterItems),
  ];
}
