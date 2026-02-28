const uatBaseUrl = process.env.BASE_URL || 'https://uat.dataverse.com';

export const environments = {
  dev: {
    baseURL: uatBaseUrl,
    apiURL: `${uatBaseUrl}/api`,
  },
  staging: {
    baseURL: 'https://staging.dataverse.com',
    apiURL: 'https://staging.dataverse.com/api',
  },
  uat: {
    baseURL: uatBaseUrl,
    apiURL: `${uatBaseUrl}/api`,
  },
  production: {
    baseURL: 'https://dataverse.com',
    apiURL: 'https://dataverse.com/api',
  },
};

export type Environment = keyof typeof environments;

export const getEnvironment = (env: string = 'dev'): typeof environments.dev => {
  if (Object.prototype.hasOwnProperty.call(environments, env)) {
    return environments[env as Environment];
  }
  return environments.dev;
};
