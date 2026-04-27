import {expect, Page, Locator} from '@playwright/test';
import {NavigationPaths, navigationService} from '../../services/navigation.service';
import {UserData} from '../../types/user.types';

export class UserCreator {
  readonly page: Page;
  readonly mainLocator: Locator;

  readonly nameInput: Locator;
  readonly surnameInput: Locator;
  readonly emailInput: Locator;
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
    this.mainLocator = this.page.locator('#create-user-form');

    this.nameInput = this.mainLocator.locator('#name');
    this.surnameInput = this.mainLocator.locator('#surname');
    this.emailInput = this.mainLocator.locator('#email');
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

  async fillAndSubmitUserForm(userData: UserData) {
    await this.nameInput.fill(userData.name);
    await this.surnameInput.fill(userData.surname);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.password);

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
    await this.page.waitForURL(await navigationService.resolvePath(NavigationPaths.USER_TABLE));
  }

  async expectError(errorText: string) {
    await expect(this.page.locator('p.text-danger', {hasText: errorText})).toBeVisible();
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
