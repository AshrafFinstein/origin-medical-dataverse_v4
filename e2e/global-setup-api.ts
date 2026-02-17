import { FullConfig } from '@playwright/test';
import { Auth0OAuthLogin } from './helpers/auth0-oauth-login.helper';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Global Setup with Auth0 OAuth Code Flow (NO CAPTCHA)
 *
 * Uses the OAuth Authorization Code flow via pure HTTP requests.
 * Auth0's server-side endpoints don't render JavaScript, so no CAPTCHA loads.
 *
 * To use: set AUTH_MODE=api in .env (this is the default)
 */
async function globalSetup(config: FullConfig) {
  void config;

  // Load environment variables — root .env first, then backend .env for Auth0 vars
  const rootEnv = path.resolve(process.cwd(), '.env');
  const backendEnv = path.resolve(process.cwd(), 'datavaerese_frontend_&_backend', '.env');
  dotenv.config({ path: rootEnv });
  dotenv.config({ path: backendEnv }); // won't overwrite existing keys

  const baseUrl = (process.env.baseURL || process.env.UAT_URL || process.env.API_URL || 'http://localhost:3000')
    .replace(/\/+$/, '');

  // ─── Check 12-hour cache ───
  const authStatePath = './playwright/.auth/state.json';
  if (fs.existsSync(authStatePath)) {
    const stats = fs.statSync(authStatePath);
    const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

    if (ageInHours < 12) {
      console.log(`Auth state is ${ageInHours.toFixed(1)} hours old - reusing cached session.`);
      return;
    }
    console.log(`Auth state is ${ageInHours.toFixed(1)} hours old - re-authenticating...`);
  }

  console.log('Authenticating via Auth0 OAuth Code Flow (NO CAPTCHA)...');

  try {
    // Ensure auth directory exists
    const authDir = path.resolve('playwright/.auth');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Perform OAuth Code Flow login (no browser, no CAPTCHA)
    const result = await Auth0OAuthLogin.login();

    // Build Playwright storageState with the sealed cookie
    const storageState = Auth0OAuthLogin.buildStorageState(result, baseUrl);

    // Save the storage state
    fs.writeFileSync(authStatePath, JSON.stringify(storageState, null, 2));

    console.log('API authentication complete - state saved to ' + authStatePath);
  } catch (error: unknown) {
    const authError = error as { message?: string };
    console.error('API authentication failed:', authError.message || 'Unknown error');
    console.error('\nTroubleshooting:');
    console.error('  1. Verify AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET in .env');
    console.error('  2. Verify APP_USERNAME/ADMIN_USERNAME and APP_PASSWORD/ADMIN_PASSWORD in .env');
    console.error('  3. Verify AUTH0_DATABASE_CONNECTION matches your Auth0 DB connection name');
    console.error('  4. Fallback: set AUTH_MODE=browser in .env for manual browser login');
    throw error;
  }
}

export default globalSetup;
