import {Page, Locator} from '@playwright/test';

export class UserHeader {
  readonly page: Page;
  readonly mainLocator: Locator;
  readonly searchInput: Locator;
  readonly addUserButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#users-table-header');

    this.searchInput = this.mainLocator.locator('#search-input');
    this.addUserButton = this.mainLocator.locator('#add-user-button');
    this.logoutButton = this.mainLocator.locator('#logout-button');
  }
}
