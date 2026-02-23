import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginSelectors } from '../selectors';

// ── Selector bindings ──────────────────────────────────────────────────────────
// Auth0 selectors are raw CSS (external page — no data-testid available).
// App-own selectors (logout, etc.) are data-testid values → wrapped with tid().

const {
  'auth0-email-input': auth0EmailInput,
  'auth0-password-input': auth0PasswordInput,
  'auth0-submit-button': auth0SubmitButton,
  'auth0-captcha-image': auth0CaptchaImage,
  'auth0-captcha-input': auth0CaptchaInput,
  'auth0-captcha-container': auth0CaptchaContainer,
  'auth0-error-message': auth0ErrorMessage,
  'header-logout-button': headerLogoutButton,
  'logout-modal': logoutModal,
  'logout-confirm-button': logoutConfirmButton,
} = LoginSelectors;

// ── Helper: build data-testid selector from value ─────────────────────────────

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navigation & Login ────────────────────────────────────────────────────

  /**
   * Unified login flow for spec-level usage.
   * Navigates to the base URL and authenticates only if redirected to Auth0.
   */
  async performLogin(email: string, password: string, baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
    await this.page.waitForLoadState('domcontentloaded');

    const currentUrl = this.page.url();
    if (this.isAuth0Page(currentUrl)) {
      await this.loginViaAuth0(email, password);
    }
  }

  /**
   * Fill the Auth0 login form, handle text CAPTCHA if present, and submit.
   */
  async loginViaAuth0(email: string, password: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    try {
      // Fill email
      const emailInput = this.page.locator(auth0EmailInput).first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(email);

      // Fill password
      const passwordInput = this.page.locator(auth0PasswordInput).first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(password);

      // Short wait for any CAPTCHA to render
      await this.page.waitForTimeout(2000);

      // Handle text CAPTCHA if present
      if (await this.isTextCaptchaPresent()) {
        await this.handleTextCaptcha();
      }

      // Submit
      const submitButton = this.page.locator(auth0SubmitButton).first();
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      await submitButton.click();

      // Wait for redirect back to the app
      await this.page.waitForURL(
        (url) => !url.toString().includes('auth0.com'),
        { timeout: 60000 },
      );
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      await this.page.screenshot({
        path: `playwright/.auth/login-error-${Date.now()}.png`,
        fullPage: true,
      });
      const message = error instanceof Error ? error.message : 'Unknown Auth0 login error';
      throw new Error(`Auth0 login failed: ${message}`);
    }
  }

  // ── CAPTCHA Handling ──────────────────────────────────────────────────────

  /**
   * Detect Auth0 text-based image CAPTCHA (distorted text image + input).
   */
  async isTextCaptchaPresent(): Promise<boolean> {
    const captchaImageCount = await this.page.locator(auth0CaptchaImage).count();
    const captchaInputCount = await this.page.locator(auth0CaptchaInput).count();
    const captchaContainerCount = await this.page.locator(auth0CaptchaContainer).count();
    return captchaImageCount > 0 || captchaInputCount > 0 || captchaContainerCount > 0;
  }

  /**
   * Log instructions for manual CAPTCHA solving and wait up to 120 seconds.
   * The browser must be running in headed mode for manual intervention.
   */
  async handleTextCaptcha(): Promise<void> {
    console.log('');
    console.log('  ══════════════════════════════════════════════════════');
    console.log('   TEXT CAPTCHA DETECTED — Manual action required!');
    console.log('   The browser window should be visible on your screen.');
    console.log('   Please type the distorted text and click Continue.');
    console.log('   Waiting up to 120 seconds...');
    console.log('  ══════════════════════════════════════════════════════');
    console.log('');

    // Wait for the user to solve CAPTCHA and for the page to navigate away
    try {
      await this.page.waitForURL(
        (url) => !url.toString().includes('auth0.com'),
        { timeout: 120000 },
      );
    } catch {
      if (this.isAuth0Page(this.page.url())) {
        await this.page.screenshot({
          path: 'playwright/.auth/captcha-timeout.png',
          fullPage: true,
        });
        throw new Error(
          'TEXT CAPTCHA was not solved within 120 seconds. Screenshot saved to playwright/.auth/captcha-timeout.png',
        );
      }
    }
  }

  // ── Auth0 Page Detection ──────────────────────────────────────────────────

  /**
   * Check if the given URL belongs to an Auth0 login page.
   */
  isAuth0Page(url: string): boolean {
    return (
      url.includes('auth0.com') ||
      url.includes('/u/login') ||
      url.includes('/login')
    );
  }

  // ── App State Checks ──────────────────────────────────────────────────────

  /**
   * Check if the user is logged in by verifying the logout button is visible.
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.locator(tid(headerLogoutButton)).waitFor({
        state: 'visible',
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read Auth0 error message text (e.g., invalid credentials).
   */
  async getAuth0ErrorMessage(): Promise<string> {
    try {
      const errorLocator = this.page.locator(auth0ErrorMessage).first();
      await errorLocator.waitFor({ state: 'visible', timeout: 5000 });
      return (await errorLocator.textContent()) || '';
    } catch {
      return '';
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  /**
   * Click the logout button and confirm the modal.
   */
  async logout(): Promise<void> {
    await this.click(tid(headerLogoutButton));
    // Wait for logout confirmation modal
    const modalVisible = await this.page.locator(tid(logoutModal)).isVisible({ timeout: 5000 }).catch(() => false);
    if (modalVisible) {
      await this.click(tid(logoutConfirmButton));
    } else {
      // Fallback: click "Log out" button or confirm button by role
      const confirmBtn = this.page.getByRole('button', { name: /confirm|yes|log\s?out/i }).first();
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click();
      }
    }
    // Wait for page load — may fail if redirect target (Auth0) is unreachable
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }
}
