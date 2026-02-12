/**
 * Centralized test data for all E2E tests
 */

export const TestData = {
  // URLs
  urls: {
    loginPage: process.env.API_URL || 'http://localhost:3000/login',
    homePage: process.env.API_URL || 'http://localhost:3000',
    dashboard: `${process.env.API_URL || 'http://localhost:3000'}/dashboard`,
  },

  // Valid credentials
  validCredentials: {
    email: process.env.ADMIN_USERNAME || 'ashraf.a@finstein.ai',
    password: process.env.ADMIN_PASSWORD || 'yxD21p)E1)SL',
  },

  // Invalid credentials for negative tests
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },

  // Test users for role-based testing
  testUsers: {
    admin: {
      email: process.env.ADMIN_USERNAME || 'ashraf.a@finstein.ai',
      password: process.env.ADMIN_PASSWORD || 'yxD21p)E1)SL',
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
