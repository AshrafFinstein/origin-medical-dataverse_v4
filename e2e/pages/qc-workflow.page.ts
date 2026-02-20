import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { QcWorkflowSelectors } from '../selectors';
import { QcWorkflowData, SiteResources } from '../test-data';

// ── Selector bindings (flat data-testid values) ────────────────────────────────

const {
  'qc-approval-add-level-button': qcApprovalAddLevelButton,
  'qc-approval-remove-level-button': qcApprovalRemoveLevelButton,
  'qc-approval-level-field': qcApprovalLevelField,
  'qc-approval-level-item': qcApprovalLevelItem,
  'qc-action-send-to-qc-button': qcActionSendToQcButton,
  'qc-action-accept-button': qcActionAcceptButton,
  'qc-action-reject-button': qcActionRejectButton,
  'qc-image-grid': qcImageGrid,
  'qc-image-card': qcImageCard,
  'qc-image-status-badge': qcImageStatusBadge,
  'qc-image-level-indicator': qcImageLevelIndicator,
  'qc-image-no-images-message': qcImageNoImagesMessage,
  'qc-stage-label': qcStageLabel,
  'qc-stage-assignee-name': qcStageAssigneeName,
  'qc-stage-approval-level-display': qcStageApprovalLevelDisplay,
  'qc-stage-awaiting-approval-checkbox': qcStageAwaitingApprovalCheckbox,
  'qc-tools-zoom-in': qcToolsZoomIn,
  'qc-tools-zoom-out': qcToolsZoomOut,
  'qc-tools-reset-zoom': qcToolsResetZoom,
  'qc-tools-rotate-clockwise': qcToolsRotateClockwise,
  'qc-tools-flip': qcToolsFlip,
  'qc-tools-brightness-slider': qcToolsBrightnessSlider,
  'qc-tools-contrast-slider': qcToolsContrastSlider,
  'qc-tools-pen': qcToolsPen,
  'qc-status-dropdown': qcStatusDropdown,
  'qc-status-option': qcStatusOption,
  'dl-annotation-button': dlAnnotationButton,
  'dl-invert-color-checkbox': dlInvertColorCheckbox,
  'dl-unsaved-before-qc-modal': dlUnsavedBeforeQcModal,
  'dl-unsaved-before-qc-dont-save-button': dlUnsavedBeforeQcDontSaveButton,
  'dl-unsaved-before-qc-save-button': dlUnsavedBeforeQcSaveButton,
  'session-create-button': sessionCreateButton,
  'session-create-modal': sessionCreateModal,
  'session-reviewers-select': sessionReviewersSelect,
  'session-reviewers-select-all': sessionReviewersSelectAll,
  'session-breadcrumb': sessionBreadcrumb,
  'session-table': sessionTable,
} = QcWorkflowSelectors;

// ── Test-data bindings ──────────────────────────────────────────────────────────

const {
  approvalLevels,
  imageStatuses,
  statusDisplayFormats,
  stageLabels,
  errorMessages,
  successMessages,
  noImagesMessage,
  expectedTools,
  performance: perfData,
  usabilityLabels,
  tooltips,
  accessControl,
} = QcWorkflowData;

const { urlPatterns } = SiteResources;

