import {Page, Locator, expect} from '@playwright/test';
import {DeleteUserDialog} from '../components/dialogs/delete-user-dialog.model';
import {UserHeader} from './inner_models/user-table-header.model';
import {UserTableRow} from './inner_models/user-table-row.model';

export class UserTable {
  readonly page: Page;
  readonly mainLocator: Locator;
  readonly deleteUserDialog: DeleteUserDialog;
  readonly userHeader: UserHeader;

  readonly deleteSelectedUsersButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageItemsSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#users-table');
    this.deleteUserDialog = new DeleteUserDialog(page);
    this.userHeader = new UserHeader(page);

    this.deleteSelectedUsersButton = this.page.locator('#user-table-delete-selected-users-button');
    this.previousPageButton = this.page.locator('#pagination-prev-button');
    this.nextPageButton = this.page.locator('#pagination-next-button');
    this.pageItemsSelect = this.page.locator('#pagination-page-items');
  }

  async logout() {
    await this.userHeader.logoutButton.click();
  }

  async searchByEmail(email: string) {
    await this.userHeader.searchInput.clear();
    await this.userHeader.searchInput.fill(email);
  }

  async getRowByEmail(userEmail: string): Promise<UserTableRow> {
    const maxAttempts = 3;
    const waitTime = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.searchByEmail(userEmail);
      const userTableRow = this.mainLocator.locator('#table-user-row').filter({hasText: userEmail});

      if ((await userTableRow.count()) > 0) {
        return new UserTableRow(userTableRow);
      }

      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(waitTime);
        await this.page.reload({waitUntil: 'networkidle'});
      }
    }
    throw new Error(`Could not find User with email: ${userEmail} after ${maxAttempts} attempts.`);
  }

  async isVisible(isVisible = true) {
    isVisible ? await expect(this.mainLocator).toBeVisible() : await expect(this.mainLocator).not.toBeVisible();
  }
}
