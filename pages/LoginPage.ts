import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#loginButton');
    this.errorMessage = page.locator('.error');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/#/login');
    await this.dismissStartupDialogs();
  }

  /** Closes first-run overlays (welcome banner, cookie consent) that block interaction with the form. */
  private async dismissStartupDialogs(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Close Welcome Banner' })
      .click({ timeout: 5_000 })
      .catch(() => {});
    await this.page.getByRole('button', { name: 'Me want it!' }).click({ timeout: 5_000 }).catch(() => {});
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clearCredentials(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  /** Exposed for specs that assert control state (e.g. disabled submit when invalid). */
  getSubmitButton(): Locator {
    return this.loginButton;
  }
}
