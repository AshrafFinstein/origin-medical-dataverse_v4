import { Page, Locator } from '@playwright/test';
import selectors from '../selectors/selectors.json';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(selectors.login.usernameInput);
    this.passwordInput = page.locator(selectors.login.passwordInput);
    this.loginButton = page.locator(selectors.login.loginButton);
    this.errorMessage = page.locator(selectors.login.errorMessage);
    this.rememberMeCheckbox = page.locator(selectors.login.rememberMeCheckbox);
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string, rememberMe: boolean = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent() || '';
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async navigateToLogin(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginWithDynamicCaptcha(email: string, password: string) {
    // Wait for email input
    const emailInput = this.page.locator('input[type="email"], input[name="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email);

    // Wait for password input
    const passwordInput = this.page.locator('input[type="password"], input[name="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.fill(password);

    // Click submit button
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for navigation or error
    try {
      await this.page.waitForURL(/dataverse|dashboard|\/(?!login)/, { timeout: 15000 });
    } catch {
      // If URL doesn't change, wait for network idle
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    }
  }

  /**
   * Login via Auth0 with CAPTCHA handling
   * This method handles the Auth0 login flow and waits for CAPTCHA if present
   */
  async loginWithAuth0(email: string, password: string) {
    console.log('🔐 Starting Auth0 login...');

    // Wait for Auth0 login page to load
    await this.page.waitForLoadState('networkidle');

    try {
      // Fill email field (Auth0 uses 'email' or 'username')
      const emailInput = this.page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(email);
      console.log('   ✓ Email filled');

      // Fill password field
      const passwordInput = this.page.locator('input[type="password"], input[name="password"]').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(password);
      console.log('   ✓ Password filled');

      // Check for CAPTCHA
      const captchaPresent = await this.page.locator('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"], #recaptcha, .g-recaptcha').count() > 0;

      if (captchaPresent) {
        console.log('⚠️  CAPTCHA detected - waiting for manual solve (60s timeout)');
        console.log('   Please solve the CAPTCHA in the browser...');

        // Wait for CAPTCHA to be solved (check for submit button to be enabled or CAPTCHA to disappear)
        await this.page.waitForTimeout(60000); // 60 second timeout for manual CAPTCHA solve
      }

      // Click submit/continue button
      const submitButton = this.page.locator('button[type="submit"], button[name="action"]').first();
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      await submitButton.click();
      console.log('   ✓ Submit button clicked');

      // Wait for redirect back to application
      // Auth0 redirects back to the callback URL
      await this.page.waitForURL(/dataverse|dashboard|localhost:\d+\/(?!login)/, { timeout: 30000 });
      console.log('   ✓ Redirected to application');

      // Wait for network to be idle (ensures full page load)
      await this.page.waitForLoadState('networkidle');
      console.log('   ✓ Page loaded');

    } catch (error: any) {
      console.error('❌ Auth0 login failed:', error.message);

      // Take screenshot for debugging
      await this.page.screenshot({ path: `playwright/.auth/login-error-${Date.now()}.png`, fullPage: true });
      console.log('   📸 Error screenshot saved');

      throw error;
    }
  }
}
