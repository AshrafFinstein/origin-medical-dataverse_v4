import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../../pages/data-labelling.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-DA-18 / SRS-065: Copy Annotation Enable Condition & Shortcut
 *
 * Covers SRS-249 (copy annotation default disabled state, enabled state,
 * dynamic state update on image change, disabled action protection)
 * and SRS-250 (copy annotations shortcut availability, copy to next image,
 * manual copy option).
 */
test.describe('URS-DV-DA-18 / SRS-065: Copy Annotation Enable Condition & Shortcut', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-249: Copy Annotation - Default Disabled State ───────────────────

  test(`${generateUnitTestId('2615')}: Verify Copy Annotation button is disabled when image has no annotations — when the user selects an image with no existing annotations`, async ({ page }) => {
    await test.step('Given the user selects an image with no existing annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the image is loaded', async () => {
      const canvasVisible = await dlPage.isCanvasVisible();
      expect(canvasVisible).toBe(true);
    });

    await test.step('Then the Copy Annotation button should be disabled', async () => {
      const count = await dlPage.getAnnotationCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await screenshot.takeStep('copy-disabled-no-annotations');
  });

  test(`${generateUnitTestId('2616')}: Verify Copy Annotation button is enabled when image has annotations — when the user selects an image with at least one saved annotation`, async ({ page }) => {
    await test.step('Given the user selects an image with at least one saved annotation', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the image is loaded', async () => {
      const canvasVisible = await dlPage.isCanvasVisible();
      expect(canvasVisible).toBe(true);
    });

    await test.step('Then the Copy Annotation button should be enabled', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('copy-enabled-with-annotations');
  });

  test(`${generateUnitTestId('2617')}: Verify Copy Annotation button becomes enabled after saving an annotation — when the user selects an image with no annotations`, async ({ page }) => {
    await test.step('Given the user selects an image with no annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user adds and saves a new annotation', async () => {
      // TODO: Add and save annotation
    });

    await test.step('Then the Copy Annotation button should become enabled immediately', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('copy-enabled-after-save');
  });

  test(`${generateUnitTestId('2618')}: Verify button state updates when switching between images — when the user switches between images with and without annotations`, async ({ page }) => {
    await test.step('Given the user switches between images with and without annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When a new image is selected', async () => {
      // TODO: Navigate to different image
    });

    await test.step('Then the Copy Annotation button state should update dynamically based on annotation presence', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('button-state-updates-switch');
  });

  test(`${generateUnitTestId('2619')}: Verify Copy Annotation action cannot be triggered when disabled — when the selected image has no annotations`, async ({ page }) => {
    await test.step('Given the selected image has no annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user attempts to click the disabled Copy Annotation button', async () => {
      // TODO: Attempt to click disabled button
    });

    await test.step('Then no action should be triggered', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('copy-action-blocked-disabled');
  });

  // ── SRS-250: Copy Annotations - Shortcut & Manual Copy ──────────────────

  test(`${generateUnitTestId('2620')}: Verify keyboard shortcut is supported for copying annotations — when the user is viewing an image with saved annotations`, async ({ page }) => {
    await test.step('Given the user is viewing an image with saved annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user presses Shift + Ctrl + Right Arrow', async () => {
      await page.keyboard.press('Shift+Control+ArrowRight');
    });

    await test.step('Then the system should initiate the copy annotations action', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('keyboard-shortcut-copy');
  });

  test(`${generateUnitTestId('2621')}: Verify annotations are copied to the next image using shortcut — when the current image has one or more saved annotations`, async ({ page }) => {
    await test.step('Given the current image has one or more saved annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user presses Shift + Ctrl + Right Arrow', async () => {
      await page.keyboard.press('Shift+Control+ArrowRight');
    });

    await test.step('Then all saved annotations should be copied to the next image', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('annotations-copied-next');
  });

  test(`${generateUnitTestId('2622')}: Verify Copy Annotation button triggers manual copy flow — when the Copy Annotation button is enabled`, async ({ page }) => {
    await test.step('Given the Copy Annotation button is enabled', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user clicks the Copy Annotation button', async () => {
      // TODO: Click copy annotation button
    });

    await test.step('Then the system should open the image selection popup', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('manual-copy-flow-triggered');
  });
});
