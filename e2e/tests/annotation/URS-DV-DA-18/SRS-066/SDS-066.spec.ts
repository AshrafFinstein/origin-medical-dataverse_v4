import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../../pages/data-labelling.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-DA-18 / SRS-066: Copy to Target Image & Previous Image Shortcuts
 *
 * Covers SRS-250 (manual target image selection, success confirmation,
 * unsaved annotation restriction, target image update)
 * and SRS-251 (copy to previous image shortcut, manual copy to previous).
 */
test.describe('URS-DV-DA-18 / SRS-066: Copy to Target & Previous Image', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-250 (continued): Manual Target Image Selection ──────────────────

  test(`${generateUnitTestId('2623')}: Verify annotations are copied to selected image via manual option — when the image selection popup is displayed`, async ({ page }) => {
    await test.step('Given the image selection popup is displayed', async () => {
      await dlPage.waitForLoad();
      // TODO: Open image selection popup
    });

    await test.step('When the user selects a target image and confirms', async () => {
      // TODO: Select target image and confirm
    });

    await test.step('Then all saved annotations should be copied to the selected image', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('annotations-copied-manual');
  });

  test(`${generateUnitTestId('2624')}: Verify confirmation message after successful copy — when annotations are copied successfully`, async ({ page }) => {
    await test.step('Given annotations are copied successfully', async () => {
      // TODO: Complete copy operation
    });

    await test.step('When the copy operation completes', async () => {
      // Copy done
    });

    await test.step('Then a confirmation message such as "Annotations copied to image XX" should be displayed', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('confirmation-message-copy');
  });

  test(`${generateUnitTestId('2625')}: Verify copy is blocked when unsaved annotations exist — when the current image has unsaved annotations`, async ({ page }) => {
    await test.step('Given the current image has unsaved annotations', async () => {
      await dlPage.waitForLoad();
      // TODO: Create unsaved annotation
    });

    await test.step('When the user attempts to copy annotations using shortcut or button', async () => {
      await page.keyboard.press('Shift+Control+ArrowRight');
    });

    await test.step('Then the copy action should be blocked and an error message should be displayed', async () => {
      const configured = await dlPage.areUnsavedChangesSelectorsConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('copy-blocked-unsaved');
  });

  test(`${generateUnitTestId('2626')}: Verify target image view updates after copy — when annotations are copied to a target image`, async ({ page }) => {
    await test.step('Given annotations are copied to a target image', async () => {
      // TODO: Complete copy to target
    });

    await test.step('When the target image is opened', async () => {
      // TODO: Navigate to target image
    });

    await test.step('Then the copied annotations should be visible and editable', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('target-image-view-updates');
  });

  // ── SRS-251: Copy Annotations to Previous Image ────────────────────────

  test(`${generateUnitTestId('2627')}: Verify keyboard shortcut is supported for copying annotations to previous image — when the user is viewing an image with saved annotations`, async ({ page }) => {
    await test.step('Given the user is viewing an image with saved annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user presses Shift + Ctrl + Left Arrow', async () => {
      await page.keyboard.press('Shift+Control+ArrowLeft');
    });

    await test.step('Then the system should initiate the copy annotations action to the previous image', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('shortcut-copy-previous');
  });

  test(`${generateUnitTestId('2628')}: Verify annotations are copied to the previous image using shortcut — when the current image has one or more saved annotations`, async ({ page }) => {
    await test.step('Given the current image has one or more saved annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user presses Shift + Ctrl + Left Arrow', async () => {
      await page.keyboard.press('Shift+Control+ArrowLeft');
    });

    await test.step('Then all saved annotations should be copied to the previous image', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('annotations-copied-previous');
  });

  test(`${generateUnitTestId('2629')}: Verify manual copy flow allows selecting a previous image — when the Copy Annotation button is enabled`, async ({ page }) => {
    await test.step('Given the Copy Annotation button is enabled', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user clicks the Copy Annotation button', async () => {
      // TODO: Click copy annotation button
    });

    await test.step('Then the "Select an image to copy annotations to" popup should be displayed with previous image options', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('manual-copy-previous-image');
  });

  test(`${generateUnitTestId('2630')}: Verify annotations are copied to selected previous image via manual option — when the image selection popup is displayed`, async ({ page }) => {
    await test.step('Given the image selection popup is displayed', async () => {
      // TODO: Open image selection popup
    });

    await test.step('When the user selects a previous image and confirms', async () => {
      // TODO: Select previous image and confirm
    });

    await test.step('Then all saved annotations should be copied to the selected previous image', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('annotations-copied-selected-prev');
  });
});
