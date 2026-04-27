import {expect, Locator, Page} from '@playwright/test';
import {UserData} from '../../types/user.types';

export class UserUpdate {
  readonly page: Page;
  readonly mainLocator: Locator;

  readonly nameInput: Locator;
  readonly surnameInput: Locator;
  readonly emailInput: Locator;
  readonly changePasswordCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly birthDateInput: Locator;
  readonly positionSelect: Locator;
  readonly salaryInput: Locator;
  readonly contractTypeSelect: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly notesInput: Locator;
  readonly isActivatedCheckbox: Locator;
  readonly isAdminCheckbox: Locator;

  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('#update-user-form');

    this.nameInput = this.mainLocator.locator('#name');
    this.surnameInput = this.mainLocator.locator('#surname');
    this.emailInput = this.mainLocator.locator('#email');
    this.changePasswordCheckbox = this.mainLocator.locator('#changePassword');
    this.passwordInput = this.mainLocator.locator('#password');
    this.confirmPasswordInput = this.mainLocator.locator('#confirmPassword');
    this.phoneNumberInput = this.mainLocator.locator('#phoneNumber');
    this.birthDateInput = this.mainLocator.locator('#birthDate');
    this.positionSelect = this.mainLocator.locator('#position');
    this.salaryInput = this.mainLocator.locator('#salary');
    this.contractTypeSelect = this.mainLocator.locator('#contractType');
    this.startTimeInput = this.mainLocator.locator('#startTime');
    this.endTimeInput = this.mainLocator.locator('#endTime');
    this.notesInput = this.mainLocator.locator('#notes');
    this.isActivatedCheckbox = this.mainLocator.locator('#isActivated');
    this.isAdminCheckbox = this.mainLocator.locator('#isAdmin');

    this.submitButton = this.mainLocator.locator('#submit-button');
    this.cancelButton = this.mainLocator.locator('#cancel-button');
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async isVisible(isVisible = true) {
    isVisible ? await expect(this.mainLocator).toBeVisible() : await expect(this.mainLocator).not.toBeVisible();
  }

  async clearAllInputs() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');

    await this.nameInput.clear();
    await this.surnameInput.clear();
    await this.emailInput.clear();
    await this.phoneNumberInput.clear();
    await this.birthDateInput.clear();
    await this.contractTypeSelect.selectOption('');
    await this.salaryInput.clear();
    await this.positionSelect.selectOption('');
    await this.startTimeInput.clear();
    await this.endTimeInput.clear();
    await this.notesInput.clear();
  }

  async updateUserForm(userData: Partial<UserData>) {
    userData.name ? await this.nameInput.fill(userData.name) : null;
    userData.surname ? await this.surnameInput.fill(userData.surname) : null;
    userData.email ? await this.emailInput.fill(userData.email) : null;

    if (userData.password) {
      await this.changePasswordCheckbox.setChecked(true);
      await this.passwordInput.fill(userData.password);
      await this.confirmPasswordInput.fill(userData.password);
    }

    userData.phoneNumber ? await this.phoneNumberInput.fill(userData.phoneNumber) : null;
    userData.birthDate ? await this.birthDateInput.fill(userData.birthDate) : null;
    userData.contract?.position ? await this.positionSelect.selectOption(userData.contract.position) : null;
    userData.contract?.salary ? await this.salaryInput.fill(userData.contract.salary) : null;
    userData.contract?.type ? await this.contractTypeSelect.selectOption(userData.contract.type) : null;
    userData.contract?.startTime ? await this.startTimeInput.fill(userData.contract.startTime) : null;
    userData.contract?.endTime ? await this.endTimeInput.fill(userData.contract.endTime) : null;
    userData.notes ? await this.notesInput.fill(userData.notes) : null;

    if (userData.isActivated !== undefined) {
      await this.isActivatedCheckbox.setChecked(userData.isActivated);
    }

    if (userData.isAdmin !== undefined) {
      await this.isAdminCheckbox.setChecked(userData.isAdmin);
    }
    await this.submitForm();
  }

  async expectError(errorText: string) {
    await expect(this.page.locator('p.text-danger', {hasText: errorText})).toBeVisible();
  }
}
