/**
 * Centralized test data for all E2E tests
 */

const resolvedBaseUrl = process.env.BASE_URL?.replace(/\/+$/, '');

if (!resolvedBaseUrl) {
  throw new Error('Missing required environment variable: BASE_URL');
}

export const TestData = {
  baseUrl: resolvedBaseUrl,

  // URLs
  urls: {
    loginPage: `${resolvedBaseUrl}/login`,
    homePage: resolvedBaseUrl,
    dashboard: `${resolvedBaseUrl}/dashboard`,
  },

  // Valid credentials
  validCredentials: {
    email: process.env.APP_USERNAME || process.env.ADMIN_USERNAME || 'ashraf.a@finstein.ai',
    password: process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD || 'yxD21p)E1)SL',
  },

  // Invalid credentials for negative tests
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },

  // Test users for role-based testing
  testUsers: {
    admin: {
      email: process.env.APP_USERNAME || process.env.ADMIN_USERNAME || 'ashraf.a@finstein.ai',
      password: process.env.APP_PASSWORD || process.env.ADMIN_PASSWORD || 'yxD21p)E1)SL',
      role: 'admin',
    },
    reviewer: {
      email: process.env.REVIEWER_USERNAME || 'reviewer@example.com',
      password: process.env.REVIEWER_PASSWORD || 'password123',
      role: 'reviewer',
    },
    assignee: {
      email: process.env.ASSIGNEE_USERNAME || 'assignee@example.com',
      password: process.env.ASSIGNEE_PASSWORD || 'password123',
      role: 'assignee',
    },
  },

  // Sample test data
  sampleData: {
    epic: {
      name: 'Test Epic ' + Date.now(),
      description: 'Test epic description',
    },
    project: {
      name: 'Test Project ' + Date.now(),
      description: 'Test project description',
    },
    session: {
      name: 'Test Session ' + Date.now(),
      description: 'Test session description',
    },
    label: {
      name: 'Test Label ' + Date.now(),
      abbreviation: 'TL' + Date.now().toString().slice(-4),
      color: '#FF0000',
    },
    annotation: {
      name: 'Test Annotation ' + Date.now(),
      abbreviation: 'TA' + Date.now().toString().slice(-4),
      taxonomyType: 'Rectangle',
      color: '#00FF00',
    },
  },

  // Common test timeouts
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000,
    navigation: 15000,
    apiResponse: 10000,
  },

  // Wait patterns
  urlPatterns: {
    dashboard: /dataverse/,
    login: /login/,
    session: /session/,
  },
};

export default TestData;
