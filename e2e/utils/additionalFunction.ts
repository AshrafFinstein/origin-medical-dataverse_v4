import { Page, Locator } from '@playwright/test';

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
    private testInfo: { title: string }
  ) {}

  async takeStep(name?: string): Promise<void> {
    const label = name || `step-${Date.now()}`;
    const title = this.testInfo.title.replace(/\s+/g, '-').slice(0, 40);
    await this.page.screenshot({ path: `e2e/screenshots/${title}-${label}.png` });
  }
}
