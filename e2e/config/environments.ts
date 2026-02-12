export const environments = {
  dev: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:3000/api',
  },
  staging: {
    baseURL: 'https://staging.dataverse.com',
    apiURL: 'https://staging.dataverse.com/api',
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
