import { test as setup, expect } from '@playwright/test';
import { TestData } from '../test-data/test-data';
import { EpicSelectors, ProjectSelectors, SessionSelectors, getDynamicSelector } from '../selectors';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Test Setup
 * Runs once before all tests to ensure Epic and Project exist
 * This setup is executed by the 'setup' project in playwright.config.ts
 */

setup('create test data - Epic and Project', async ({ page }) => {
  console.log('\n🔧 Setting up test data (Epic + Project)...');
  const sel = (testId: string) => `[data-testid="${testId}"]`;
  const epicGoSelector = sel(getDynamicSelector(EpicSelectors['epic-go-button-${index}'], { index: 0 }));
  const projectGoSelector = sel(getDynamicSelector(ProjectSelectors['project-go-button-${index}'], { index: 0 }));

  // Navigate to home page
  await page.goto(TestData.urls.homePage);
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(3000); // Extra wait for initial data to load

  // Check if Epic already exists (use generous timeout for slow page loads)
  const epicExists = await page.locator(epicGoSelector).isVisible({ timeout: 10000 }).catch(() => false);

  if (!epicExists) {
    console.log('   📝 Creating Epic...');

    try {
      const createBtn = page.locator(sel(EpicSelectors['epic-create-button']));
      const createBtnVisible = await createBtn.isVisible({ timeout: 5000 }).catch(() => false);

      if (createBtnVisible) {
        await createBtn.click();
        await page.waitForSelector(sel(EpicSelectors['epic-create-modal']), { state: 'visible' });

        // Fill epic form (Naive UI components - target input inside div)
        await page.locator(`${sel(EpicSelectors['epic-create-name-input'])} input`).fill('E2E Test Epic - Automation');
        await page.locator(`${sel(EpicSelectors['epic-create-description-input'])} textarea`).fill('Epic created automatically for E2E test automation. Safe to delete after tests.');

        // Submit
        await page.locator(sel(EpicSelectors['epic-create-submit-button'])).click();

        // Wait for success toast
        await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
        console.log('   ✅ Epic created');

        await page.waitForTimeout(2000);
        await page.waitForLoadState('load');
      } else {
        console.log('   ⚠️  Create Epic button not found — Epic may already exist');
        // Reload and recheck
        await page.reload();
        await page.waitForLoadState('networkidle').catch(() => {});
      }
    } catch (error: any) {
      console.log(`   ⚠️  Epic creation skipped: ${error.message}`);
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1000);
    }
  } else {
    console.log('   ✅ Epic already exists');
  }

  // Navigate to Epic page (re-check for the go button after potential reload)
  const epicGoBtn = page.locator(epicGoSelector);
  if (!(await epicGoBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
  }
  await page.locator(epicGoSelector).click({ timeout: 10000 });
  await page.waitForLoadState('load');

  // Check if Project already exists
  await page.waitForLoadState('networkidle').catch(() => {});
  const projectExists = await page.locator(projectGoSelector).isVisible({ timeout: 10000 }).catch(() => false);

  if (projectExists) {
    console.log('   ✅ Project already exists');
  } else {
    console.log('   📝 Creating Project...');

    try {
      // Click create project button
      await page.locator(sel(ProjectSelectors['project-create-button'])).click();
      await page.waitForSelector(sel(ProjectSelectors['project-create-modal']), { state: 'visible' });

      // Fill project form (Naive UI components - target input inside div)
      await page.locator(`${sel(ProjectSelectors['project-create-name-input'])} input`).fill('E2E Test Project - Automation');
      await page.locator(`${sel(ProjectSelectors['project-create-description-input'])} textarea`).fill('Project created automatically for E2E test automation. Safe to delete after tests.');

      // Wait a moment for form validation
      await page.waitForTimeout(2000);

      // Always try to submit - if it fails, it means Project already exists
      const submitButton = page.locator(sel(ProjectSelectors['project-create-submit-button']));

      try {
        await submitButton.click({ timeout: 5000 });
        await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
        console.log('   ✅ Project created');
        await page.waitForTimeout(2000);
        await page.waitForLoadState('load');
      } catch (clickError) {
        console.log('   ⚠️  Project creation failed (button may be disabled)');
        console.log('   ℹ️  Attempting to close modal and verify Project exists...');

        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);

        // Verify Project button now exists
        const projectNowExists = await page.locator(projectGoSelector).isVisible({ timeout: 2000 }).catch(() => false);

        if (projectNowExists) {
          console.log('   ✅ Project confirmed to exist');
        } else {
          console.error('   ❌ WARNING: No Project found! Tests may fail.');
        }
      }
    } catch (error: any) {
      console.log('   ⚠️  Project creation failed:', error.message);
      // Try to close any open modals
      await page.keyboard.press('Escape').catch(() => {});
    }
  }

  // Cache a stable session list URL for QC workflow navigation.
  try {
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
    const sessionCreateSelector = sel(SessionSelectors['session-create-button']);
    // Navigate through Epic -> Project -> Session list, with text fallback for unstable testids.
    if (await page.locator(epicGoSelector).isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator(epicGoSelector).click();
      await page.waitForLoadState('load');
    }
    if (await page.locator(projectGoSelector).isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator(projectGoSelector).click();
      await page.waitForLoadState('load');
    }
    for (let hop = 0; hop < 3; hop++) {
      const hasSessionCreate = await page.locator(sessionCreateSelector).isVisible({ timeout: 5000 }).catch(() => false);
      if (hasSessionCreate) break;
      const goButtons = page.getByRole('button', { name: 'Go', exact: true });
      if (!(await goButtons.count())) break;
      await goButtons.first().click();
      await page.waitForLoadState('load');
    }
    const hasSessionCreate = await page.locator(sessionCreateSelector).isVisible({ timeout: 10000 }).catch(() => false);
    if (hasSessionCreate) {
      const cacheDir = path.resolve('playwright/.auth');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const sessionUrlPath = path.resolve(cacheDir, 'session-url.txt');
      fs.writeFileSync(sessionUrlPath, page.url(), 'utf8');
      console.log(`   ✅ Cached session URL: ${page.url()}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not cache session URL: ${error.message}`);
  }

  console.log('✅ Test data setup complete!\n');
});

setup('verify navigation works', async ({ page }) => {
  const sel = (testId: string) => `[data-testid="${testId}"]`;
  console.log('🔍 Verifying navigation...');

  // Navigate to home
  await page.goto(TestData.urls.homePage);
  await page.waitForLoadState('load');

  // Should see epic
  const epicButton = page.locator(sel(getDynamicSelector(EpicSelectors['epic-go-button-${index}'], { index: 0 })));
  await expect(epicButton).toBeVisible({ timeout: 15000 });
  console.log('   ✅ Epic button visible');

  // Navigate to epic
  await epicButton.click();
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle').catch(() => {});

  // Should see project
  const projectButton = page.locator(sel(getDynamicSelector(ProjectSelectors['project-go-button-${index}'], { index: 0 })));
  await expect(projectButton).toBeVisible({ timeout: 15000 });
  console.log('   ✅ Project button visible');

  // Navigate to project (session page)
  await projectButton.click();
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2000);

  // Should see session elements
  const sessionTable = page.locator(sel(SessionSelectors['session-table']));
  await expect(sessionTable).toBeVisible({ timeout: 15000 });
  console.log('   ✅ Session table visible');

  const createButton = page.locator(sel(SessionSelectors['session-create-button']));
  await expect(createButton).toBeVisible({ timeout: 10000 });
  console.log('   ✅ Create button visible');

  console.log('✅ Navigation verification complete!\n');
});
