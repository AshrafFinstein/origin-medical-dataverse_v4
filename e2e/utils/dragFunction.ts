import { Page } from '@playwright/test';

export async function dragAndDrop(page: Page, sourceSelector: string, targetSelector: string) {
  const source = page.locator(sourceSelector);
  const target = page.locator(targetSelector);
  await source.dragTo(target);
}
