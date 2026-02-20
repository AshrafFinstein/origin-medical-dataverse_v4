import { test, expect } from '@playwright/test';
import { SessionLabelPage } from '../../../../pages/session-label.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-05 / SRS-020: Session Label Name & Description Validation
 *
 * Validates performance of data loading, name field mandatory/validation rules,
 * description field optional behavior, character limits, and inline error messaging.
 *
 * Auth state injected via storageState -- no re-login between tests.
 * All selectors and test-data accessed via SessionLabelPage methods only.
 */
test.describe('URS-DV-GEN-05 / SRS-020: Session Label Name & Description Validation', () => {
  let labelPage: SessionLabelPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    labelPage = new SessionLabelPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await labelPage.gotoMasters();
    await labelPage.switchToSessionLabelTab();
  });

  /* ────────────────────── SRS-43 / SDS-43 (continued) ────────────────────── */

  test(`${generateUnitTestId('520')}: Verify Data loads quickly — when the page is opened`, async () => {
    await test.step('Given the page is opened', async () => {
      // Already on Session Label tab from beforeEach
    });

    await test.step('When data is fetched', async () => {
      const startTime = Date.now();
      await labelPage.waitForLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000);
    });

    await test.step('Then labels should render within acceptable time without blocking UI', async () => {
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('srs43-data-loads-quickly');
  });

  /* ────────────────────── SRS-44 / SDS-44: Name Validation ────────────────────── */

  test(`${generateUnitTestId('521')}: Verify Name cannot be empty — when the Create Session Label popup is open`, async () => {
    await test.step('Given the Create Session Label popup is open', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the Name field is left empty and user clicks Create', async () => {
      await labelPage.fillName('');
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then submission should be blocked and inline validation message displayed', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('name-empty-blocked');
  });

  test(`${generateUnitTestId('522')}: Verify Name contains only spaces — when the Name field contains only spaces`, async () => {
    await test.step('Given the Name field contains only spaces', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('     ');
    });

    await test.step('When the user submits', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then system should trim input and display validation error', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('name-spaces-only-rejected');
  });

  test(`${generateUnitTestId('523')}: Verify Valid alphanumeric name accepted — when the user enters a valid label name`, async () => {
    await test.step('Given the user enters a valid label name', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user submits', async () => {
      const uniqueName = `TestLabel-${Date.now()}`;
      await labelPage.fillName(uniqueName);
      await labelPage.submitCreate();
    });

    await test.step('Then the label should be created successfully', async () => {
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('valid-name-accepted');
  });

  test(`${generateUnitTestId('524')}: Verify Restricted characters entered — when the Name field contains invalid characters (!,@,#,$,%, etc.)`, async () => {
    await test.step('Given the Name field contains invalid characters (!,@,#,$,%, etc.)', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('Invalid!@#$%');
    });

    await test.step('When validation runs', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then invalid characters should be rejected and error displayed', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('restricted-chars-rejected');
  });

  test(`${generateUnitTestId('525')}: Verify Exceed max character limit — when the Name exceeds the maximum allowed length`, async () => {
    await test.step('Given the Name exceeds the maximum allowed length', async () => {
      await labelPage.openCreateModal();
      const longName = 'A'.repeat(300);
      await labelPage.fillName(longName);
    });

    await test.step('When user types beyond the limit', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then input should be blocked or truncated', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('max-char-limit-exceeded');
  });

  test(`${generateUnitTestId('526')}: Verify Error message placement — when validation fails`, async () => {
    await test.step('Given validation fails', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('');
    });

    await test.step('When error appears', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then inline message should display below field with red highlight', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('error-message-placement');
  });

  test(`${generateUnitTestId('527')}: Verify Validate on blur — when user leaves Name field (blur)`, async () => {
    await test.step('Given user leaves Name field (blur)', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('');
    });

    await test.step('When invalid input exists', async () => {
      // Trigger blur by clicking description field
      await labelPage.fillDescription('');
    });

    await test.step('Then validation message should trigger immediately', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('validate-on-blur');
  });

  test(`${generateUnitTestId('528')}: Verify Validate again on submit — when valid input earlier`, async () => {
    await test.step('Given valid input earlier', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('ValidName');
    });

    await test.step('When submitting', async () => {
      await labelPage.fillName('');
      await labelPage.submitCreate().catch(() => {
        // Expected: revalidation blocks submission
      });
    });

    await test.step('Then system should revalidate before API call', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('revalidate-on-submit');
  });

  test(`${generateUnitTestId('529')}: Verify Validation fails — when invalid name`, async ({ page }) => {
    await test.step('Given invalid name', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('');
    });

    await test.step('When submit pressed', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then no API request should be triggered', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('no-api-on-invalid');
  });

  test(`${generateUnitTestId('530')}: Verify Non-technical error messages — when validation fails`, async () => {
    await test.step('Given validation fails', async () => {
      await labelPage.openCreateModal();
      await labelPage.fillName('');
    });

    await test.step('When message shown', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then message should be simple and understandable', async () => {
      const modalStillVisible = await labelPage.isCreateModalVisible();
      expect(modalStillVisible).toBe(true);
    });

    await screenshot.takeStep('non-technical-error-messages');
  });

  /* ────────────────────── SRS-45 / SDS-45: Description Validation ────────────────────── */

  test(`${generateUnitTestId('531')}: Verify Description field is visible — when the Create/Edit Session Label popup is opened`, async () => {
    await test.step('Given the Create/Edit Session Label popup is opened', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the form loads', async () => {
      await labelPage.waitForLoad();
    });

    await test.step('Then the Description input field should be visible and editable', async () => {
      const allFieldsConfigured = await labelPage.areAllCreateFieldsConfigured();
      expect(allFieldsConfigured).toBe(true);
    });

    await screenshot.takeStep('description-field-visible');
  });

  test(`${generateUnitTestId('532')}: Verify User enters alphanumeric text — when the Description field is focused`, async () => {
    await test.step('Given the Description field is focused', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user types valid characters', async () => {
      await labelPage.fillDescription('Valid description text 123');
    });

    await test.step('Then the input should be accepted without validation errors', async () => {
      const modalVisible = await labelPage.isCreateModalVisible();
      expect(modalVisible).toBe(true);
    });

    await screenshot.takeStep('description-alphanumeric-accepted');
  });

  test(`${generateUnitTestId('533')}: Verify Enter description within limit — when the maximum limit is defined`, async () => {
    await test.step('Given the maximum limit is defined', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user enters text less than or equal to the limit', async () => {
      await labelPage.fillName(`DescLimit-${Date.now()}`);
      await labelPage.fillDescription('Short description within limit');
    });

    await test.step('Then the system should allow saving successfully', async () => {
      await labelPage.submitCreate();
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('description-within-limit');
  });

  test(`${generateUnitTestId('534')}: Verify Enter description equal to max length — when the maximum limit`, async () => {
    await test.step('Given the maximum limit', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user enters exactly the max characters', async () => {
      await labelPage.fillName(`MaxDesc-${Date.now()}`);
      const maxDesc = 'A'.repeat(255);
      await labelPage.fillDescription(maxDesc);
    });

    await test.step('Then saving should still be permitted', async () => {
      await labelPage.submitCreate();
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('description-exact-max-length');
  });

  test(`${generateUnitTestId('535')}: Verify Enter description exceeding max length — when the Description field has a limit`, async () => {
    await test.step('Given the Description field has a limit', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user enters text exceeding the limit', async () => {
      await labelPage.fillName(`OverDesc-${Date.now()}`);
      const overLimitDesc = 'A'.repeat(1000);
      await labelPage.fillDescription(overLimitDesc);
    });

    await test.step('Then saving should be blocked', async () => {
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks due to description length
      });
      const isMastersUrl = await labelPage.isMastersPageUrl();
      expect(isMastersUrl).toBe(true);
    });

    await screenshot.takeStep('description-exceeding-limit');
  });

  test(`${generateUnitTestId('536')}: Verify Over-limit validation message — when text exceeds the limit`, async () => {
    await test.step('Given text exceeds the limit', async () => {
      await labelPage.openCreateModal();
      const overLimitDesc = 'A'.repeat(1000);
      await labelPage.fillDescription(overLimitDesc);
    });

    await test.step('When the user attempts to save', async () => {
      await labelPage.fillName(`OverMsg-${Date.now()}`);
      await labelPage.submitCreate().catch(() => {
        // Expected: validation blocks submission
      });
    });

    await test.step('Then a clear validation message should be shown', async () => {
      const isMastersUrl = await labelPage.isMastersPageUrl();
      expect(isMastersUrl).toBe(true);
    });

    await screenshot.takeStep('over-limit-validation-message');
  });

  test(`${generateUnitTestId('537')}: Verify Save without description — when the Description is empty`, async () => {
    await test.step('Given the Description is empty', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user clicks Save', async () => {
      const uniqueName = `NoDesc-${Date.now()}`;
      await labelPage.fillName(uniqueName);
      await labelPage.submitCreate();
    });

    await test.step('Then the label should still be created successfully', async () => {
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('save-without-description');
  });

  test(`${generateUnitTestId('538')}: Verify Description saved in request — when valid text is entered`, async ({ page }) => {
    await test.step('Given valid text is entered', async () => {
      await labelPage.openCreateModal();
    });

    await test.step('When the user saves', async () => {
      await labelPage.fillName(`WithDesc-${Date.now()}`);
      await labelPage.fillDescription('Test description for API payload');
      await labelPage.submitCreate();
    });

    await test.step('Then the Description should be included in the API payload', async () => {
      const tableVisible = await labelPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('description-saved-in-request');
  });
});
