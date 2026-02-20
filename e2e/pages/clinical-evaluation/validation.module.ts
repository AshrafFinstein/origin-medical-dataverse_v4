import { BaseModule } from '../shared/base-module';
import { getDynamicSelector } from '../../selectors';

export class CEValidationModule extends BaseModule {
  async areRequiredFieldsCompleted(): Promise<boolean> {
    const hasErrors = await this.page.locator(this.selectors.clinicalEvaluation['ce-validation-error']).count();
    return hasErrors === 0;
  }

  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator(this.selectors.clinicalEvaluation['ce-validation-error']);
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

  async isEvaluationSaved(): Promise<boolean> {
    return await this.isVisible(this.selectors.clinicalEvaluation['ce-status-saved']);
  }

  async getCurrentCaseInfo(): Promise<{ current: number; total: number }> {
    const infoText = await this.ctx.getText(this.selectors.clinicalEvaluation['ce-case-counter']);
    const match = infoText.match(/(\d+)\s+of\s+(\d+)/);

    if (match) {
      return {
        current: parseInt(match[1], 10),
        total: parseInt(match[2], 10)
      };
    }

    return { current: 0, total: 0 };
  }

  async isMeasurementUnreliable(data: { sectionIndex: number; measurementIndex: number }): Promise<boolean> {
    const selector = getDynamicSelector(
      this.selectors.common['ce-measurement-unreliable-${section.index}-${measurement.index}'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    return await this.ctx.isChecked(selector);
  }

  async getSectionCount(): Promise<number> {
    const sections = this.page.locator(this.selectors.clinicalEvaluation['ce-sections-legend']);
    return await sections.count();
  }

  async navigateToNextCase() {
    await this.ctx.pressKey('ArrowRight');
    await this.waitForLoadingComplete();
  }

  async navigateToPreviousCase() {
    await this.ctx.pressKey('ArrowLeft');
    await this.waitForLoadingComplete();
  }

  async saveEvaluation() {
    await this.ctx.pressKey('Control+S');
    await this.waitForToast('success');
  }

  async exportEvaluation() {
    await this.ctx.pressKey('Control+E');
    await this.waitForLoadingComplete();
  }
}
