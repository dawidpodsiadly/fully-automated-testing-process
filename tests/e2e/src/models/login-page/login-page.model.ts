import {expect, Locator, Page} from '@playwright/test';
import {NavigationPaths, navigationService} from '../../services/navigation.service';

export class LoginPage {
  readonly page: Page;
  readonly mainLocator: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = this.page.locator('form');

    this.emailInput = this.mainLocator.locator('#email');
    this.passwordInput = this.mainLocator.locator('#password');
    this.loginButton = this.mainLocator.locator('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectToBeLoggedIn(isLogged = true) {
    isLogged
      ? await this.page.waitForURL(await navigationService.resolvePath(NavigationPaths.USER_TABLE))
      : await this.page.waitForURL(await navigationService.resolvePath(NavigationPaths.LOGIN));
    isLogged ? await expect(this.mainLocator).not.toBeVisible() : await expect(this.mainLocator).toBeVisible();
  }

  async expectError(errorText: string) {
    await expect(this.page.locator('p.text-danger', {hasText: errorText})).toBeVisible();
  }
}
