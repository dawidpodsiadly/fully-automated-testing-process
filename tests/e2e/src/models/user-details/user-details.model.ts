import {expect, Locator, Page} from '@playwright/test';
import {CreateUserData} from '../user-creator/user-creator.model';
import {todaysDate} from '../../utils/date.utils';

export enum OtherOptions {
  Yes = 'Yes',
  No = 'No',
  NoData = '-',
}

export class UserDetails {
  readonly page: Page;
  readonly mainLocator: Locator;

  readonly userDataLocators: {
    name: Locator;
    surname: Locator;
    email: Locator;
    phoneNumber: Locator;
    birthDate: Locator;
    contractType: Locator;
    salary: Locator;
    position: Locator;
    startTime: Locator;
    endTime: Locator;
    notes: Locator;
    admin: Locator;
    activated: Locator;
    lastUpdated: Locator;
  };

  readonly locators: {
    backButton: Locator;
    logout: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#user-details-form');

    this.userDataLocators = {
      name: this.mainLocator.locator('#user-details-name'),
      surname: this.mainLocator.locator('#user-details-surname'),
      email: this.mainLocator.locator('#user-details-email'),
      phoneNumber: this.mainLocator.locator('#user-details-phone-number'),
      birthDate: this.mainLocator.locator('#user-details-birth-date'),
      contractType: this.mainLocator.locator('#user-details-contract-type'),
      salary: this.mainLocator.locator('#user-details-salary'),
      position: this.mainLocator.locator('#user-details-position'),
      startTime: this.mainLocator.locator('#user-details-start-time'),
      endTime: this.mainLocator.locator('#user-details-end-time'),
      notes: this.mainLocator.locator('#user-details-notes'),
      admin: this.mainLocator.locator('#user-details-admin'),
      activated: this.mainLocator.locator('#user-details-activated'),
      lastUpdated: this.mainLocator.locator('#user-details-last-updated'),
    };

    this.locators = {
      backButton: this.mainLocator.locator('#back-button'),
      logout: this.mainLocator.locator('#logout-button'),
    };
  }

  async isVisible(isVisible = true) {
    isVisible
      ? await expect(this.mainLocator).toBeVisible()
      : await expect(this.mainLocator).not.toBeVisible();
  }

  async checkUserData(userData: Partial<CreateUserData>) {
    if (userData.name) await expect(this.userDataLocators.name).toContainText(userData.name);
    if (userData.surname) await expect(this.userDataLocators.surname).toContainText(userData.surname);
    if (userData.email) await expect(this.userDataLocators.email).toContainText(userData.email);

    await expect(this.userDataLocators.phoneNumber).toContainText(userData.phoneNumber || OtherOptions.NoData);
    await expect(this.userDataLocators.birthDate).toContainText(userData.birthDate || OtherOptions.NoData);
    await expect(this.userDataLocators.contractType).toContainText(userData.contract?.type || OtherOptions.NoData);
    await expect(this.userDataLocators.salary).toContainText(userData.contract?.salary || OtherOptions.NoData);
    await expect(this.userDataLocators.position).toContainText(userData.contract?.position || OtherOptions.NoData);
    await expect(this.userDataLocators.startTime).toContainText(userData.contract?.startTime || OtherOptions.NoData);
    await expect(this.userDataLocators.endTime).toContainText(userData.contract?.endTime || OtherOptions.NoData);
    await expect(this.userDataLocators.notes).toContainText(userData.notes || OtherOptions.NoData);

    await expect(this.userDataLocators.admin).toContainText(userData.isAdmin ? OtherOptions.Yes : OtherOptions.No);
    await expect(this.userDataLocators.activated).toContainText(userData.isActivated ? OtherOptions.Yes : OtherOptions.No);
    await expect(this.userDataLocators.lastUpdated).toContainText(todaysDate());
  }

  async logout() {
    await this.locators.logout.click();
  }
}
