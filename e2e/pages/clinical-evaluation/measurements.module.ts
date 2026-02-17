import { BaseModule } from '../shared/base-module';
import { ClinicalEvaluationSelectors, getDynamicSelector } from '../../selectors';

import type { MeasurementData, AssessmentData, ClinicalEvaluationData } from './index';

export class CEMeasurementsModule extends BaseModule {
  async toggleMeasurement(data: { sectionIndex: number; measurementIndex: number }) {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-measurement']['toggle-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    await this.click(selector);
    await this.waitForLoadingComplete();
  }

  async setMeasurementVisibility(data: { sectionIndex: number; measurementIndex: number; visible: boolean }) {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-measurement']['visibility-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    const isChecked = await this.ctx.isChecked(selector);

    if (data.visible && !isChecked) {
      await this.ctx.check(selector);
    } else if (!data.visible && isChecked) {
      await this.ctx.uncheck(selector);
    }

    await this.waitForLoadingComplete();
  }

  async markMeasurementAsUnreliable(data: { sectionIndex: number; measurementIndex: number; unreliable: boolean }) {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-measurement']['unreliable-${section.index}-${measurement.index}`'],
      {
        'section.index': data.sectionIndex,
        'measurement.index': data.measurementIndex
      }
    );

    const isChecked = await this.ctx.isChecked(selector);

    if (data.unreliable && !isChecked) {
      await this.ctx.check(selector);
    } else if (!data.unreliable && isChecked) {
      await this.ctx.uncheck(selector);
    }

    await this.waitForLoadingComplete();
  }

  async recordMeasurement(data: MeasurementData) {
    await this.toggleMeasurement({
      sectionIndex: data.sectionIndex,
      measurementIndex: data.measurementIndex
    });

    const inputSelector = getDynamicSelector(ClinicalEvaluationSelectors['ce-measurement'].input, {
      sectionIndex: data.sectionIndex,
      measurementIndex: data.measurementIndex,
    });
    await this.fill(inputSelector, data.value.toString());

    if (data.isUnreliable !== undefined) {
      await this.markMeasurementAsUnreliable({
        sectionIndex: data.sectionIndex,
        measurementIndex: data.measurementIndex,
        unreliable: data.isUnreliable
      });
    }

    if (data.visibility !== undefined) {
      await this.setMeasurementVisibility({
        sectionIndex: data.sectionIndex,
        measurementIndex: data.measurementIndex,
        visible: data.visibility
      });
    }
  }

  async selectAssessmentOption(data: AssessmentData) {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-assessment']['option-${section.index}-${assessment.index}-${name}`'],
      {
        'section.index': data.sectionIndex,
        'assessment.index': data.assessmentIndex,
        'name': data.optionName
      }
    );

    await this.click(selector);
    await this.waitForLoadingComplete();
  }

  async completeClinicalEvaluation(data: ClinicalEvaluationData) {
    if (data.comment) {
      await this.fill(this.selectors.clinicalEvaluation['ce-comment'].textarea, data.comment);
      await this.waitForLoadingComplete();
    }

    if (data.measurements) {
      for (const measurement of Object.values(data.measurements)) {
        await this.recordMeasurement(measurement);
      }
    }

    if (data.assessments) {
      for (const assessment of Object.values(data.assessments)) {
        await this.selectAssessmentOption(assessment);
      }
    }
  }
}
