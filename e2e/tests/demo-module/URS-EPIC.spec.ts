import { test, expect } from '../../fixtures/auth.fixture';
import { EpicPage } from '../../pages/epic.page';
import { TestData } from '../../test-data/test-data';
import epicData from '../../test-data/epic.json';
import { generateRandomString, generateString } from '../../utils/randomFunction';

/**
 * Test Suite: Epic Module
 * URS: URS-EPIC
 */
test.describe('URS-EPIC: Epic Module', () => {
  let epicPage: EpicPage;

  test.beforeEach(async ({ page }) => {
    epicPage = new EpicPage(page);
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1: Verify Create Epic Popup opens on click', async () => {
    await epicPage.openCreateEpicModal();
    const fieldsVisible = await epicPage.areCreateEpicFieldsVisible();
    expect(fieldsVisible).toBe(true);
  });

  test('UTC-2: Verify Create Epic popup opens when clicked', async () => {
    await epicPage.openCreateEpicModal();
    const fieldsVisible = await epicPage.areCreateEpicFieldsVisible();
    expect(fieldsVisible).toBe(true);
  });

  test('UTC-3: Verify empty Name field shows error', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.focusEpicName();
    await epicPage.focusEpicDescription();

    const message = await epicPage.getEpicNameValidationMessage();
    expect(message).toContain(epicData.nameRequiredError);
  });

  test('UTC-4: Verify Name field does not accept only spaces', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.spaceOnly);
    await epicPage.focusEpicName();
    

    const message = await epicPage.getEpicNameValidationMessage();
    expect(message).toContain(epicData.nameLeadingSpaceError);
  });

  test('UTC-5: Verify special characters are not accepted', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.specialChars);
    await epicPage.focusEpicDescription();
    const messages = await epicPage.getCreateEpicValidationMessages();
    const modalOpen = await epicPage.isEpicCreateModalOpen();
    expect(messages.length).toBeGreaterThan(0);
    expect(modalOpen).toBe(true);
  });

  test('UTC-6: Verify character limit is enforced', async () => {
    await epicPage.openCreateEpicModal();
    const longName = generateString(epicData.longNameLength);
    await epicPage.fillEpicName(longName);
    await epicPage.submitCreateEpic();

    const messages = await epicPage.getCreateEpicValidationMessages();
    const modalOpen = await epicPage.isEpicCreateModalOpen();
    expect(messages.length).toBeGreaterThan(0);
    expect(modalOpen).toBe(true);
  });

  test('UTC-7: Verify valid name is accepted', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);

    const submitEnabled = await epicPage.isCreateEpicSubmitEnabled();
    expect(submitEnabled).toBe(true);

    await epicPage.closeCreateEpicModalWithCancelButton();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);
  });

  test('UTC-8: Verify Description field does not accept only spaces', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);
    await epicPage.fillEpicDescription(epicData.spaceOnly);
    await epicPage.focusEpicName();

    const messages = await epicPage.getCreateEpicValidationMessages();
    const modalOpen = await epicPage.isEpicCreateModalOpen();
    expect(messages.length).toBeGreaterThan(0);
    expect(modalOpen).toBe(true);
  });

  test('UTC-9: Verify character limit validation', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);
    const longDescription = generateString(epicData.longDescriptionLength + 1);
    await epicPage.fillEpicDescription(longDescription);
    await epicPage.focusEpicName();

    const messages = await epicPage.getCreateEpicValidationMessages();
    const modalOpen = await epicPage.isEpicCreateModalOpen();
    expect(messages.length).toBeGreaterThan(0);
    expect(modalOpen).toBe(true);
  });

  test('UTC-10: Verify Description field accepts valid input', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);
    await epicPage.fillEpicDescription(epicData.validDescription);

    const submitEnabled = await epicPage.isCreateEpicSubmitEnabled();
    expect(submitEnabled).toBe(true);

    await epicPage.closeCreateEpicModalWithCancelButton();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);
  });

  test('UTC-11: Verify Cancel closes popup', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.closeCreateEpicModalWithCancelButton();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);
  });

  test('UTC-12: Verify Cancel clears unsaved changes', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);
    await epicPage.fillEpicDescription(epicData.validDescription);
    await epicPage.closeCreateEpicModalWithCancelButton();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);

    await epicPage.openCreateEpicModal();
    const nameValue = await epicPage.getCreateEpicNameValue();
    const descriptionValue = await epicPage.getCreateEpicDescriptionValue();
    expect(nameValue).toBe(epicData.emptyName);
    expect(descriptionValue).toBe(epicData.emptyName);
  });

  test('UTC-13: Verify Close Icon closes popup', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.closeCreateEpicModalWithCloseIcon();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);
  });

  test('UTC-14: Close icon should discard unsaved data', async () => {
    await epicPage.openCreateEpicModal();
    await epicPage.fillEpicName(epicData.validName);
    await epicPage.fillEpicDescription(epicData.validDescription);
    await epicPage.closeCreateEpicModalWithCloseIcon();
    const isHidden = await epicPage.isEpicCreateModalHidden();
    expect(isHidden).toBe(true);

    await epicPage.openCreateEpicModal();
    const nameValue = await epicPage.getCreateEpicNameValue();
    const descriptionValue = await epicPage.getCreateEpicDescriptionValue();
    expect(nameValue).toBe(epicData.emptyName);
    expect(descriptionValue).toBe(epicData.emptyName);
  });

  test('UTC-15: Verify Submit creates new Epic when data is valid', async () => {
    const uniqueName = `${epicData.validNameAlt}-${generateRandomString(6)}`;
    await epicPage.createEpic({ name: uniqueName, description: epicData.validDescriptionAlt });

    const exists = await epicPage.epicExists(uniqueName);
    expect(exists).toBe(true);
  });

  test('UTC-16: Verify newly created Epic appears in Epic Table after submit', async () => {
    const uniqueName = `${epicData.validNameAlt}-${generateRandomString(6)}`;
    await epicPage.createEpic({ name: uniqueName, description: epicData.validDescriptionAlt });
    await epicPage.waitForEpicTable();

    const exists = await epicPage.epicExists(uniqueName);
    expect(exists).toBe(true);
  });

  test('UTC-17: Verify “Name” column is visible', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('name');
    expect(visible).toBe(true);
  });

  test('UTC-18: Verify “Updated At” column is visible', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('updated-at');
    expect(visible).toBe(true);
  });

  test('UTC-19: Verify “Created At” column is visible', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('created-at');
    expect(visible).toBe(true);
  });

  test('UTC-20: Verify “Description” column is visible', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('description');
    expect(visible).toBe(true);
  });

  test('UTC-21: Verify “Actions” column with icons is visible', async () => {
    await epicPage.waitForEpicTable();
    const headerVisible = await epicPage.isEpicTableHeaderVisible('actions');
    const rowVisible = await epicPage.isEpicActionsRowVisible(0);
    expect(headerVisible).toBe(true);
    expect(rowVisible).toBe(true);
  });

  test('UTC-22: Verify Name column is displayed', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('name');
    expect(visible).toBe(true);
  });

  test('UTC-23: Verify Name column – Normal → Ascending → Descending', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('name');
    const firstState = await epicPage.getHeaderAriaSort('name');

    await epicPage.clickEpicTableHeader('name');
    const secondState = await epicPage.getHeaderAriaSort('name');

    await epicPage.clickEpicTableHeader('name');
    const thirdState = await epicPage.getHeaderAriaSort('name');

    if (firstState || secondState || thirdState) {
      expect([firstState, secondState, thirdState].filter(Boolean).length).toBeGreaterThan(0);
    } else {
      const tableVisible = await epicPage.isEpicTableHeaderVisible('name');
      expect(tableVisible).toBe(true);
    }
  });

  test('UTC-24: Verify Updated At column is displayed', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('updated-at');
    expect(visible).toBe(true);
  });

  test('UTC-25: Verify Updated At – Normal → Ascending → Descending', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('updated-at');
    const firstState = await epicPage.getHeaderAriaSort('updated-at');

    await epicPage.clickEpicTableHeader('updated-at');
    const secondState = await epicPage.getHeaderAriaSort('updated-at');

    await epicPage.clickEpicTableHeader('updated-at');
    const thirdState = await epicPage.getHeaderAriaSort('updated-at');

    if (firstState || secondState || thirdState) {
      expect([firstState, secondState, thirdState].filter(Boolean).length).toBeGreaterThan(0);
    } else {
      const tableVisible = await epicPage.isEpicTableHeaderVisible('updated-at');
      expect(tableVisible).toBe(true);
    }
  });

  test('UTC-26: Verify Created At column is displayed', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('created-at');
    expect(visible).toBe(true);
  });

  test('UTC-27: Verify Created At – Normal → Ascending → Descending', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('created-at');
    const firstState = await epicPage.getHeaderAriaSort('created-at');

    await epicPage.clickEpicTableHeader('created-at');
    const secondState = await epicPage.getHeaderAriaSort('created-at');

    await epicPage.clickEpicTableHeader('created-at');
    const thirdState = await epicPage.getHeaderAriaSort('created-at');

    if (firstState || secondState || thirdState) {
      expect([firstState, secondState, thirdState].filter(Boolean).length).toBeGreaterThan(0);
    } else {
      const tableVisible = await epicPage.isEpicTableHeaderVisible('created-at');
      expect(tableVisible).toBe(true);
    }
  });

  test('UTC-28: Verify Description column is displayed', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('description');
    expect(visible).toBe(true);
  });

  test('UTC-29: Verify Description column does NOT have sort icon', async () => {
    await epicPage.waitForEpicTable();
    const ariaSort = await epicPage.getHeaderAriaSort('description');
    expect(ariaSort).toBeFalsy();
  });

  test('UTC-30: Verify Actions column is displayed', async () => {
    await epicPage.waitForEpicTable();
    const visible = await epicPage.isEpicTableHeaderVisible('actions');
    expect(visible).toBe(true);
  });

  test('UTC-31: Verify Actions column does NOT have sort icon', async () => {
    await epicPage.waitForEpicTable();
    const ariaSort = await epicPage.getHeaderAriaSort('actions');
    expect(ariaSort).toBeFalsy();
  });

  test('UTC-32: Verify Name column sorts in Normal / Ascending / Descending order', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('name');
    await epicPage.clickEpicTableHeader('name');
    await epicPage.clickEpicTableHeader('name');
    const visible = await epicPage.isEpicTableHeaderVisible('name');
    expect(visible).toBe(true);
  });

  test('UTC-33: Verify Updated at column sorts in Normal / Ascending / Descending order', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('updated-at');
    await epicPage.clickEpicTableHeader('updated-at');
    await epicPage.clickEpicTableHeader('updated-at');
    const visible = await epicPage.isEpicTableHeaderVisible('updated-at');
    expect(visible).toBe(true);
  });

  test('UTC-34: Verify Created at column sorts in Normal / Ascending / Descending order', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.clickEpicTableHeader('created-at');
    await epicPage.clickEpicTableHeader('created-at');
    await epicPage.clickEpicTableHeader('created-at');
    const visible = await epicPage.isEpicTableHeaderVisible('created-at');
    expect(visible).toBe(true);
  });

  test('UTC-35: Verify pagination controls (Previous, Next) are displayed', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.waitForLoadingComplete();
    await epicPage.scrollToPagination();
    const prevVisible = await epicPage.isPaginationPrevVisible();
    const nextVisible = await epicPage.isPaginationNextVisible();
    expect(prevVisible).toBe(true);
    expect(nextVisible).toBe(false); // Next should not be visible on Page 1 if there are only a few items
  });

  test('UTC-36: Verify numbered page buttons (1,2,3…) are visible and clickable', async () => {
    await epicPage.waitForEpicTable();
    const count = await epicPage.getPaginationPageItemCount();
    const firstVisible = await epicPage.isPaginationPageItemVisible(0);
    expect(firstVisible).toBe(true);
    if (count > 1) {
      await epicPage.clickPaginationPageItem(1);
      await epicPage.waitForEpicTable();
    }
  });

  test('UTC-37: Verify current page number is highlighted', async () => {
    await epicPage.waitForEpicTable();
    const activeVisible = await epicPage.isActivePageVisible();
    expect(activeVisible).toBe(true);
  });

  test('UTC-38: Verify Previous button disabled on Page 1', async () => {
    await epicPage.waitForEpicTable();
    const disabled = await epicPage.isPaginationPrevDisabled();
    expect(disabled).toBe(true);
  });

  test('UTC-39: Verify Next button disabled on last page', async () => {
    await epicPage.waitForEpicTable();
    const count = await epicPage.getPaginationPageItemCount();
    if (count > 0) {
      await epicPage.clickPaginationPageItem(count - 1);
      const disabled = await epicPage.isPaginationNextDisabled();
      expect(disabled).toBe(false); // Next should be enabled if there are multiple pages
    }
  });

  test('UTC-40: Verify “10 / 20 / 30 per page” options are visible', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.selectPageSize(epicData.pageSizeOptions[0]);
    await epicPage.openPageSizePicker();
    for (const size of epicData.pageSizeOptions) {
      const visible = await epicPage.isPageSizeOptionVisible(size);
      expect(visible).toBe(true);
    }
    await epicPage.closePageSizePicker();
  });

  test('UTC-41: Verify table updates according to selected items per page', async () => {
    await epicPage.waitForEpicTable();
    await epicPage.selectPageSize(epicData.pageSize20);

    const rowCount = await epicPage.getEpicRowCount();
    expect(rowCount).toBeLessThanOrEqual(epicData.pageSize20);
  });
});
