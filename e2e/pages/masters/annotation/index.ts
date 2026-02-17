import { Page } from '@playwright/test';
import { BasePage } from '../../base.page';
import { AnnotationCrudModule } from './crud.module';
import { AnnotationValidationModule } from './validation.module';

export interface AnnotationData {
  name: string;
  abbreviation: string;
  taxonomyType: string;
  color?: string;
}

export class AnnotationPage extends BasePage {
  readonly crud: AnnotationCrudModule;
  readonly validation: AnnotationValidationModule;

  constructor(page: Page) {
    super(page);
    this.crud = new AnnotationCrudModule(this);
    this.validation = new AnnotationValidationModule(this);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToAnnotationTab();
  }

  // Backward-compat delegates — crud
  async navigateToAnnotationTab() { return this.crud.navigateToAnnotationTab(); }
  async createAnnotation(data: AnnotationData) { return this.crud.createAnnotation(data); }
  async cancelAnnotationCreation() { return this.crud.cancelAnnotationCreation(); }
  async updateAnnotation(rowIndex: number, data: Partial<AnnotationData>) { return this.crud.updateAnnotation(rowIndex, data); }
  async exportAnnotations() { return this.crud.exportAnnotations(); }

  // Backward-compat delegates — validation
  async getAnnotationCount() { return this.validation.getAnnotationCount(); }
  async getAnnotationName(rowIndex: number) { return this.validation.getAnnotationName(rowIndex); }
  async annotationExists(name: string) { return this.validation.annotationExists(name); }
  async waitForAnnotationTable() { return this.validation.waitForAnnotationTable(); }
  async isAnnotationCreateModalOpen() { return this.validation.isAnnotationCreateModalOpen(); }
}
