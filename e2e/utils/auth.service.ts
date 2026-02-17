import axios from 'axios';
import Iron from '@hapi/iron';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env files — root first, then backend (won't overwrite existing keys)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({
  path: path.resolve(process.cwd(), 'datavaerese_frontend_&_backend', '.env'),
});

const AUTH_STATE_PATH = './playwright/.auth/state.json';

/**
 * Perform Auth0 login via Resource Owner Password Grant.
 *
 * This uses a single POST to /oauth/token — NO browser, NO CAPTCHA, NO state.
 * Works with Auth0 New Universal Login (unlike the Classic /usernamepassword/login flow).
 *
 * Flow:
 *   1. Check 12-hour cache — reuse state.json if still fresh
 *   2. POST /oauth/token with grant_type=password-realm → get tokens directly
 *   3. Verify id_token via JWKS
 *   4. Seal cookie payload with @hapi/iron (same as backend callback.ts)
 *   5. Write Playwright storageState with the sealed cookie
 */
export async function performLogin(): Promise<void> {
  // ─── 12-hour cache ──────────────────────────────────────────────────
  if (isAuthValid()) {
    console.log('Using existing auth state (< 12 hours old)');
    return;
  }

  const domain = requireEnv('AUTH0_DOMAIN').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const clientId = requireEnv('AUTH0_CLIENT_ID');
  const clientSecret = requireEnv('AUTH0_CLIENT_SECRET');
  const audience = process.env.AUTH0_AUDIENCE || 'origin-health-ai-dataverse-api';
  const connection = process.env.AUTH0_DATABASE_CONNECTION || 'Dataverse-User-DB';
  const cookieName = process.env.AUTH0_COOKIE_NAME || 'dataverse-auth0-cookies';
  const baseUrl = (
    process.env.AUTH0_BASE_URL ||
    process.env.baseURL ||
    process.env.UAT_URL ||
    process.env.API_URL ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');
  const username = process.env.APP_USERNAME || process.env.ADMIN_USERNAME;
  const password = process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('APP_USERNAME/ADMIN_USERNAME and APP_PASSWORD/ADMIN_PASSWORD must be set in .env');
  }

  console.log('Authenticating via Auth0 Password Grant (NO CAPTCHA, NO browser)...');
  console.log(`   Domain: ${domain}`);
  console.log(`   Client ID: ${clientId}`);
  console.log(`   Username: ${username}`);
  console.log(`   Connection: ${connection}`);
  console.log(`   Base URL: ${baseUrl}`);

  // Ensure auth directory exists
  const authDir = path.resolve('playwright/.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // ─── Step 1: Get tokens via Password Grant ────────────────────────
  // Try password-realm first (more specific), then plain password grant
  const grantTypes = [
    'http://auth0.com/oauth/grant-type/password-realm',
    'password',
  ] as const;

  let tokens: {
    access_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
  } | null = null;
  let lastError: unknown;

  for (const grantType of grantTypes) {
    try {
      console.log(`   Trying grant_type=${grantType}...`);

      const body: Record<string, string> = {
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
        scope: 'openid profile email',
      };

      // password-realm grant requires 'realm', standard password grant uses 'connection'
      if (grantType.includes('password-realm')) {
        body.realm = connection;
      }

      // Add audience if configured
      if (audience) {
        body.audience = audience;
      }

      const response = await axios.post(
        `https://${domain}/oauth/token`,
        new URLSearchParams(body).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 30000,
        },
      );

      tokens = response.data;
      console.log(`   Token exchange successful (${grantType})`);
      break;
    } catch (error: unknown) {
      lastError = error;
      const axiosErr = error as { response?: { status?: number; data?: { error?: string; error_description?: string } } };
      const errMsg = axiosErr.response?.data?.error_description || axiosErr.response?.data?.error || 'unknown';
      console.log(`   Grant type ${grantType} failed: ${axiosErr.response?.status} - ${errMsg}`);
    }
  }

  if (!tokens) {
    const axiosErr = lastError as { response?: { status?: number; data?: { error?: string; error_description?: string } }; message?: string };
    const detail = axiosErr.response?.data?.error_description || axiosErr.response?.data?.error || axiosErr.message || 'Unknown';
    console.error('\nAll grant types failed. Last error:', detail);
    console.error('\nTroubleshooting:');
    console.error('  1. Enable "Password" grant type in Auth0 Dashboard → Applications → Advanced Settings → Grant Types');
    console.error('  2. Verify AUTH0_DATABASE_CONNECTION matches your Auth0 DB connection name');
    console.error('  3. Verify APP_USERNAME and APP_PASSWORD are correct');
    console.error('  4. Check if the Auth0 application allows this grant type');
    throw new Error(`Auth0 Password Grant failed: ${detail}`);
  }

  // ─── Step 2: Verify id_token via JWKS ─────────────────────────────
  console.log('   Verifying id_token via JWKS...');
  const jose = await import('jose');
  const JWKS = jose.createRemoteJWKSet(
    new URL(`https://${domain}/.well-known/jwks.json`),
  );
  const { payload: user } = await jose.jwtVerify(tokens.id_token, JWKS, {
    issuer: `https://${domain}/`,
  });

  // ─── Step 3: Seal cookie with @hapi/iron (same as backend callback.ts) ─
  console.log('   Sealing cookie with @hapi/iron...');
  const cookiePayload = {
    user,
    id_token: tokens.id_token,
    access_token: tokens.access_token,
    scope: tokens.scope,
    expires_in: tokens.expires_in,
    token_type: tokens.token_type,
  };

  const sealedCookie = await Iron.seal(
    cookiePayload,
    clientSecret as Iron.Password,
    Iron.defaults,
  );

  // ─── Step 4: Build Playwright storageState ────────────────────────
  const url = new URL(baseUrl);
  const cookieDomain = url.hostname;
  const isSecure = url.protocol === 'https:';

  const storageState = {
    cookies: [
      {
        name: cookieName,
        value: sealedCookie,
        domain: cookieDomain,
        path: '/',
        expires: Math.floor(Date.now() / 1000) + tokens.expires_in,
        httpOnly: true,
        secure: isSecure,
        sameSite: 'Lax' as const,
      },
    ],
    origins: [] as Array<{ origin: string; localStorage: Array<{ name: string; value: string }> }>,
  };

  fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(storageState, null, 2));
  console.log('   Auth state saved to ' + AUTH_STATE_PATH);
  console.log('   Cookie name: ' + cookieName);
  console.log('   Cookie domain: ' + cookieDomain);
  console.log('   Secure: ' + isSecure);
  console.log('   Expires in: ' + tokens.expires_in + 's');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isAuthValid(): boolean {
  if (!fs.existsSync(AUTH_STATE_PATH)) return false;
  const stats = fs.statSync(AUTH_STATE_PATH);
  const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
  return ageInHours < 12;
}
