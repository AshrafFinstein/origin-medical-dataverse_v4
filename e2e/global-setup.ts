import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Global setup runs once before all tests
 * - Authenticates via browser login
 * - Saves storage state for all parallel workers to reuse
 */
async function globalSetup(config: FullConfig) {
  // Load environment variables from the backend .env file
  dotenv.config({ path: path.join(__dirname, '../datavaerese_frontend_&_backend/.env') });

  const username = process.env.ADMIN_USERNAME || 'ashraf.a@finstein.ai';
  const password = process.env.ADMIN_PASSWORD || 'yxD21p)E1)SL';
  const baseUrl = process.env.API_URL || 'http://localhost:3000';

  console.log('🔐 Authenticating via browser login...');
  console.log(`   Username: ${username}`);
  console.log(`   Base URL: ${baseUrl}`);

  try {
    // Create auth directory if it doesn't exist
    const authDir = path.join(__dirname, '../playwright/.auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    const browser = await chromium.launch({
      headless: false,  // Run in headed mode so user can solve CAPTCHA
      slowMo: 500       // Slow down actions for visibility
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('   🌐 Navigating to application...');
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Take screenshot to debug
    await page.screenshot({ path: 'playwright/.auth/debug-before-login.png', fullPage: true });
    console.log('   📸 Screenshot saved: playwright/.auth/debug-before-login.png');

    // Check if we're redirected to Auth0 login
    const currentUrl = page.url();

    if (currentUrl.includes('auth0.com') || currentUrl.includes('/login')) {
      console.log('   🔐 Auth0 login required');

      // Fill in login form
      console.log('   📝 Filling login credentials...');

      // Try multiple selectors for email input
      const emailInput = page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(username);

      // Wait for password input
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(password);

      // Check for CAPTCHA
      const captchaPresent = await page.locator('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"], #recaptcha, .g-recaptcha').count() > 0;

      if (captchaPresent) {
        console.log('⚠️  ═══════════════════════════════════════════════════');
        console.log('⚠️  CAPTCHA DETECTED - PLEASE SOLVE IT NOW!');
        console.log('⚠️  You have 90 seconds to solve the CAPTCHA');
        console.log('⚠️  The browser window is now visible');
        console.log('⚠️  ═══════════════════════════════════════════════════');
        await page.waitForTimeout(90000);  // 90 seconds
      }

      // Click submit button
      console.log('   🔑 Submitting login...');
      const submitButton = page.locator('button[type="submit"], button[name="action"]').first();
      await submitButton.click();

      // Take screenshot after submit
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'playwright/.auth/debug-after-submit.png', fullPage: true });
      console.log('   📸 Screenshot after submit: playwright/.auth/debug-after-submit.png');

      // Wait for navigation back to application
      console.log('   ⏳ Waiting for successful login redirect...');
      console.log(`   Current URL: ${page.url()}`);
      await page.waitForURL(/dataverse|dashboard|localhost:\d+\/(?!login)/, { timeout: 30000 });
      console.log(`   ✓ Redirected to: ${page.url()}`);
      await page.waitForLoadState('networkidle');
    } else {
      console.log('   ✓ Already on application (no login needed)');
    }

    // Give Auth0 time to establish session
    await page.waitForTimeout(3000);

    // Save the authenticated state
    await context.storageState({ path: './playwright/.auth/state.json' });
    await browser.close();

    console.log('✅ Authentication complete - state saved to ./playwright/.auth/state.json');
  } catch (error: any) {
    console.error('❌ Authentication failed:', error.message);
    console.error('   Make sure the application is running at:', baseUrl);
    throw error;
  }
}

export default globalSetup;
