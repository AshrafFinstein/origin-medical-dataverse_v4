import { chromium, type FullConfig } from '@playwright/test';
import { performLogin } from './utils/auth.service';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({
  path: path.resolve(process.cwd(), 'datavaerese_frontend_&_backend', '.env'),
});

const AUTH_STATE_PATH = './playwright/.auth/state.json';

export default async function globalAuthSetup(_config: FullConfig): Promise<void> {
  if (isAuthStateFresh()) {
    console.log('Global auth setup: using cached auth state');
    return;
  }

  try {
    await performLogin();
    if (fs.existsSync(AUTH_STATE_PATH)) {
      console.log('Global auth setup: API login succeeded');
      return;
    }
  } catch (apiError: unknown) {
    const msg = (apiError as { message?: string }).message || '';
    console.log(`Global auth setup: API login failed (${msg}), falling back to browser login`);
  }

  await loginViaBrowser();
}

function isAuthStateFresh(): boolean {
  if (!fs.existsSync(AUTH_STATE_PATH)) return false;
  const stats = fs.statSync(AUTH_STATE_PATH);
  const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
  return ageInHours < 12;
}

async function loginViaBrowser(): Promise<void> {
  const username = process.env.APP_USERNAME || process.env.ADMIN_USERNAME;
  const password = process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD;
  const baseUrl = (
    process.env.AUTH0_BASE_URL ||
    process.env.baseURL ||
    process.env.UAT_URL ||
    process.env.API_URL ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');

  if (!username || !password) {
    throw new Error('APP_USERNAME and APP_PASSWORD must be set in .env');
  }

  const authDir = path.resolve('playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const slowMo = parseInt(process.env.SLOW_MO || '0', 10);
  const browser = await chromium.launch({ headless: false, slowMo });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    if (currentUrl.includes('auth0.com') || currentUrl.includes('/login') || currentUrl.includes('/u/login')) {
      const emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"], input#username').first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(username);

      const passwordInput = page.locator('input[type="password"], input[name="password"], input#password').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(password);

      await page.waitForTimeout(2000);

      const captchaIframe = await page.locator('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"]').count();
      const captchaInput = await page.locator('input[name*="captcha" i], #captcha').count();
      const captchaPresent = captchaIframe > 0 || captchaInput > 0;

      if (captchaPresent) {
        console.log('Global auth setup: CAPTCHA detected, waiting up to 120 seconds for manual solve');
        await page.waitForURL((url) => !url.toString().includes('auth0.com'), { timeout: 120000 });
      } else {
        const submitButton = page.locator('button[type="submit"], button[name="action"], button[data-action-button-primary="true"]').first();
        await submitButton.click();
      }

      await page.waitForURL((url) => !url.toString().includes('auth0.com'), { timeout: 60000 });
      await page.waitForLoadState('load');
      await page.waitForTimeout(3000);
    }

    await context.storageState({ path: AUTH_STATE_PATH });
    patchSecureCookiesForHttpBaseUrl(baseUrl);
    console.log('Global auth setup: browser login succeeded and state saved');
  } finally {
    await context.close();
    await browser.close();
  }
}

function patchSecureCookiesForHttpBaseUrl(baseUrl: string): void {
  if (!baseUrl.startsWith('http://')) return;
  const savedState = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, 'utf8')) as {
    cookies?: Array<{ secure?: boolean }>;
  };
  let patched = false;
  for (const cookie of savedState.cookies || []) {
    if (cookie.secure) {
      cookie.secure = false;
      patched = true;
    }
  }
  if (patched) {
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(savedState, null, 2));
  }
}
