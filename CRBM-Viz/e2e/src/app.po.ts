import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getProjectsTitle() {
    return element(by.css('app-root .content .container')).getText() as Promise<string>;
  }
}
