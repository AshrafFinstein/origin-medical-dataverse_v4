import { BaseModule } from '../shared/base-module';

import type { SessionData } from './index';

export class SessionCrudModule extends BaseModule {
  async createSession(data: SessionData) {
    await this.click(this.selectors.session['session-create-button']);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.session['session-create-modal']);
    await this.fill(this.selectors.session['session-name-input'], data.name);

    if (data.autoGenerate !== undefined) {
      await this.setCheckboxState(
        this.selectors.session['session-auto-generate-checkbox'],
        data.autoGenerate
      );
    }

    if (data.description) {
      await this.fill(this.selectors.session['session-description-input'], data.description);
    }

    if (data.status) {
      await this.selectOption(this.selectors.session['session-status-select'], data.status);
    }

    if (data.sessionCodes) {
      await this.configureSessionCodes(data.sessionCodes);
    }

    if (data.assignees && data.assignees.length > 0) {
      if (data.assignees.includes('all')) {
        await this.click(this.selectors.session['session-assignees-select-all']);
      } else {
        const assigneeSelect = this.selectors.session['session-assignees-select'];
        for (const assignee of data.assignees) {
          await this.selectOption(assigneeSelect, assignee);
        }
      }
    }

    if (data.reviewers && data.reviewers.length > 0) {
      if (data.reviewers.includes('all')) {
        await this.click(this.selectors.session['session-reviewers-select-all']);
      } else {
        const reviewerSelect = this.selectors.session['session-reviewers-select'];
        for (const reviewer of data.reviewers) {
          await this.selectOption(reviewerSelect, reviewer);
        }
      }
    }

    if (data.approvalLevel) {
      await this.selectOption(
        this.selectors.session['session-approval-level-select'],
        data.approvalLevel
      );
    }

    if (data.labels && data.labels.length > 0) {
      const labelSelect = this.selectors.session['session-labels-select'];
      for (const label of data.labels) {
        await this.selectOption(labelSelect, label);
      }
    }

    await this.page.keyboard.press('Enter');
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async configureSessionCodes(codes: SessionData['sessionCodes']) {
    if (!codes) return;

    if (codes.projectCode) {
      await this.selectOption(this.selectors.session['session-project-code-select'], codes.projectCode);
    }
    if (codes.subProjectCode) {
      await this.selectOption(this.selectors.session['session-sub-project-code-select'], codes.subProjectCode);
    }
    if (codes.useCaseCode) {
      await this.selectOption(this.selectors.session['session-use-case-code-select'], codes.useCaseCode);
    }
    if (codes.anatomyPlaneCode) {
      await this.selectOption(this.selectors.session['session-anatomy-plane-code-select'], codes.anatomyPlaneCode);
    }
    if (codes.centerCode) {
      await this.selectOption(this.selectors.session['session-center-code-select'], codes.centerCode);
    }
    if (codes.userTypeCode) {
      await this.selectOption(this.selectors.session['session-user-type-code-select'], codes.userTypeCode);
    }
    if (codes.setCode) {
      await this.fill(this.selectors.session['session-set-code-input'], codes.setCode);
    }
  }

  async generateSessionName() {
    await this.click(this.selectors.session['session-generate-name-button']);
    await this.waitForLoadingComplete();
  }

  async clickCreateButton() {
    await this.click(this.selectors.session['session-create-button']);
    await this.waitForModalOpen();
  }

  async fillInputField(fieldName: string, value: string) {
    const selectorKey = `session-${fieldName}-input`;
    const selector = this.getSessionSelector(selectorKey);
    if (selector) {
      await this.fill(selector, value);
    }
  }

  async selectFromDropdown(dropdownKey: string, value: string) {
    const selectorKey = `${dropdownKey}-select`;
    const selector = this.getSessionSelector(selectorKey);
    if (selector) {
      await this.selectOption(selector, value);
    }
  }

  async performAction(actionKey: string) {
    const selectorKey = `${actionKey}-button`;
    const selector = this.getSessionSelector(selectorKey);
    if (selector) {
      await this.click(selector);
    }
  }

  async requestSessionDeletion(reason: string) {
    await this.waitForSelector(this.selectors.session['session-delete-modal']);
    await this.fill(this.selectors.session['session-delete-reason-input'], reason);
    await this.click(this.selectors.session['session-delete-request-button']);
    await this.waitForToast('success');
  }

  async cancelSessionDeletion() {
    await this.click(this.selectors.session['session-delete-cancel-button']);
    await this.waitForModalClose();
  }

  async createSessionLabel(name: string, description: string, _color: string) {
    await this.click(this.selectors.session['session-label-create-button']);
    await this.waitForSelector(this.selectors.session['session-label-create-modal']);
    await this.fill(this.selectors.session['session-label-create-name-input'], name);
    await this.fill(this.selectors.session['session-label-create-description-input'], description);
    await this.click(this.selectors.session['session-label-create-color-picker']);
    await this.click(this.selectors.session['session-label-create-submit-button']);
    await this.waitForToast('success');
  }

  async cancelSessionLabelCreation() {
    await this.click(this.selectors.session['session-label-create-cancel-button']);
    await this.waitForModalClose();
  }

  async navigateToSessionCodesTab(tab: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType') {
    switch (tab) {
      case 'project':
        await this.click(this.selectors.session['session-codes-tab-project-code']);
        break;
      case 'subProject':
        await this.click(this.selectors.session['session-codes-tab-sub-project-code']);
        break;
      case 'useCase':
        await this.click(this.selectors.session['session-codes-tab-use-case-code']);
        break;
      case 'anatomyPlane':
        await this.click(this.selectors.session['session-codes-tab-anatomy-plane-code']);
        break;
      case 'center':
        await this.click(this.selectors.session['session-codes-tab-center-code']);
        break;
      case 'userType':
        await this.click(this.selectors.session['session-codes-tab-user-type-code']);
        break;
    }

    await this.waitForLoadingComplete();
  }

  async importCSV(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.click(this.selectors.session['session-import-csv-button']);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await this.waitForToast('success');
  }

  async uploadToS3(s3Key: string) {
    await this.waitForSelector(this.selectors.session['session-s3-modal']);
    await this.fill(this.selectors.session['session-s3-key-input'], s3Key);
    await this.click(this.selectors.session['session-s3-upload-button']);
    await this.waitForToast('success');
  }

  private async setCheckboxState(selector: string, expectedChecked: boolean) {
    const isChecked = await this.ctx.isChecked(selector);
    if (expectedChecked && !isChecked) {
      await this.ctx.check(selector);
      return;
    }
    if (!expectedChecked && isChecked) {
      await this.ctx.uncheck(selector);
    }
  }

  private getSessionSelector(key: string): string | undefined {
    const sessionSelectors = this.selectors.session as Record<string, string>;
    return sessionSelectors[key];
  }
}
