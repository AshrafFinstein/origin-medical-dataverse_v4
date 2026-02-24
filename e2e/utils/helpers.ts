import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { QcWorkflowPage } from '../pages/qc-workflow.page';
import { LockPermissionData, RolePermissionsPage } from '../pages/masters/role-permissions.page';
import { SessionLockPage } from '../pages/session-lock.page';
import TestData from '../test-data/test-data';

export type Credentials = {
  email: string;
  password: string;
};

export type PermissionChangeData = LockPermissionData & {
  updatedUserCredentials?: Credentials;
};

export async function loginToApplication(
  page: Page,
  credentials: Credentials = TestData.testUsers.admin
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.performLogin(credentials.email, credentials.password, TestData.baseUrl);
}

export async function logoutFromApplication(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.logout();
}

export async function navigateToModule(page: Page): Promise<void> {
  const qcPage = new QcWorkflowPage(page);
  await qcPage.gotoSessionList();
}

export async function navigateToSessionListOnly(page: Page): Promise<void> {
  const qcPage = new QcWorkflowPage(page);
  await qcPage.gotoSessionListOnly();
}

export async function changeUserPermission(page: Page, permissionData: PermissionChangeData): Promise<void> {
  await loginToApplication(page, permissionData.updatedUserCredentials ?? TestData.testUsers.admin);
  const rolePermissionsPage = new RolePermissionsPage(page);
  await rolePermissionsPage.setLockPermissionForRole({
    roleName: permissionData.roleName,
    enabled: permissionData.enabled,
  });
}

export async function verifySessionLockPermissionChecked(
  page: Page,
  permissionData: PermissionChangeData
): Promise<void> {
  const rolePermissionsPage = new RolePermissionsPage(page);
  const isChecked = await rolePermissionsPage.isSessionLockPermissionChecked(permissionData.roleName);
  await expect(isChecked).toBe(true);
}

export async function verifySessionLockPermissionUnchecked(
  page: Page,
  permissionData: PermissionChangeData
): Promise<void> {
  await loginToApplication(page, permissionData.updatedUserCredentials ?? TestData.testUsers.admin);
  const rolePermissionsPage = new RolePermissionsPage(page);
  const isChecked = await rolePermissionsPage.isSessionLockPermissionChecked(permissionData.roleName);
  await expect(isChecked).toBe(false);
}

export async function setSessionLockPermissionAndVerify(
  page: Page,
  permissionData: PermissionChangeData
): Promise<void> {
  await navigateToModule(page);
  const sessionLockPage = new SessionLockPage(page);
  await sessionLockPage.waitForSessionList();
  await expect(sessionLockPage.completedSessionRowLocator()).toBeVisible();

  const lockIcon = sessionLockPage.lockIconForCompletedSessionLocator();
  if (permissionData.enabled) {
    await expect(lockIcon).toBeVisible();
  } else {
    await expect(lockIcon).toBeHidden();
  }
}
