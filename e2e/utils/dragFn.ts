import { Page, Locator } from '@playwright/test';

export async function dragAndDrop(
  page: Page,
  source: Locator,
  target: Locator
): Promise<void> {
  await source.dragTo(target);
}

export async function dragByOffset(
  page: Page,
  locator: Locator,
  dx: number,
  dy: number
): Promise<void> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not found for drag');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 10 });
  await page.mouse.up();
}

export async function reorderListItem(
  page: Page,
  listLocator: Locator,
  fromIndex: number,
  toIndex: number
): Promise<void> {
  const items = await listLocator.all();
  if (fromIndex >= items.length || toIndex >= items.length) {
    throw new Error(`Index out of bounds: list has ${items.length} items`);
  }
  await dragAndDrop(page, items[fromIndex], items[toIndex]);
}
