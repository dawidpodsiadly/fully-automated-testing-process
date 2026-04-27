import {expect, Locator, Page} from '@playwright/test';

export class UnauthorizedView {
  readonly page: Page;
  readonly mainLocator: Locator;
  readonly unauthorizedText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#unauthrozied-view');

    this.unauthorizedText = this.mainLocator.locator('#unauthrozied-view-text');
  }

  async isVisible(isVisible = true) {
    isVisible
      ? await expect(this.unauthorizedText).toBeVisible()
      : await expect(this.unauthorizedText).not.toBeVisible();
  }
}
