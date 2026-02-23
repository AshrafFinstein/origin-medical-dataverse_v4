import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve('generated-data');

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

/** Save a key-value entry to a named JSON store file */
export function saveGeneratedData(storeName: string, key: string, value: unknown): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${storeName}.json`);
  const existing = loadStore(storeName);
  existing[key] = value;
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

/** Load an entire store by name */
export function loadStore(storeName: string): Record<string, unknown> {
  const filePath = path.join(DATA_DIR, `${storeName}.json`);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/** Get a single value from a store */
export function getGeneratedData<T = unknown>(storeName: string, key: string): T | undefined {
  const store = loadStore(storeName);
  return store[key] as T | undefined;
}

/** Append an entry to an array inside a store */
export function appendGeneratedData(storeName: string, key: string, value: unknown): void {
  ensureDir();
  const existing = loadStore(storeName);
  if (!Array.isArray(existing[key])) existing[key] = [];
  (existing[key] as unknown[]).push(value);
  const filePath = path.join(DATA_DIR, `${storeName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}