// ── Helper: build data-testid selector from value ───────────────────────────────

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class QcWorkflowPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigateToCreateSession(): Promise<void> {
    const sessionUrl = process.env.QC_SESSION_URL || process.env.DL_SESSION_URL;
    await this.goto(sessionUrl || '/');
    await this.click(tid(sessionCreateButton));
    await this.waitForSelector(tid(sessionCreateModal), { state: 'visible' });
  }

  async navigateToDataLabelling(): Promise<void> {
    const dlUrl = process.env.DL_SESSION_URL || urlPatterns.dataLabelling;
    await this.goto(dlUrl);
    await this.waitForPageLoad();
  }

  async gotoSession(): Promise<void> {
    const sessionUrl = process.env.QC_SESSION_URL || process.env.DL_SESSION_URL;
    await this.goto(sessionUrl || '/');
    await this.waitForPageLoad();
  }

  async gotoSessionList(): Promise<void> {
    const projectUrl = process.env.PROJECT_URL || urlPatterns.project;
    await this.goto(projectUrl);
    await this.waitForPageLoad();
  }

  // ── SRS-1: Approval Level Configuration ─────────────────────────────────────

  async isAddLevelButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(qcApprovalAddLevelButton));
  }

  async isApprovalLevelFieldHidden(): Promise<boolean> {
    return this.isHidden(tid(qcApprovalLevelField));
  }

  async isApprovalLevelFieldVisible(): Promise<boolean> {
    return this.isVisible(tid(qcApprovalLevelField));
  }

  async clickAddLevel(): Promise<void> {
    await this.click(tid(qcApprovalAddLevelButton));
    await this.waitForPageLoad();
  }

  async addApprovalLevels(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.clickAddLevel();
    }
  }

  async getApprovalLevelCount(): Promise<number> {
    return this.getCount(tid(qcApprovalLevelItem));
  }

  async getMaxApprovalLevels(): number {
    return approvalLevels.maximum;
  }

  async isAddLevelButtonDisabled(): Promise<boolean> {
    return this.isDisabled(tid(qcApprovalAddLevelButton));
  }

  async removeApprovalLevel(index: number): Promise<void> {
    const items = this.getLocator(tid(qcApprovalRemoveLevelButton));
    await items.nth(index).click();
    await this.waitForPageLoad();
  }

  async clickCreateSession(): Promise<void> {
    await this.click(tid(sessionCreateButton));
    await this.waitForPageLoad();
  }

  async selectUsersForLevel(levelIndex: number): Promise<void> {
    const levelFields = this.getLocator(tid(qcApprovalLevelField));
    await levelFields.nth(levelIndex).click();
    await this.waitForPageLoad();
  }

  async selectReviewers(): Promise<void> {
    await this.click(tid(sessionReviewersSelect));
    await this.waitForPageLoad();
  }

  async selectAllReviewers(): Promise<void> {
    await this.click(tid(sessionReviewersSelectAll));
    await this.waitForPageLoad();
  }

  async isDuplicateUserWarningVisible(): Promise<boolean> {
    const toastMsg = await this.getToastMessage('error');
    return toastMsg.includes(errorMessages.duplicateUser);
  }

  async verifyEmptyApprovalLevelError(): Promise<string> {
    return this.getToastMessage('error');
  }

  async getExpectedEmptyApprovalLevelError(): string {
    return errorMessages.emptyApprovalLevel;
  }

  async verifySessionCreatedSuccess(): Promise<string> {
    return this.getToastMessage('success');
  }

  async getExpectedSessionCreatedMessage(): string {
    return successMessages.sessionCreated;
  }

  // ── SRS-2: Status Dropdown & Image Tools ────────────────────────────────────

  async openStatusDropdown(): Promise<void> {
    await this.click(tid(qcStatusDropdown));
    await this.waitForPageLoad();
  }

  async getStatusOptions(): Promise<string[]> {
    const options = this.getLocator(tid(qcStatusOption));
    const count = await options.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  async getExpectedStatuses(): string[] {
    return [
      imageStatuses.pending,
      imageStatuses.inReview,
      imageStatuses.accepted,
      imageStatuses.rejected,
    ];
  }

  async selectStatus(status: string): Promise<void> {
    await this.openStatusDropdown();
    await this.selectOption(tid(qcStatusDropdown), status);
    await this.waitForPageLoad();
  }

  async getFilteredImageCount(): Promise<number> {
    return this.getCount(tid(qcImageCard));
  }

  async isNoImagesMessageVisible(): Promise<boolean> {
    return this.isVisible(tid(qcImageNoImagesMessage));
  }

  async getNoImagesMessageText(): string {
    return noImagesMessage;
  }

  async selectImageByIndex(index: number): Promise<void> {
    const cards = this.getLocator(tid(qcImageCard));
    await cards.nth(index).click();
    await this.waitForPageLoad();
  }

  async selectPendingImage(): Promise<void> {
    await this.selectStatus(imageStatuses.pending);
    await this.selectImageByIndex(0);
  }

  async isAnnotationButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(dlAnnotationButton));
  }

  async isInvertColorCheckboxVisible(): Promise<boolean> {
    return this.isVisible(tid(dlInvertColorCheckbox));
  }

  async isZoomInVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsZoomIn));
  }

  async isZoomOutVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsZoomOut));
  }

  async isResetZoomVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsResetZoom));
  }

  async isRotateClockwiseVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsRotateClockwise));
  }

  async isFlipVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsFlip));
  }

  async isPenVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsPen));
  }

  async isBrightnessSliderVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsBrightnessSlider));
  }

  async isContrastSliderVisible(): Promise<boolean> {
    return this.isVisible(tid(qcToolsContrastSlider));
  }

  async clickAnnotationButton(): Promise<void> {
    await this.click(tid(dlAnnotationButton));
    await this.waitForPageLoad();
  }

  async isCanvasVisible(): Promise<boolean> {
    return this.isVisible('canvas');
  }

  async toggleInvertColor(): Promise<void> {
    const checkbox = tid(dlInvertColorCheckbox);
    const checked = await this.isChecked(checkbox);
    if (checked) {
      await this.uncheck(checkbox);
    } else {
      await this.check(checkbox);
    }
  }

  async isInvertColorChecked(): Promise<boolean> {
    return this.isChecked(tid(dlInvertColorCheckbox));
  }

  async clickZoomIn(): Promise<void> {
    await this.click(tid(qcToolsZoomIn));
  }

  async clickZoomOut(): Promise<void> {
    await this.click(tid(qcToolsZoomOut));
  }

  async clickResetZoom(): Promise<void> {
    await this.click(tid(qcToolsResetZoom));
  }

  async clickRotateClockwise(): Promise<void> {
    await this.click(tid(qcToolsRotateClockwise));
  }

  async clickFlip(): Promise<void> {
    await this.click(tid(qcToolsFlip));
  }

  async adjustBrightness(value: string): Promise<void> {
    await this.fill(tid(qcToolsBrightnessSlider), value);
  }

  async adjustContrast(value: string): Promise<void> {
    await this.fill(tid(qcToolsContrastSlider), value);
  }

  async areEditActionsEnabled(): Promise<boolean> {
    const annotationEnabled = await this.isEnabled(tid(dlAnnotationButton));
    const zoomInEnabled = await this.isEnabled(tid(qcToolsZoomIn));
    return annotationEnabled && zoomInEnabled;
  }

  async areEditActionsDisabled(): Promise<boolean> {
    const annotationDisabled = await this.isDisabled(tid(dlAnnotationButton));
    const zoomInDisabled = await this.isDisabled(tid(qcToolsZoomIn));
    return annotationDisabled && zoomInDisabled;
  }

  // ── SRS-3: Send to QC ──────────────────────────────────────────────────────

  async isSendToQcButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(qcActionSendToQcButton));
  }

  async isSendToQcButtonEnabled(): Promise<boolean> {
    return this.isEnabled(tid(qcActionSendToQcButton));
  }

  async clickSendToQc(): Promise<void> {
    await this.click(tid(qcActionSendToQcButton));
    await this.waitForPageLoad();
  }

  async saveAndSendForQc(): Promise<void> {
    await this.waitForSelector(tid(dlUnsavedBeforeQcModal), { state: 'visible' });
    await this.click(tid(dlUnsavedBeforeQcSaveButton));
    await this.waitForPageLoad();
  }

  async discardAndSendForQc(): Promise<void> {
    await this.waitForSelector(tid(dlUnsavedBeforeQcModal), { state: 'visible' });
    await this.click(tid(dlUnsavedBeforeQcDontSaveButton));
    await this.waitForPageLoad();
  }

  async getImageStatusBadgeText(index: number = 0): Promise<string> {
    const badges = this.getLocator(tid(qcImageStatusBadge));
    return (await badges.nth(index).textContent()) || '';
  }

  async getExpectedPendingStatus(): string {
    return imageStatuses.pending;
  }

  async getExpectedInReviewStatus(): string {
    return imageStatuses.inReview;
  }

  async getExpectedAcceptedStatus(): string {
    return imageStatuses.accepted;
  }

  async getExpectedRejectedStatus(): string {
    return imageStatuses.rejected;
  }

  async isLevelIndicatorVisible(): Promise<boolean> {
    return this.isVisible(tid(qcImageLevelIndicator));
  }

  async getImageLevelLabel(index: number = 0): Promise<string> {
    const indicators = this.getLocator(tid(qcImageLevelIndicator));
    return (await indicators.nth(index).textContent()) || '';
  }

  async getExpectedInReviewLevelLabel(level: number): string {
    return statusDisplayFormats.inReviewWithLevel.replace('{level}', String(level));
  }

  async getExpectedRejectedLevelLabel(level: number): string {
    return statusDisplayFormats.rejectedWithLevel.replace('{level}', String(level));
  }

  async isImageInFilteredList(): Promise<boolean> {
    const count = await this.getFilteredImageCount();
    return count > 0;
  }

  // ── SRS-4 / SRS-5 / SRS-6 / SRS-7: QC Review Actions ──────────────────────

  async getStageLabel(): Promise<string> {
    return this.getText(tid(qcStageLabel));
  }

  async getExpectedQualityCheckerLabel(): string {
    return stageLabels.qualityChecker;
  }

  async getAssigneeName(): Promise<string> {
    return this.getText(tid(qcStageAssigneeName));
  }

  async getApprovalLevelDisplay(): Promise<string> {
    return this.getText(tid(qcStageApprovalLevelDisplay));
  }

  async getExpectedApprovalLevels(): string[] {
    return approvalLevels.levels;
  }

  async getDefaultStatusFilter(): Promise<string> {
    return this.getValue(tid(qcStatusDropdown));
  }

  async isAwaitingApprovalChecked(): Promise<boolean> {
    return this.isChecked(tid(qcStageAwaitingApprovalCheckbox));
  }

  async isAcceptButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(qcActionAcceptButton));
  }

  async isRejectButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(qcActionRejectButton));
  }

  async isAcceptButtonEnabled(): Promise<boolean> {
    return this.isEnabled(tid(qcActionAcceptButton));
  }

  async isRejectButtonEnabled(): Promise<boolean> {
    return this.isEnabled(tid(qcActionRejectButton));
  }

  async clickAccept(): Promise<void> {
    await this.click(tid(qcActionAcceptButton));
    await this.waitForPageLoad();
  }

  async clickReject(): Promise<void> {
    await this.click(tid(qcActionRejectButton));
    await this.waitForPageLoad();
  }

  // ── SRS-8: Access Control ───────────────────────────────────────────────────

  async getAccessControlEditRestrictedMessage(): string {
    return accessControl.editRestrictedMessage;
  }

  async getAccessControlUnauthorizedMessage(): string {
    return accessControl.unauthorizedMessage;
  }

  // ── SRS-9: Performance ──────────────────────────────────────────────────────

  async measurePageLoadTime(): Promise<number> {
    const start = Date.now();
    await this.waitForPageLoad();
    return Date.now() - start;
  }

  async getMaxLoadTimeMs(): number {
    return perfData.maxLoadTimeMs;
  }

  async getMaxActionDelayMs(): number {
    return perfData.maxActionDelayMs;
  }

  async measureActionResponseTime(action: () => Promise<void>): Promise<number> {
    const start = Date.now();
    await action();
    return Date.now() - start;
  }

  async isLoadingIndicatorNonBlocking(): Promise<boolean> {
    const isPageInteractable = await this.isEnabled(tid(qcImageGrid));
    return isPageInteractable;
  }

  // ── SRS-10: Usability ───────────────────────────────────────────────────────

  async areStatusLabelsVisible(): Promise<boolean> {
    const badges = this.getLocator(tid(qcImageStatusBadge));
    const count = await badges.count();
    return count > 0;
  }

  async areLevelIndicatorsVisible(): Promise<boolean> {
    const indicators = this.getLocator(tid(qcImageLevelIndicator));
    const count = await indicators.count();
    return count > 0;
  }

  async isBreadcrumbVisible(): Promise<boolean> {
    return this.isVisible(tid(sessionBreadcrumb));
  }

  async getTooltipTextForElement(selector: string): Promise<string> {
    await this.hover(tid(selector));
    await this.waitForSelector('.n-tooltip', { state: 'visible', timeout: 3000 });
    return this.getText('.n-tooltip');
  }

  async getExpectedTooltip(key: string): string {
    return (tooltips as Record<string, string>)[key] || '';
  }

  async isSessionTableVisible(): Promise<boolean> {
    return this.isVisible(tid(sessionTable));
  }

  async getExpectedUsabilityLabel(key: string): string {
    return (usabilityLabels as Record<string, string>)[key] || '';
  }
}
