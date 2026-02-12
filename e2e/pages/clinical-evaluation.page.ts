import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface ClinicalEvaluationData {
  comment?: string;
  measurements?: Record<string, any>;
  assessments?: Record<string, AssessmentData>;
}

export interface MeasurementData {
  sectionIndex: number;
  measurementIndex: number;
  value: number;
  isUnreliable?: boolean;
  visibility?: boolean;
}

export interface AssessmentData {
  sectionIndex: number;
  assessmentIndex: number;
  optionName: string;
}

/**
 * ClinicalEvaluationPage handles all interactions with Clinical Evaluation sessions
 * Includes measurement recording, assessment selection, and structure evaluation
 */
export class ClinicalEvaluationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(sessionId: string) {
    await super.goto(`/clinical-evaluation/${sessionId}`);
  }

  // ========== FORM EDITING ==========

  /**
   * Open clinical evaluation edit form
   */
  async openEditForm() {
    const form = this.selectors.clinicalEvaluation['ce-edit'].form;
    await this.waitForSelector(form);
  }

  /**
   * Check if edit form is visible
   */
  async isEditFormVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.clinicalEvaluation['ce-edit'].form);
  }

  // ========== COMMENTS ==========

  /**
   * Add comment to clinical evaluation
   */
  async addComment(comment: string) {
    await this.fill(this.selectors.clinicalEvaluation['ce-comment'].textarea, comment);
    await this.page.waitForTimeout(300);
  }

  /**
   * Get current comment
   */
  async getComment(): Promise<string> {
    return await this.getValue(this.selectors.clinicalEvaluation['ce-comment'].textarea);
  }

  /**
   * Clear comment
   */
  async clearComment() {
    await this.clear(this.selectors.clinicalEvaluation['ce-comment'].textarea);
  }

  // ========== SECTION MANAGEMENT ==========

  /**
   * Toggle section visibility
   * Note: Uses selectors from common.json based on the extraction
   */
  async toggleSectionVisibility(sectionIndex: number) {
    const selector = this.getSelector(
      this.selectors.common['`ce-section']['visibility-checkbox-${section.index}`'],
      { 'section.index': sectionIndex }
    );

    await this.click(selector);
    await this.page.waitForTimeout(300);
  }

  /**
   * Get section legend text
   */
  async getSectionLegend(sectionIndex: number): Promise<string> {
    const selector = this.getSelector(
      this.selectors.common['`ce-section']['legend-${section.index}`'],
      { 'section.index': sectionIndex }
    );

    return await this.getText(selector);
  }

  // ========== MEASUREMENTS ==========

  /**
   * Toggle measurement
   */
  async toggleMeasurement(data: { sectionIndex: number; measurementIndex: number }) {
    const selector = this.getSelector(
      this.selectors.common['`ce-measurement']['toggle-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    await this.click(selector);
    await this.page.waitForTimeout(300);
  }

  /**
   * Set measurement visibility
   */
  async setMeasurementVisibility(data: { sectionIndex: number; measurementIndex: number; visible: boolean }) {
    const selector = this.getSelector(
      this.selectors.common['`ce-measurement']['visibility-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    const checkbox = this.page.locator(selector);
    const isChecked = await checkbox.isChecked();

    if (data.visible && !isChecked) {
      await this.check(selector);
    } else if (!data.visible && isChecked) {
      await this.uncheck(selector);
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * Mark measurement as unreliable
   */
  async markMeasurementAsUnreliable(data: { sectionIndex: number; measurementIndex: number; unreliable: boolean }) {
    const selector = this.getSelector(
      this.selectors.common['`ce-measurement']['unreliable-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    const checkbox = this.page.locator(selector);
    const isChecked = await checkbox.isChecked();

    if (data.unreliable && !isChecked) {
      await this.check(selector);
    } else if (!data.unreliable && isChecked) {
      await this.uncheck(selector);
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * Record measurement value
   * Note: This assumes there's an input field for the measurement
   */
  async recordMeasurement(data: MeasurementData) {
    // First toggle or show the measurement
    await this.toggleMeasurement({
      sectionIndex: data.sectionIndex,
      measurementIndex: data.measurementIndex
    });

    // Enter value (selector may need to be extracted)
    const inputSelector = `[data-testid="measurement-${data.sectionIndex}-${data.measurementIndex}-input"]`;
    await this.fill(inputSelector, data.value.toString());

    // Set unreliable status if specified
    if (data.isUnreliable !== undefined) {
      await this.markMeasurementAsUnreliable({
        sectionIndex: data.sectionIndex,
        measurementIndex: data.measurementIndex,
        unreliable: data.isUnreliable
      });
    }

    // Set visibility if specified
    if (data.visibility !== undefined) {
      await this.setMeasurementVisibility({
        sectionIndex: data.sectionIndex,
        measurementIndex: data.measurementIndex,
        visible: data.visibility
      });
    }
  }

  // ========== ASSESSMENTS ==========

  /**
   * Select assessment option
   */
  async selectAssessmentOption(data: AssessmentData) {
    const selector = this.getSelector(
      this.selectors.common['`ce-assessment']['option-${section.index}-${assessment.index}-${name}`'],
      {
        'section.index': data.sectionIndex,
        'assessment.index': data.assessmentIndex,
        'name': data.optionName
      }
    );

    await this.click(selector);
    await this.page.waitForTimeout(300);
  }

  /**
   * Complete clinical evaluation with all data
   */
  async completeClinicalEvaluation(data: ClinicalEvaluationData) {
    // Add comment if provided
    if (data.comment) {
      await this.addComment(data.comment);
    }

    // Record measurements if provided
    if (data.measurements) {
      for (const [key, measurement] of Object.entries(data.measurements)) {
        await this.recordMeasurement(measurement as MeasurementData);
      }
    }

    // Select assessments if provided
    if (data.assessments) {
      for (const [key, assessment] of Object.entries(data.assessments)) {
        await this.selectAssessmentOption(assessment);
      }
    }

    console.log('✅ Clinical evaluation completed');
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate to next case/image
   */
  async navigateToNextCase() {
    await this.page.keyboard.press('ArrowRight');
    await this.waitForLoadingComplete();
  }

  /**
   * Navigate to previous case/image
   */
  async navigateToPreviousCase() {
    await this.page.keyboard.press('ArrowLeft');
    await this.waitForLoadingComplete();
  }

  /**
   * Save current evaluation
   */
  async saveEvaluation() {
    await this.page.keyboard.press('Control+S');
    await this.waitForToast('success');
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Check if all required fields are completed
   */
  async areRequiredFieldsCompleted(): Promise<boolean> {
    // This would check for any validation errors or incomplete required fields
    const hasErrors = await this.page.locator('.n-form-item-feedback--error').count();
    return hasErrors === 0;
  }

  /**
   * Get validation errors
   */
  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator('.n-form-item-feedback--error');
    const count = await errorElements.count();
    const errors: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await errorElements.nth(i).textContent();
      if (text) {
        errors.push(text);
      }
    }

    return errors;
  }

  /**
   * Verify evaluation is saved
   */
  async isEvaluationSaved(): Promise<boolean> {
    return await this.isVisible('text=All changes saved');
  }

  /**
   * Get current case info
   */
  async getCurrentCaseInfo(): Promise<{ current: number; total: number }> {
    // Look for case counter in UI
    const infoText = await this.page.locator('.case-counter').textContent() || '';
    const match = infoText.match(/(\d+)\s+of\s+(\d+)/);

    if (match) {
      return {
        current: parseInt(match[1]),
        total: parseInt(match[2])
      };
    }

    return { current: 0, total: 0 };
  }

  /**
   * Check if measurement is marked as unreliable
   */
  async isMeasurementUnreliable(data: { sectionIndex: number; measurementIndex: number }): Promise<boolean> {
    const selector = this.getSelector(
      this.selectors.common['`ce-measurement']['unreliable-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    return await this.isChecked(selector);
  }

  /**
   * Get all sections
   */
  async getSectionCount(): Promise<number> {
    // Count sections in the form
    const sections = this.page.locator('[data-testid^="ce-section-legend-"]');
    return await sections.count();
  }

  /**
   * Export evaluation data (if available)
   */
  async exportEvaluation() {
    // Trigger export functionality (depends on UI implementation)
    await this.page.keyboard.press('Control+E');
    await this.page.waitForTimeout(1000);
  }
}
