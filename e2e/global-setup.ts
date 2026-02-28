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
  void config;
  // Load environment variables from repository root .env
  dotenv.config({ path: path.join(__dirname, '../.env') });

  const username = process.env.APP_USERNAME || process.env.ADMIN_USERNAME;
  const password = process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD;
  const baseUrl = process.env.BASE_URL;

  if (!username || !password || !baseUrl) {
    throw new Error('APP_USERNAME, APP_PASSWORD, and BASE_URL (or ADMIN_USERNAME/ADMIN_PASSWORD) must be set for browser authentication setup.');
  }

  // Check if auth state already exists and is recent (less than 12 hours old)
  const authStatePath = './playwright/.auth/state.json';
  if (fs.existsSync(authStatePath)) {
    const stats = fs.statSync(authStatePath);
    const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

    if (ageInHours < 12) {
      console.log('✅ Using existing authentication (saved ' + ageInHours.toFixed(1) + ' hours ago)');
      console.log('   Skipping login - auth state is still valid\n');
      return; // Skip authentication
    } else {
      console.log('⚠️  Auth state is old (' + ageInHours.toFixed(1) + ' hours) - re-authenticating...\n');
    }
  }

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

      // Wait a moment for CAPTCHA to load
      await page.waitForTimeout(2000);

      // Check for CAPTCHA (both reCAPTCHA and text-based image CAPTCHA)
      const recaptchaPresent = await page.locator('iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"], #recaptcha, .g-recaptcha').count() > 0;
      const textCaptchaPresent = await page.locator('input[name*="captcha" i], input[placeholder*="captcha" i], input[aria-label*="captcha" i]').count() > 0;
      const captchaPresent = recaptchaPresent || textCaptchaPresent;

      if (captchaPresent) {
        console.log('');
        console.log('⚠️  ═══════════════════════════════════════════════════════════');
        console.log('⚠️  ');
        console.log('⚠️    CAPTCHA DETECTED - ACTION REQUIRED!');
        console.log('⚠️  ');
        if (textCaptchaPresent) {
          console.log('⚠️    Type: Text-based CAPTCHA');
          console.log('⚠️    Action: Type the code shown in the image');
        } else {
          console.log('⚠️    Type: reCAPTCHA');
          console.log('⚠️    Action: Check the "I\'m not a robot" box');
        }
        console.log('⚠️  ');
        console.log('⚠️    The browser window should be VISIBLE on your screen');
        console.log('⚠️    After solving, click the Continue/Submit button');
        console.log('⚠️  ');
        console.log('⚠️    Waiting 120 seconds for you to solve...');
        console.log('⚠️  ');
        console.log('⚠️  ═══════════════════════════════════════════════════════════');
        console.log('');

        // Wait 120 seconds for user to solve CAPTCHA
        await page.waitForTimeout(120000);  // 2 minutes

        console.log('   ⏳ Timeout finished - checking if login succeeded...');
      } else {
        // No CAPTCHA - click submit button automatically
        console.log('   🔑 Submitting login...');
        const submitButton = page.locator('button[type="submit"], button[name="action"]').first();
        await submitButton.click();
      }

      // Wait for navigation back to application
      console.log('   ⏳ Waiting for successful login redirect...');
      console.log(`   Current URL: ${page.url()}`);

      try {
        // Wait for redirect (either user submitted after CAPTCHA, or auto-submit worked)
        await page.waitForURL((url) => !url.toString().includes('auth0.com'), { timeout: 60000 });
        console.log(`   ✓ Redirected to: ${page.url()}`);
        await page.waitForLoadState('networkidle');

        // Take success screenshot
        await page.screenshot({ path: 'playwright/.auth/login-success.png', fullPage: true });
        console.log('   📸 Success screenshot: playwright/.auth/login-success.png');
      } catch (error) {
        // Still on login page - take screenshot for debugging
        await page.screenshot({ path: 'playwright/.auth/login-failed.png', fullPage: true });
        console.log('   📸 Failed screenshot: playwright/.auth/login-failed.png');
        throw error;
      }
    } else {
      console.log('   ✓ Already on application (no login needed)');
    }

    // Give Auth0 time to establish session
    await page.waitForTimeout(3000);

    // Save the authenticated state
    await context.storageState({ path: './playwright/.auth/state.json' });
    await browser.close();

    console.log('✅ Authentication complete - state saved to ./playwright/.auth/state.json');
  } catch (error: unknown) {
    const authError = error as { message?: string };
    console.error('❌ Authentication failed:', authError.message || 'Unknown error');
    console.error('   Make sure the application is running at:', baseUrl);
    throw error;
  }
}

export default globalSetup;
