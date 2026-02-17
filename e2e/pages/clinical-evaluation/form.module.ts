import { BaseModule } from '../shared/base-module';

export class CEFormModule extends BaseModule {
  async openEditForm() {
    const form = this.selectors.clinicalEvaluation['ce-edit'].form;
    await this.waitForSelector(form);
  }

  async isEditFormVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.clinicalEvaluation['ce-edit'].form);
  }

  async addComment(comment: string) {
    await this.fill(this.selectors.clinicalEvaluation['ce-comment'].textarea, comment);
    await this.waitForLoadingComplete();
  }

  async getComment(): Promise<string> {
    return await this.ctx.getValue(this.selectors.clinicalEvaluation['ce-comment'].textarea);
  }

  async clearComment() {
    await this.ctx.clear(this.selectors.clinicalEvaluation['ce-comment'].textarea);
  }

  async toggleSectionVisibility(sectionIndex: number) {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-section']['visibility-checkbox-${section.index}`'],
      { 'section.index': sectionIndex }
    );

    await this.click(selector);
    await this.waitForLoadingComplete();
  }

  async getSectionLegend(sectionIndex: number): Promise<string> {
    const selector = this.ctx.getSelector(
      this.selectors.common['`ce-section']['legend-${section.index}`'],
      { 'section.index': sectionIndex }
    );

    return await this.ctx.getText(selector);
  }
}
