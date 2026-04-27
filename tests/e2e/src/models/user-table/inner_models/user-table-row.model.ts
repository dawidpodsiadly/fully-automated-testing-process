import {Locator, expect} from '@playwright/test';
import {todaysFormattedDate} from '../../../utils/date.utils';
import {UserData} from '../../../types/user.types';

export class UserTableRow {
  readonly mainLocator: Locator;

  readonly userCheckbox: Locator;
  readonly userStatusText: Locator;
  readonly userNameText: Locator;
  readonly userEmailText: Locator;
  readonly userPhoneNumberText: Locator;
  readonly userContractTypeText: Locator;
  readonly userStartTimeText: Locator;
  readonly userEndTimeText: Locator;
  readonly userPositionText: Locator;
  readonly userLastUpdatedText: Locator;

  readonly updateButton: Locator;
  readonly deleteButton: Locator;
  readonly activationButton: Locator;

  constructor(userRow: Locator) {
    this.mainLocator = userRow;

    this.userCheckbox = this.mainLocator.locator('#user-row-checkbox input');
    this.userStatusText = this.mainLocator.locator('#user-row-status span');
    this.userNameText = this.mainLocator.locator('#user-name-and-surname');
    this.userEmailText = this.mainLocator.locator('#user-row-email');
    this.userPhoneNumberText = this.mainLocator.locator('#user-row-phone-number');
    this.userContractTypeText = this.mainLocator.locator('#user-row-contract-type');
    this.userStartTimeText = this.mainLocator.locator('#user-row-start-time');
    this.userEndTimeText = this.mainLocator.locator('#user-row-end-time');
    this.userPositionText = this.mainLocator.locator('#user-row-position');
    this.userLastUpdatedText = this.mainLocator.locator('#user-row-last-updated');

    this.updateButton = this.mainLocator.locator('#table-user-row-update-button');
    this.deleteButton = this.mainLocator.locator('#table-user-row-delete-button');
    this.activationButton = this.mainLocator.locator('#table-user-row-deactivate-button');
  }

  async checkUserData(userData: Partial<UserData>) {
    if (userData.name || userData.surname)
      await expect(this.userNameText).toHaveText(`${userData.name || ''} ${userData.surname || ''}`);
    if (userData.email !== undefined) await expect(this.userEmailText).toHaveText(userData.email);

    await expect(this.userPhoneNumberText).toHaveText(userData.phoneNumber || '');
    await expect(this.userContractTypeText).toHaveText(userData.contract?.type || '');
    await expect(this.userStartTimeText).toHaveText(userData.contract?.startTime || '');
    await expect(this.userEndTimeText).toHaveText(userData.contract?.endTime || '');
    await expect(this.userPositionText).toHaveText(userData.contract?.position || '');
    await expect(this.userStatusText).toHaveClass(userData.isActivated ? 'text-success' : 'text-danger');
    await expect(this.userLastUpdatedText).toContainText(todaysFormattedDate());
  }

  async goToUpdateUserView() {
    await this.updateButton.click();
  }

  async isVisible(isVisible = true) {
    isVisible ? await expect(this.mainLocator).toBeVisible() : await expect(this.mainLocator).not.toBeVisible();
  }
}
