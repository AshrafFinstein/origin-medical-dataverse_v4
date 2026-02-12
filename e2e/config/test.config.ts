export const testConfig = {
  timeout: 30000,
  retries: 2,
  screenshotOnFailure: true,
  videoOnFailure: true,
  traceOnFailure: true,
};

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN || '',
  clientId: process.env.AUTH0_CLIENT_ID || '',
  audience: process.env.AUTH0_AUDIENCE || '',
};

export const testUsers = {
  admin: {
    username: process.env.ADMIN_USERNAME || '',
    password: process.env.ADMIN_PASSWORD || '',
  },
  user: {
    username: process.env.USER_USERNAME || '',
    password: process.env.USER_PASSWORD || '',
  },
};
