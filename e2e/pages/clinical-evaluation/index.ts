import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { CEFormModule } from './form.module';
import { CEMeasurementsModule } from './measurements.module';
import { CEValidationModule } from './validation.module';

export interface ClinicalEvaluationData {
  comment?: string;
  measurements?: Record<string, MeasurementData>;
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

export class ClinicalEvaluationPage extends BasePage {
  readonly form: CEFormModule;
  readonly measurements: CEMeasurementsModule;
  readonly validation: CEValidationModule;

  constructor(page: Page) {
    super(page);
    this.form = new CEFormModule(this);
    this.measurements = new CEMeasurementsModule(this);
    this.validation = new CEValidationModule(this);
  }

  async goto(sessionId: string) {
    await super.goto(`/clinical-evaluation/${sessionId}`);
  }

  // Backward-compat delegates — form
  async openEditForm() { return this.form.openEditForm(); }
  async isEditFormVisible() { return this.form.isEditFormVisible(); }
  async addComment(comment: string) { return this.form.addComment(comment); }
  async getComment() { return this.form.getComment(); }
  async clearComment() { return this.form.clearComment(); }
  async toggleSectionVisibility(sectionIndex: number) { return this.form.toggleSectionVisibility(sectionIndex); }
  async getSectionLegend(sectionIndex: number) { return this.form.getSectionLegend(sectionIndex); }

  // Backward-compat delegates — measurements
  async toggleMeasurement(data: { sectionIndex: number; measurementIndex: number }) { return this.measurements.toggleMeasurement(data); }
  async setMeasurementVisibility(data: { sectionIndex: number; measurementIndex: number; visible: boolean }) { return this.measurements.setMeasurementVisibility(data); }
  async markMeasurementAsUnreliable(data: { sectionIndex: number; measurementIndex: number; unreliable: boolean }) { return this.measurements.markMeasurementAsUnreliable(data); }
  async recordMeasurement(data: MeasurementData) { return this.measurements.recordMeasurement(data); }
  async selectAssessmentOption(data: AssessmentData) { return this.measurements.selectAssessmentOption(data); }
  async completeClinicalEvaluation(data: ClinicalEvaluationData) { return this.measurements.completeClinicalEvaluation(data); }

  // Backward-compat delegates — validation
  async areRequiredFieldsCompleted() { return this.validation.areRequiredFieldsCompleted(); }
  async getValidationErrors() { return this.validation.getValidationErrors(); }
  async isEvaluationSaved() { return this.validation.isEvaluationSaved(); }
  async getCurrentCaseInfo() { return this.validation.getCurrentCaseInfo(); }
  async isMeasurementUnreliable(data: { sectionIndex: number; measurementIndex: number }) { return this.validation.isMeasurementUnreliable(data); }
  async getSectionCount() { return this.validation.getSectionCount(); }
  async navigateToNextCase() { return this.validation.navigateToNextCase(); }
  async navigateToPreviousCase() { return this.validation.navigateToPreviousCase(); }
  async saveEvaluation() { return this.validation.saveEvaluation(); }
  async exportEvaluation() { return this.validation.exportEvaluation(); }
}
