import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getImageUrl() {
    return element(by.css('app-root .content .container object')).getAttribute('data') as Promise<string>;
  }
}
