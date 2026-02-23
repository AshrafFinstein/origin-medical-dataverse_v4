import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `e2e/screenshots/${name}-${Date.now()}.png` });
}

export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}

export async function clearAndFill(locator: Locator, value: string): Promise<void> {
  await locator.clear();
  await locator.fill(value);
}

export class ScreenshotHelper {
  constructor(
    private page: Page,
    private testInfo: { title: string; status?: string }
  ) {}

  async takeStep(name?: string): Promise<void> {
    const label = name || `step-${Date.now()}`;
    const title = this.testInfo.title.replace(/\s+/g, '-').slice(0, 40);
    await this.page.screenshot({ path: `e2e/screenshots/${title}-${label}.png` });
  }

  /** Called in afterEach - saves to screenshots/passed/ or screenshots/failed/ */
  async captureResult(status: 'passed' | 'failed' | 'skipped' | string): Promise<void> {
    const folder = status === 'passed' ? 'screenshots/passed' : 'screenshots/failed';
    const dir = path.resolve(folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const title = this.testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
    await this.page.screenshot({
      path: path.join(dir, `${title}-${Date.now()}.png`),
      fullPage: true,
    });
  }
}
