import {expect, Locator, Page} from '@playwright/test';
import {todaysFormattedDate} from '../../utils/date.utils';
import {UserData} from '../../types/user.types';

export enum OtherOptions {
  Yes = 'Yes',
  No = 'No',
  NoData = '-',
}

export class UserDetails {
  readonly page: Page;
  readonly mainLocator: Locator;

  readonly nameText: Locator;
  readonly surnameText: Locator;
  readonly emailText: Locator;
  readonly phoneNumberText: Locator;
  readonly birthDateText: Locator;
  readonly contractTypeText: Locator;
  readonly salaryText: Locator;
  readonly positionText: Locator;
  readonly startTimeText: Locator;
  readonly endTimeText: Locator;
  readonly notesText: Locator;
  readonly adminText: Locator;
  readonly activatedText: Locator;
  readonly lastUpdatedText: Locator;

  readonly backButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#user-details-form');

    this.nameText = this.mainLocator.locator('#user-details-name');
    this.surnameText = this.mainLocator.locator('#user-details-surname');
    this.emailText = this.mainLocator.locator('#user-details-email');
    this.phoneNumberText = this.mainLocator.locator('#user-details-phone-number');
    this.birthDateText = this.mainLocator.locator('#user-details-birth-date');
    this.contractTypeText = this.mainLocator.locator('#user-details-contract-type');
    this.salaryText = this.mainLocator.locator('#user-details-salary');
    this.positionText = this.mainLocator.locator('#user-details-position');
    this.startTimeText = this.mainLocator.locator('#user-details-start-time');
    this.endTimeText = this.mainLocator.locator('#user-details-end-time');
    this.notesText = this.mainLocator.locator('#user-details-notes');
    this.adminText = this.mainLocator.locator('#user-details-admin');
    this.activatedText = this.mainLocator.locator('#user-details-activated');
    this.lastUpdatedText = this.mainLocator.locator('#user-details-last-updated');

    this.backButton = this.mainLocator.locator('#back-button');
    this.logoutButton = this.mainLocator.locator('#logout-button');
  }

  async isVisible(isVisible = true) {
    isVisible ? await expect(this.mainLocator).toBeVisible() : await expect(this.mainLocator).not.toBeVisible();
  }

  async checkUserData(userData: Partial<UserData>) {
    if (userData.name) await expect(this.nameText).toContainText(userData.name);
    if (userData.surname) await expect(this.surnameText).toContainText(userData.surname);
    if (userData.email) await expect(this.emailText).toContainText(userData.email);

    await expect(this.phoneNumberText).toContainText(userData.phoneNumber || OtherOptions.NoData);
    await expect(this.birthDateText).toContainText(userData.birthDate || OtherOptions.NoData);
    await expect(this.contractTypeText).toContainText(userData.contract?.type || OtherOptions.NoData);
    await expect(this.salaryText).toContainText(userData.contract?.salary || OtherOptions.NoData);
    await expect(this.positionText).toContainText(userData.contract?.position || OtherOptions.NoData);
    await expect(this.startTimeText).toContainText(userData.contract?.startTime || OtherOptions.NoData);
    await expect(this.endTimeText).toContainText(userData.contract?.endTime || OtherOptions.NoData);
    await expect(this.notesText).toContainText(userData.notes || OtherOptions.NoData);

    await expect(this.adminText).toContainText(userData.isAdmin ? OtherOptions.Yes : OtherOptions.No);
    await expect(this.activatedText).toContainText(userData.isActivated ? OtherOptions.Yes : OtherOptions.No);
    await expect(this.lastUpdatedText).toContainText(todaysFormattedDate());
  }

  async logout() {
    await this.logoutButton.click();
  }
}
