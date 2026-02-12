import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Test Data Setup
 * Creates Epic and Project in database before tests run
 * This ensures navigation from Home → Epic → Project works
 */
async function setupTestData(config: FullConfig) {
  dotenv.config({ path: path.join(__dirname, '../../datavaerese_frontend_&_backend/.env') });

  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const storageStatePath = './playwright/.auth/state.json';

  console.log('🔧 Setting up test data...');
  console.log(`   Base URL: ${baseUrl}`);

  // Check if storage state exists (user should be authenticated)
  if (!fs.existsSync(storageStatePath)) {
    console.error('❌ Authentication state not found. Run global-setup first.');
    throw new Error('No authentication state. Run tests normally to authenticate first.');
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      storageState: storageStatePath,
    });
    const page = await context.newPage();

    // Navigate to home page
    console.log('   📍 Navigating to application...');
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');

    // Check if Epic already exists
    console.log('   🔍 Checking for existing test data...');
    const epicExists = await page.locator('[data-testid="epic-go-button-0"]').count() > 0;

    if (epicExists) {
      console.log('   ✅ Test Epic already exists');

      // Click on first epic to check if project exists
      await page.locator('[data-testid="epic-go-button-0"]').click();
      await page.waitForLoadState('networkidle');

      const projectExists = await page.locator('[data-testid="project-go-button-0"]').count() > 0;

      if (projectExists) {
        console.log('   ✅ Test Project already exists');
        await browser.close();
        console.log('✅ Test data setup complete - using existing data\n');
        return;
      }

      console.log('   ⚠️  No project found - creating one...');
    } else {
      console.log('   ⚠️  No epic found - creating one...');

      // Create Epic
      await page.locator('[data-testid="epic-create-button"]').click();
      await page.waitForSelector('[data-testid="epic-create-modal"]', { state: 'visible' });

      await page.locator('[data-testid="epic-create-name-input"]').fill('E2E Test Epic - Automation');
      await page.locator('[data-testid="epic-create-description-input"]').fill('Epic created automatically for E2E test automation. Safe to delete after tests.');

      await page.locator('[data-testid="epic-create-submit-button"]').click();

      // Wait for success toast
      await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
      console.log('   ✅ Epic created successfully');

      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');

      // Click on the newly created epic
      await page.locator('[data-testid="epic-go-button-0"]').click();
      await page.waitForLoadState('networkidle');
    }

    // Create Project (if we're here, we're on the Epic page and need a project)
    console.log('   📝 Creating test project...');

    await page.locator('[data-testid="project-create-button"]').click();
    await page.waitForSelector('[data-testid="project-create-modal"]', { state: 'visible' });

    await page.locator('[data-testid="project-create-name-input"]').fill('E2E Test Project - Automation');
    await page.locator('[data-testid="project-create-description-input"]').fill('Project created automatically for E2E test automation. Safe to delete after tests.');

    await page.locator('[data-testid="project-create-submit-button"]').click();

    // Wait for success toast
    await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
    console.log('   ✅ Project created successfully');

    await page.waitForTimeout(2000);

    await browser.close();
    console.log('✅ Test data setup complete - Epic and Project ready\n');
  } catch (error: any) {
    console.error('❌ Test data setup failed:', error.message);
    console.error('   This might happen if:');
    console.error('   1. The application is not running');
    console.error('   2. Authentication expired (re-run tests to re-authenticate)');
    console.error('   3. UI selectors changed');
    throw error;
  }
}

export default setupTestData;
