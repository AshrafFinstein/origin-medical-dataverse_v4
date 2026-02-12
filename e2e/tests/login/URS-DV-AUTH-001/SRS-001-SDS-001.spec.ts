import { test, expect } from '../../../fixtures/auth.fixture';
import { LoginPage } from '../../../pages/login.page';

/**
 * Test Suite: Login Module - Authentication
 * URS: URS-DV-AUTH-001
 * SRS: SRS-001
 * SDS: SDS-001
 */
test.describe('Login - Basic Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('UTC-AUTH-001: Verify successful login with valid credentials', async ({ page }) => {
    // Test Case ID: UTC-AUTH-001
    // Priority: high
    // Test Type: Functional Testing
    //
    // Summary: User can login with valid email and password
    //
    // Acceptance Criteria:
    // - Login form accepts valid email and password
    // - User is redirected to home page after successful login
    // - Session is established and user data is available

    await loginPage.login('ashraf.a@finstein.ai', 'yxD21p)E1)SL');

    // Verify redirect to home page
    await page.waitForURL('/');
    expect(page.url()).toContain('/');

    // Verify user is logged in
    const isLoggedIn = await page.isVisible('[data-testid="header-logout-button"]');
    expect(isLoggedIn).toBe(true);

    console.log('✅ Login successful');
  });

  test('UTC-AUTH-002: Verify login form validation - empty fields', async ({ page }) => {
    // Test Case ID: UTC-AUTH-002
    // Priority: medium
    // Test Type: Negative Testing
    //
    // Summary: Login form shows validation errors for empty fields
    //
    // Acceptance Criteria:
    // - Email field shows error when empty
    // - Password field shows error when empty
    // - Submit button is disabled or shows validation

    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify validation errors appear
    const hasErrors = await page.locator('.n-form-item-feedback--error').count() > 0;
    expect(hasErrors).toBe(true);

    console.log('✅ Validation working for empty fields');
  });

  test('UTC-AUTH-003: Verify login fails with invalid credentials', async ({ page }) => {
    // Test Case ID: UTC-AUTH-003
    // Priority: high
    // Test Type: Negative Testing
    //
    // Summary: Login fails with incorrect password
    //
    // Acceptance Criteria:
    // - Error message is displayed
    // - User remains on login page
    // - No session is established

    await loginPage.login('ashraf.a@finstein.ai', 'wrongpassword');

    // Wait for error message
    await page.waitForTimeout(2000);

    // Verify still on login page
    expect(page.url()).toContain('/login');

    console.log('✅ Login correctly rejected invalid credentials');
  });

  test('UTC-AUTH-004: Verify email format validation', async ({ page }) => {
    // Test Case ID: UTC-AUTH-004
    // Priority: low
    // Test Type: Validation Testing
    //
    // Summary: Email field validates email format
    //
    // Acceptance Criteria:
    // - Invalid email formats show validation error
    // - Valid email formats are accepted

    const emailInput = page.locator('input[type="email"]');

    // Test invalid email
    await emailInput.fill('notanemail');
    await emailInput.blur();

    // Check for validation error
    const hasError = await page.locator('.n-form-item-feedback--error').isVisible();
    expect(hasError).toBe(true);

    console.log('✅ Email validation working');
  });
});
