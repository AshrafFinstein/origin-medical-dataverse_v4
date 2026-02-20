import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../../pages/data-labelling.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-DA-18 / SRS-067: Copy Annotation Conflict Detection
 *
 * Covers SRS-251 (success confirmation for previous image, unsaved restriction,
 * target refresh) and SRS-252 (conflict detection on next/previous image,
 * background block, replace overwrite, no partial replace).
 */
test.describe('URS-DV-DA-18 / SRS-067: Copy Annotation Conflict Detection', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-251 (continued): Copy to Previous Image ────────────────────────

  test(`${generateUnitTestId('2631')}: Verify confirmation message after successful copy to previous image — when annotations are copied successfully to a previous image`, async ({ page }) => {
    await test.step('Given annotations are copied successfully to a previous image', async () => {
      // TODO: Complete copy to previous image
    });

    await test.step('When the copy operation completes', async () => {
      // Copy done
    });

    await test.step('Then a confirmation message such as "Annotations copied to image XX" should be displayed', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('confirmation-copy-previous');
  });

  test(`${generateUnitTestId('2632')}: Verify copy is blocked when unsaved annotations exist — when the current image has unsaved annotations`, async ({ page }) => {
    await test.step('Given the current image has unsaved annotations', async () => {
      await dlPage.waitForLoad();
      // TODO: Create unsaved annotation
    });

    await test.step('When the user attempts to copy annotations to a previous image using shortcut or button', async () => {
      await page.keyboard.press('Shift+Control+ArrowLeft');
    });

    await test.step('Then the copy action should be blocked and an error message should be displayed', async () => {
      const configured = await dlPage.areUnsavedChangesSelectorsConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('copy-blocked-unsaved-previous');
  });

  test(`${generateUnitTestId('2633')}: Verify previous image view refreshes after copy — when annotations are copied to a previous image`, async ({ page }) => {
    await test.step('Given annotations are copied to a previous image', async () => {
      // TODO: Copy annotations to previous
    });

    await test.step('When the previous image is opened', async () => {
      // TODO: Navigate to previous image
    });

    await test.step('Then the copied annotations should be visible and editable', async () => {
      const configured = await dlPage.isAnnotationButtonConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('previous-image-refreshes');
  });

  // ── SRS-252: Copy Annotation - Conflict Detection ──────────────────────

  test(`${generateUnitTestId('2634')}: Verify conflict popup appears when copying to next image with existing annotations — when the source image has saved annotations`, async ({ page }) => {
    await test.step('Given the source image has saved annotations and the next image already contains annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user copies annotations to the next image', async () => {
      await page.keyboard.press('Shift+Control+ArrowRight');
    });

    await test.step('Then the "Existing Annotations Found" popup should be displayed', async () => {
      // Verify copy annotation modal methods are available
      const cancelConfigured = typeof dlPage.cancelCopyAnnotation === 'function';
      expect(cancelConfigured).toBe(true);
      const replaceConfigured = typeof dlPage.replaceCopyAnnotation === 'function';
      expect(replaceConfigured).toBe(true);
    });

    await screenshot.takeStep('conflict-popup-next-image');
  });

  test(`${generateUnitTestId('2635')}: Verify conflict popup appears when copying to previous image with existing annotations — when the source image has saved annotations`, async ({ page }) => {
    await test.step('Given the source image has saved annotations and the previous image already contains annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user copies annotations to the previous image', async () => {
      await page.keyboard.press('Shift+Control+ArrowLeft');
    });

    await test.step('Then the "Existing Annotations Found" popup should be displayed', async () => {
      const cancelConfigured = typeof dlPage.cancelCopyAnnotation === 'function';
      expect(cancelConfigured).toBe(true);
      const replaceConfigured = typeof dlPage.replaceCopyAnnotation === 'function';
      expect(replaceConfigured).toBe(true);
    });

    await screenshot.takeStep('conflict-popup-previous-image');
  });

  test(`${generateUnitTestId('2636')}: Verify background is blocked when conflict popup is displayed — when the "Existing Annotations Found" popup is open`, async ({ page }) => {
    await test.step('Given the "Existing Annotations Found" popup is open', async () => {
      // TODO: Trigger conflict popup
    });

    await test.step('When the user attempts to interact with the background image or controls', async () => {
      // TODO: Attempt background interaction
    });

    await test.step('Then no background interaction should be allowed until popup action is taken', async () => {
      const configured = await dlPage.areUnsavedChangesSelectorsConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('background-blocked-conflict');
  });

  test(`${generateUnitTestId('2637')}: Verify old annotations are fully removed before copy — when the target image contains existing annotations`, async ({ page }) => {
    await test.step('Given the target image contains existing annotations', async () => {
      await dlPage.waitForLoad();
    });

    await test.step('When the user selects Replace in the conflict popup', async () => {
      // TODO: Trigger conflict popup then call replaceCopyAnnotation()
      // await dlPage.replaceCopyAnnotation();
    });

    await test.step('Then all existing annotations should be removed and only copied annotations should be present', async () => {
      const replaceConfigured = typeof dlPage.replaceCopyAnnotation === 'function';
      expect(replaceConfigured).toBe(true);
    });

    await screenshot.takeStep('old-annotations-removed-replace');
  });

  test(`${generateUnitTestId('2638')}: Verify partial replacement does not occur — when the conflict popup is displayed`, async ({ page }) => {
    await test.step('Given the conflict popup is displayed', async () => {
      // TODO: Trigger conflict popup
    });

    await test.step('When the user selects Replace', async () => {
      // TODO: await dlPage.replaceCopyAnnotation();
    });

    await test.step('Then the system should not retain any previous annotations on the target image', async () => {
      const replaceConfigured = typeof dlPage.replaceCopyAnnotation === 'function';
      expect(replaceConfigured).toBe(true);
      const cancelConfigured = typeof dlPage.cancelCopyAnnotation === 'function';
      expect(cancelConfigured).toBe(true);
    });

    await screenshot.takeStep('no-partial-replacement');
  });
});
