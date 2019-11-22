import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getImageSvgVersion() {
    return element(by.css('app-root .content .container app-home-image svg')).getAttribute('version') as Promise<string>;
  }
}
