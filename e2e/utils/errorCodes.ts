export enum HTTP_STATUS {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export const APP_ERRORS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  NAME_TOO_LONG: 'Name must be less than 255 characters',
  DUPLICATE_NAME: 'A record with this name already exists',
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Wrong email or password',
  SESSION_EXPIRED: 'Your session has expired',
  ACCESS_DENIED: 'You do not have permission to perform this action',
};
