import { test, expect } from '@playwright/test';
import { reloginAndPersistSession, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { RolePermissionsPage } from '../../../../pages/masters/role-permissions.page';
import { UserRolesPage } from '../../../../pages/user-roles.page';
import TestData from '../../../../test-data/test-data';

const lockReason = 'Automation lock reason';
const enableLockPermission = {
  roleName: 'Admin',
  enabled: true,
  updatedUserCredentials: TestData.testUsers.admin,
};
const disableLockPermission = {
  roleName: 'Admin',
  enabled: false,
  updatedUserCredentials: TestData.testUsers.admin,
};

test.describe('SRS-253 - SDS-253', () => {
test('UTC-2639: Verify Lock icon is visible when Lock permission is enabled in role when the admin enables "Lock" permission in Masters -> User Roles -> Session for the logged-in user role', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(true);
    if (changed) {
        await reloginAndPersistSession(page);
    }
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await expect(sessionLockPage.completedSessionRowLocator()).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedSessionLocator()).toBeVisible();
});

  test('UTC-2640: Verify Lock icon is hidden when Lock permission is disabled in role when the admin disables "Lock" permission in Masters -> User Roles -> Session for the logged-in user role', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(false);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await expect(sessionLockPage.completedSessionRowLocator()).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedSessionLocator()).toBeHidden({ timeout: 10000 });
  });

  test('UTC-2641: Verify unauthorized user cannot access Lock Session popup when the user role does not have Lock permission enabled', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(false);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    const opened = await sessionLockPage.openLockModalIfVisible();
    expect(opened).toBe(false);
    await expect(sessionLockPage.lockModalLocator()).toBeHidden();
  });

  test('UTC-2642: Verify Lock icon visibility updates after permission change when the user is logged in with a role where Lock permission is disabled', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);

    const disabled = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isDisabled = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isDisabled).toBe(false);

    if (disabled) {
      await reloginAndPersistSession(page);
    }

    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const enabled = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isEnabled = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isEnabled).toBe(true);

    if (enabled) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await expect(sessionLockPage.completedSessionRowLocator()).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedSessionLocator()).toBeVisible({ timeout: 10000 });
  });

  test('UTC-2643: Verify lock action is rejected even if API is triggered without permission when the user does not have Lock permission', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(false);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    const opened = await sessionLockPage.openLockModalIfVisible();
    expect(opened).toBe(false);
    await expect(sessionLockPage.lockModalLocator()).toBeHidden();
    await expect(sessionLockPage.lockButtonLocator()).toBeHidden();
    await expect(sessionLockPage.unlockButtonLocator()).toBeHidden();
  });

  test('UTC-2644: Verify Unlock action is visible only if Lock permission exists when the user role has Lock permission enabled', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(true);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    await sessionLockPage.lockSession(lockReason);
    await expect(sessionLockPage.unlockButtonLocator()).toBeVisible();
  });

  test('UTC-2645: Verify Unlock action is hidden when Lock permission is removed when a session is locked', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const enabled = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(true);

    if (enabled) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await sessionLockPage.lockSession(lockReason);

    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const disabled = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isDisabled = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isDisabled).toBe(false);

    if (disabled) {
      await reloginAndPersistSession(page);
    }

    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await expect(sessionLockPage.unlockButtonLocator()).toBeHidden();
  });

  test('UTC-2646: Verify unauthorized user cannot unlock a locked session when a session is locked', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const enabled = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(true);

    if (enabled) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();
    await sessionLockPage.lockSession(lockReason);

    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const disabled = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isDisabled = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isDisabled).toBe(false);

    if (disabled) {
      await reloginAndPersistSession(page);
    }

    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    const opened = await sessionLockPage.openUnlockModalIfVisible();
    expect(opened).toBe(false);
    await expect(sessionLockPage.unlockModalLocator()).toBeHidden();
  });

  test('UTC-2647: Verify authorized user can lock and unlock session successfully when the user role has Lock permission enabled', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(enableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(true);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(true);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    await sessionLockPage.lockSession(lockReason);
    await expect(sessionLockPage.unlockButtonLocator()).toBeVisible();

    await sessionLockPage.unlockSession(lockReason);
    await expect(sessionLockPage.lockButtonLocator()).toBeVisible();
  });

  test('UTC-2648: Verify lock controls are fully hidden when permission is not granted when Lock permission is disabled for the role', async ({ page }) => {
    const userRolesPage = new UserRolesPage(page);
    await userRolesPage.navigateToUserRoles();
    await userRolesPage.openEditRole(disableLockPermission.roleName);
    await userRolesPage.openPermissionsTab();
    const rolePermissionsPage = new RolePermissionsPage(page);
    const changed = await rolePermissionsPage.setSessionLockInCurrentModal(false);
    const isChecked = await rolePermissionsPage.isSessionLockCheckedInCurrentModal();
    await expect(isChecked).toBe(false);

    if (changed) {
      await reloginAndPersistSession(page);
    }

    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollLockIconIntoView();

    await expect(sessionLockPage.lockIconForCompletedSessionLocator()).toBeHidden({ timeout: 10000 });
    await expect(sessionLockPage.lockButtonLocator()).toBeHidden();
    await expect(sessionLockPage.unlockButtonLocator()).toBeHidden();
  });
});

