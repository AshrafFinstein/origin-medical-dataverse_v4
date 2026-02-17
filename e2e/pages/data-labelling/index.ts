import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { DLVisualizationModule } from './visualization.module';
import { DLAnnotationModule } from './annotation.module';
import { DLValidationModule } from './validation.module';

export interface AnnotationData {
  label: string;
  coordinates?: { x: number; y: number; width: number; height: number };
}

export class DataLabellingPage extends BasePage {
  readonly visualization: DLVisualizationModule;
  readonly annotation: DLAnnotationModule;
  readonly validation: DLValidationModule;

  constructor(page: Page) {
    super(page);
    this.visualization = new DLVisualizationModule(this);
    this.annotation = new DLAnnotationModule(this);
    this.validation = new DLValidationModule(this);
  }

  async goto(sessionId: string) {
    await super.goto('/');
  }

  // Backward-compat delegates — visualization
  async lockVisualization() { return this.visualization.lockVisualization(); }
  async unlockVisualization() { return this.visualization.unlockVisualization(); }
  async isVisualizationLocked() { return this.visualization.isVisualizationLocked(); }
  async invertColors(invert: boolean) { return this.visualization.invertColors(invert); }
  async navigateToNextImage() { return this.visualization.navigateToNextImage(); }
  async navigateToPreviousImage() { return this.visualization.navigateToPreviousImage(); }
  async navigateToImage(index: number) { return this.visualization.navigateToImage(index); }
  async useShortcut(shortcut: 'delete' | 'copy' | 'paste' | 'undo' | 'redo') { return this.visualization.useShortcut(shortcut); }

  // Backward-compat delegates — annotation
  async openAnnotationTools() { return this.annotation.openAnnotationTools(); }
  async toggleMarkerMode() { return this.annotation.toggleMarkerMode(); }
  async createAnnotation(data: AnnotationData) { return this.annotation.createAnnotation(data); }
  async selectLabel(labelName: string) { return this.annotation.selectLabel(labelName); }
  async deleteAnnotation(confirmDeletion?: boolean) { return this.annotation.deleteAnnotation(confirmDeletion); }
  async copyAnnotation(replaceExisting?: boolean) { return this.annotation.copyAnnotation(replaceExisting); }
  async handleUnsavedChanges(action: 'save' | 'discard') { return this.annotation.handleUnsavedChanges(action); }
  async handleUnsavedChangesBeforeQC(action: 'save' | 'dontSave') { return this.annotation.handleUnsavedChangesBeforeQC(action); }

  // Backward-compat delegates — validation
  async getCurrentImageInfo() { return this.validation.getCurrentImageInfo(); }
  async getAnnotationCount() { return this.validation.getAnnotationCount(); }
  async annotationExistsWithLabel(labelName: string) { return this.validation.annotationExistsWithLabel(labelName); }
  async waitForImageLoad() { return this.validation.waitForImageLoad(); }
  async areChangesSaved() { return this.validation.areChangesSaved(); }

  // Backward-compat session helpers
  async navigateToModule() { return this.validation.navigateToModule(); }
  async waitForSessionTable(timeout?: number) { return this.validation.waitForSessionTable(timeout); }
  async verifyTableData() { return this.validation.verifyTableData(); }
  async selectFromDropdown(dropdownKey: string, value: string) { return this.validation.selectFromDropdown(dropdownKey, value); }
  async clickCreateButton() { return this.validation.clickCreateButton(); }
  async fillInputField(fieldName: string, value: string) { return this.validation.fillInputField(fieldName, value); }
  async verifyElementVisible(elementKey: string) { return this.validation.verifyElementVisible(elementKey); }
  async verifyModalVisible(modalKey: string) { return this.validation.verifyModalVisible(modalKey); }
  async getErrorMessage() { return this.validation.getErrorMessage(); }
  async isInputVisible(inputKey: string) { return this.validation.isInputVisible(inputKey); }
  async isSessionCreateModalOpen() { return this.validation.isSessionCreateModalOpen(); }
  async applyFilter(searchTerm: string) { return this.validation.applyFilter(searchTerm); }
  async getSessionCount() { return this.validation.getSessionCount(); }
}
