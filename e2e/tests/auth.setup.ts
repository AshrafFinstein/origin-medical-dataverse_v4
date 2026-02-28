import { test as setup } from '@playwright/test';
import { performLogin } from '../utils/auth.service';
import { LoginSelectors } from '../selectors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env files
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({
  path: path.resolve(process.cwd(), 'datavaerese_frontend_&_backend', '.env'),
});

const AUTH_STATE_PATH = './playwright/.auth/state.json';

setup('authenticate and save storage state', async ({ browser }) => {
  // Always refresh session in setup to avoid stale/invalid auth state.
  if (fs.existsSync(AUTH_STATE_PATH)) {
    fs.rmSync(AUTH_STATE_PATH, { force: true });
  }

  // ─── Strategy 1: API-based login (Password Grant — no browser) ────
  try {
    await performLogin();
    if (fs.existsSync(AUTH_STATE_PATH)) {
      console.log('API login succeeded.');
      return;
    }
  } catch (apiError: unknown) {
    const msg = (apiError as { message?: string }).message || '';
    console.log(`API login not available: ${msg}`);
    console.log('Falling back to browser-based login...');
  }

  // ─── Strategy 2: Browser-based login ──────────────────────────────
  const username = process.env.APP_USERNAME || process.env.ADMIN_USERNAME;
  const password = process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD;
  const baseUrl = (process.env.AUTH0_BASE_URL || process.env.BASE_URL || '').replace(/\/+$/, '');

  if (!username || !password || !baseUrl) {
    throw new Error('APP_USERNAME, APP_PASSWORD, and BASE_URL must be set in .env');
  }

  console.log('Authenticating via browser login...');
  console.log(`   Username: ${username}`);
  console.log(`   Base URL: ${baseUrl}`);

  // Ensure auth directory exists
  const authDir = path.resolve('playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the app — will redirect to Auth0 if not logged in
    console.log('   Navigating to application...');
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    if (currentUrl.includes('auth0.com') || currentUrl.includes('/login') || currentUrl.includes('/u/login')) {
      console.log('   Auth0 login page detected');

      // Fill email/username
      const emailInput = page.locator(LoginSelectors['auth0-email-input']).first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(username);

      // Fill password
      const passwordInput = page.locator(LoginSelectors['auth0-password-input']).first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(password);

      // Short wait for any CAPTCHA to appear
      await page.waitForTimeout(2000);

      // Check for text CAPTCHA (Auth0 image-based CAPTCHA)
      const captchaImageCount = await page.locator(LoginSelectors['auth0-captcha-image']).count();
      const captchaInputCount = await page.locator(LoginSelectors['auth0-captcha-input']).count();
      const captchaContainerCount = await page.locator(LoginSelectors['auth0-captcha-container']).count();
      const captchaPresent = captchaImageCount > 0 || captchaInputCount > 0 || captchaContainerCount > 0;

      if (captchaPresent) {
        console.log('');
        console.log('  ══════════════════════════════════════════════════════');
        console.log('   TEXT CAPTCHA DETECTED — Manual action required!');
        console.log('   The browser window should be visible on your screen.');
        console.log('   Please type the distorted text and click Continue.');
        console.log('   Waiting up to 120 seconds...');
        console.log('  ══════════════════════════════════════════════════════');
        console.log('');

        // Wait for either CAPTCHA to be solved (URL changes) or timeout
        try {
          await page.waitForURL(
            (url) => !url.toString().includes('auth0.com'),
            { timeout: 120000 },
          );
        } catch {
          // Check if we're still on login page
          if (page.url().includes('auth0.com')) {
            await page.screenshot({ path: 'playwright/.auth/captcha-timeout.png', fullPage: true });
            throw new Error('CAPTCHA was not solved within 120 seconds. Screenshot saved to playwright/.auth/captcha-timeout.png');
          }
        }
      } else {
        // No CAPTCHA — submit the form
        console.log('   No CAPTCHA detected — submitting login form...');
        const submitButton = page.locator(LoginSelectors['auth0-submit-button']).first();
        await submitButton.click();
      }

      // Wait for redirect back to the app
      console.log('   Waiting for login redirect...');
      try {
        await page.waitForURL(
          (url) => !url.toString().includes('auth0.com'),
          { timeout: 60000 },
        );
        console.log(`   Redirected to: ${page.url()}`);
      } catch {
        await page.screenshot({ path: 'playwright/.auth/login-failed.png', fullPage: true });
        throw new Error(
          `Login redirect failed. Still on: ${page.url()}. Screenshot saved to playwright/.auth/login-failed.png`,
        );
      }

      // Wait for the app to fully load and set cookies
      await page.waitForLoadState('load');
      await page.waitForTimeout(3000);

    } else {
      console.log('   Already on application (no login needed)');
    }

    // Save the authenticated storage state
    await context.storageState({ path: AUTH_STATE_PATH });
    console.log(`   Auth state saved to ${AUTH_STATE_PATH}`);

    // Verify the saved state has the expected cookie
    const savedState = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, 'utf8'));
    const cookieName = process.env.AUTH0_COOKIE_NAME || 'dataverse-auth0-cookies';
    const authCookie = savedState.cookies?.find((c: { name: string }) => c.name === cookieName);
    if (authCookie) {
      console.log(`   Auth cookie '${cookieName}' found (${authCookie.value.length} chars)`);
    } else {
      console.log(`   WARNING: Auth cookie '${cookieName}' NOT found in saved state.`);
      console.log(`   Available cookies: ${savedState.cookies?.map((c: { name: string }) => c.name).join(', ') || 'none'}`);
    }

    // Fix secure flag for HTTP base URLs.
    // Auth0 callback sets Secure unconditionally, but Playwright won't send
    // secure cookies over plain HTTP, causing SSR to redirect to login.
    if (baseUrl.startsWith('http://')) {
      let patched = false;
      for (const cookie of savedState.cookies || []) {
        if (cookie.secure) {
          cookie.secure = false;
          patched = true;
        }
      }
      if (patched) {
        fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(savedState, null, 2));
        console.log('   Patched cookie secure=false for HTTP base URL');
      }
    }

  } finally {
    await context.close();
  }
});
