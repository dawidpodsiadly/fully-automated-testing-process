import {Locator, Page} from '@playwright/test';

export class DeleteUserDialog {
  readonly page: Page;
  readonly mainLocator: Locator;

  readonly deleteButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('.confirm-delete');

    this.deleteButton = this.page.locator('#delete-modal-delete-button');
    this.cancelButton = this.page.locator('#delete-modal-cancel-button');
  }

  async confirmDelete() {
    await this.deleteButton.click();
  }
}
