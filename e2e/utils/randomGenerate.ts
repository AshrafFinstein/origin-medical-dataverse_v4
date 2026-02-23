import { faker } from '@faker-js/faker';

export function generateRandomText(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateUnitTestId(id: string): string {
  return `UTC-${id}`;
}

export function generateEpicName(): string {
  return `Test Epic ${Date.now()}`;
}

export function generateProjectName(): string {
  return `Test Project ${Date.now()}`;
}

export function generateSessionName(): string {
  return `Test Session ${Date.now()}`;
}

export function generateRandomEmail(): string {
  return faker.internet.email();
}

export function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
