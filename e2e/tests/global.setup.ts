import { test as setup, expect } from '@playwright/test';
import { TestData } from '../test-data/test-data';

/**
 * Global Test Setup
 * Runs once before all tests to ensure Epic and Project exist
 * This setup is executed by the 'setup' project in playwright.config.ts
 */

setup('create test data - Epic and Project', async ({ page }) => {
  console.log('\n🔧 Setting up test data (Epic + Project)...');

  // Navigate to home page
  await page.goto(TestData.urls.homePage);
  await page.waitForLoadState('networkidle');

  // Check if Epic already exists
  const epicExists = await page.locator('[data-testid="epic-go-button-0"]').isVisible({ timeout: 2000 }).catch(() => false);

  if (!epicExists) {
    console.log('   📝 Creating Epic...');

    // Click create epic button
    await page.locator('[data-testid="epic-create-button"]').click();
    await page.waitForSelector('[data-testid="epic-create-modal"]', { state: 'visible' });

    // Fill epic form
    await page.locator('[data-testid="epic-create-name-input"]').fill('E2E Test Epic - Automation');
    await page.locator('[data-testid="epic-create-description-input"]').fill('Epic created automatically for E2E test automation. Safe to delete after tests.');

    // Submit
    await page.locator('[data-testid="epic-create-submit-button"]').click();

    // Wait for success toast
    await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
    console.log('   ✅ Epic created');

    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
  } else {
    console.log('   ✅ Epic already exists');
  }

  // Navigate to Epic page
  await page.locator('[data-testid="epic-go-button-0"]').click();
  await page.waitForLoadState('networkidle');

  // Check if Project already exists
  const projectExists = await page.locator('[data-testid="project-go-button-0"]').isVisible({ timeout: 2000 }).catch(() => false);

  if (!projectExists) {
    console.log('   📝 Creating Project...');

    // Click create project button
    await page.locator('[data-testid="project-create-button"]').click();
    await page.waitForSelector('[data-testid="project-create-modal"]', { state: 'visible' });

    // Fill project form
    await page.locator('[data-testid="project-create-name-input"]').fill('E2E Test Project - Automation');
    await page.locator('[data-testid="project-create-description-input"]').fill('Project created automatically for E2E test automation. Safe to delete after tests.');

    // Submit
    await page.locator('[data-testid="project-create-submit-button"]').click();

    // Wait for success toast
    await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
    console.log('   ✅ Project created');

    await page.waitForTimeout(2000);
  } else {
    console.log('   ✅ Project already exists');
  }

  console.log('✅ Test data setup complete!\n');
});

setup('verify navigation works', async ({ page }) => {
  console.log('🔍 Verifying navigation...');

  // Navigate to home
  await page.goto(TestData.urls.homePage);
  await page.waitForLoadState('networkidle');

  // Should see epic
  const epicButton = page.locator('[data-testid="epic-go-button-0"]');
  await expect(epicButton).toBeVisible({ timeout: 5000 });
  console.log('   ✅ Epic button visible');

  // Navigate to epic
  await epicButton.click();
  await page.waitForLoadState('networkidle');

  // Should see project
  const projectButton = page.locator('[data-testid="project-go-button-0"]');
  await expect(projectButton).toBeVisible({ timeout: 5000 });
  console.log('   ✅ Project button visible');

  // Navigate to project (session page)
  await projectButton.click();
  await page.waitForLoadState('networkidle');

  // Should see session elements
  const sessionTable = page.locator('[data-testid="session-table"]');
  await expect(sessionTable).toBeVisible({ timeout: 5000 });
  console.log('   ✅ Session table visible');

  const createButton = page.locator('[data-testid="session-create-button"]');
  await expect(createButton).toBeVisible({ timeout: 5000 });
  console.log('   ✅ Create button visible');

  console.log('✅ Navigation verification complete!\n');
});
