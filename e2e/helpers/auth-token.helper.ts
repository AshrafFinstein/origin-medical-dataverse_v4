import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface Auth0Tokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_at: number;
}

interface StorageState {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Lax' | 'Strict' | 'None';
  }>;
  origins: Array<{
    origin: string;
    localStorage: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

/**
 * AuthTokenManager handles Auth0 authentication via Resource Owner Password Grant
 * This bypasses CAPTCHA by using API-based authentication instead of browser login
 */
export class AuthTokenManager {
  private static tokenCache: Auth0Tokens | null = null;
  private static tokenFile = './playwright/.auth/tokens.json';

  /**
   * Get Auth0 tokens via Resource Owner Password Grant (bypasses CAPTCHA)
   * This uses the Password Grant flow which doesn't require browser interaction
   */
  static async getTokens(username: string, password: string): Promise<Auth0Tokens> {
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
    const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
    const AUTH0_DATABASE_CONNECTION = process.env.AUTH0_DATABASE_CONNECTION || 'Username-Password-Authentication';

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET || !AUTH0_AUDIENCE) {
      throw new Error('Missing required Auth0 environment variables');
    }

    try {
      const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
        grant_type: 'password',
        username,
        password,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email',
        realm: AUTH0_DATABASE_CONNECTION,
      });

      const tokens: Auth0Tokens = {
        access_token: response.data.access_token,
        id_token: response.data.id_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + (response.data.expires_in * 1000) - 60000, // Refresh 1 min before expiry
      };

      this.tokenCache = tokens;
      this.saveTokens(tokens);
      return tokens;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error_description?: string }>;
      const reason =
        axiosError.response?.data?.error_description ||
        axiosError.message ||
        'Unknown Auth0 error';
      throw new Error(`Failed to get Auth0 tokens: ${reason}`);
    }
  }

  /**
   * Get valid tokens - refresh if expired
   */
  static async getValidTokens(username: string, password: string): Promise<Auth0Tokens> {
    // Try to load cached tokens
    if (!this.tokenCache) {
      this.tokenCache = this.loadTokens();
    }

    // Check if tokens exist and are valid
    if (this.tokenCache && Date.now() < this.tokenCache.expires_at) {
      return this.tokenCache;
    }

    // Try to refresh tokens if refresh token available
    if (this.tokenCache?.refresh_token) {
      try {
        return await this.refreshTokens(this.tokenCache.refresh_token);
      } catch (error) {
        console.log('Token refresh failed, getting new tokens...');
      }
    }

    // Get new tokens
    return await this.getTokens(username, password);
  }

  /**
   * Refresh tokens using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<Auth0Tokens> {
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) {
      throw new Error('Missing required Auth0 environment variables');
    }

    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
    });

    const tokens: Auth0Tokens = {
      access_token: response.data.access_token,
      id_token: response.data.id_token,
      refresh_token: response.data.refresh_token || refreshToken,
      expires_at: Date.now() + (response.data.expires_in * 1000) - 60000,
    };

    this.tokenCache = tokens;
    this.saveTokens(tokens);
    return tokens;
  }

  /**
   * Convert tokens to browser cookies/storage for Playwright
   */
  static async createStorageState(tokens: Auth0Tokens): Promise<StorageState> {
    const AUTH0_COOKIE_NAME = process.env.AUTH0_COOKIE_NAME || 'dataverse-auth0-cookies';
    const AUTH0_BASE_URL = process.env.API_URL || 'http://localhost:3000';

    // Create a minimal storage state that Playwright can use
    return {
      cookies: [
        {
          name: AUTH0_COOKIE_NAME,
          value: tokens.access_token, // Simplified - in production, this would be Iron-sealed
          domain: new URL(AUTH0_BASE_URL).hostname,
          path: '/',
          expires: Math.floor(tokens.expires_at / 1000),
          httpOnly: true,
          secure: AUTH0_BASE_URL.startsWith('https'),
          sameSite: 'Lax' as const,
        },
      ],
      origins: [
        {
          origin: AUTH0_BASE_URL,
          localStorage: [
            {
              name: 'auth0_access_token',
              value: tokens.access_token,
            },
            {
              name: 'auth0_id_token',
              value: tokens.id_token,
            },
          ],
        },
      ],
    };
  }

  private static saveTokens(tokens: Auth0Tokens) {
    const dir = path.dirname(this.tokenFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.tokenFile, JSON.stringify(tokens, null, 2));
  }

  private static loadTokens(): Auth0Tokens | null {
    try {
      if (fs.existsSync(this.tokenFile)) {
        return JSON.parse(fs.readFileSync(this.tokenFile, 'utf8'));
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
    return null;
  }
}
