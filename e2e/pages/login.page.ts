import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import selectors from '../selectors/selectors.json';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/login');
  }

  async login(username: string, password: string, rememberMe: boolean = false) {
    await this.fill(selectors.login.usernameInput, username);
    await this.fill(selectors.login.passwordInput, password);
    if (rememberMe) {
      await this.check(selectors.login.rememberMeCheckbox);
    }
    await this.click(selectors.login.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForSelector(selectors.login.errorMessage, { state: 'visible' });
    return await this.getText(selectors.login.errorMessage);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(selectors.login.loginButton);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(selectors.login.loginButton);
  }

  async navigateToLogin(url: string) {
    await super.goto(url);
  }

  /**
   * Unified login flow for spec-level usage.
   * Navigates to the base URL and authenticates only if redirected to login/Auth0.
   */
  async performLogin(username: string, password: string, baseUrl: string) {
    await this.page.goto(baseUrl);
    await this.page.waitForLoadState('domcontentloaded');

    const currentUrl = this.page.url();
    if (currentUrl.includes('auth0.com') || currentUrl.includes('/login')) {
      await this.loginWithAuth0(username, password);
      await this.page.waitForLoadState('networkidle');
    }
  }

  async loginWithDynamicCaptcha(email: string, password: string) {
    await this.waitForSelector(selectors.login.auth0EmailInput, { state: 'visible', timeout: 10000 });
    await this.fill(selectors.login.auth0EmailInput, email);

    await this.waitForSelector(selectors.login.auth0PasswordInput, { state: 'visible', timeout: 10000 });
    await this.fill(selectors.login.auth0PasswordInput, password);

    await this.click(selectors.login.auth0SubmitButton);

    // Wait for navigation or error
    try {
      await this.page.waitForURL(/dataverse|dashboard|\/(?!login)/, { timeout: 15000 });
    } catch {
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    }
  }

  /**
   * Login via Auth0 with CAPTCHA handling
   * This method handles the Auth0 login flow and waits for CAPTCHA if present
   */
  async loginWithAuth0(email: string, password: string) {
    await this.page.waitForLoadState('networkidle');

    try {
      await this.waitForSelector(selectors.login.auth0EmailInput, { state: 'visible', timeout: 10000 });
      await this.fill(selectors.login.auth0EmailInput, email);

      await this.waitForSelector(selectors.login.auth0PasswordInput, { state: 'visible', timeout: 10000 });
      await this.fill(selectors.login.auth0PasswordInput, password);

      const captchaPresent = await this.getCount(selectors.login.auth0CaptchaFrame) > 0;

      if (captchaPresent) {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      }

      await this.waitForSelector(selectors.login.auth0SubmitButton, { state: 'visible', timeout: 5000 });
      await this.click(selectors.login.auth0SubmitButton);

      await this.page.waitForURL(/dataverse|dashboard|localhost:\d+\/(?!login)/, { timeout: 30000 });
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      await this.page.screenshot({ path: `playwright/.auth/login-error-${Date.now()}.png`, fullPage: true });
      const message = error instanceof Error ? error.message : 'Unknown Auth0 login error';
      throw new Error(`Auth0 login failed: ${message}`);
    }
  }
}
