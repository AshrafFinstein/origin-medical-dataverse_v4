import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface AnnotationData {
  label: string;
  coordinates?: { x: number; y: number; width: number; height: number };
}

/**
 * DataLabellingPage handles all interactions with Data Labeling sessions
 * Includes annotation tools, visualization controls, and label management
 */
export class DataLabellingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(sessionId: string) {
    await super.goto(`/data-labelling/${sessionId}`);
  }

  // ========== VISUALIZATION CONTROLS ==========

  /**
   * Lock visualization
   */
  async lockVisualization() {
    await this.click(this.selectors.dataLabelling['dl-visualization']['lock-button']);
    await this.page.waitForTimeout(300);
  }

  /**
   * Unlock visualization
   */
  async unlockVisualization() {
    await this.click(this.selectors.dataLabelling['dl-visualization']['unlock-button']);
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if visualization is locked
   */
  async isVisualizationLocked(): Promise<boolean> {
    return await this.isVisible(this.selectors.dataLabelling['dl-visualization']['unlock-button']);
  }

  /**
   * Invert image colors
   */
  async invertColors(invert: boolean) {
    const checkbox = this.page.locator(this.selectors.dataLabelling['dl-invert']['color-checkbox']);
    const isChecked = await checkbox.isChecked();

    if (invert && !isChecked) {
      await this.check(this.selectors.dataLabelling['dl-invert']['color-checkbox']);
    } else if (!invert && isChecked) {
      await this.uncheck(this.selectors.dataLabelling['dl-invert']['color-checkbox']);
    }

    await this.page.waitForTimeout(300);
  }
  // ========== ANNOTATION TOOLS ==========

  /**
   * Click annotation button (open annotation toolbar)
   */
  async openAnnotationTools() {
    await this.click(this.selectors.dataLabelling['dl-annotation'].button);
    await this.page.waitForTimeout(500);
  }

  /**
   * Toggle marker mode
   */
  async toggleMarkerMode() {
    await this.click(this.selectors.dataLabelling['dl-marker']['mode-toggle-button']);
    await this.page.waitForTimeout(300);
  }

  /**
   * Create annotation
   * Note: This is a simplified version. Actual implementation would involve
   * canvas interactions using mouse events
   */
  async createAnnotation(data: AnnotationData) {
    // Open annotation tools
    await this.openAnnotationTools();

    // Select label
    await this.selectLabel(data.label);

    // If coordinates provided, draw annotation
    if (data.coordinates) {
      await this.drawAnnotation(data.coordinates);
    }

    console.log(`✅ Annotation created with label: ${data.label}`);
  }

  /**
   * Select label from label menu
   */
  async selectLabel(labelName: string) {
    // Click to open label menu
    await this.click(this.selectors.dataLabelling['dl-label'].menu);

    // Search for label
    await this.fill(
      this.selectors.dataLabelling['dl-label']['menu-search-input'],
      labelName
    );

    // Select label (click on the label item in the list)
    await this.clickByText(labelName);

    // Apply label
    await this.click(this.selectors.dataLabelling['dl-label']['menu-apply-button']);
  }

  /**
   * Draw annotation at specified coordinates
   * Note: This requires Konva canvas interactions
   */
  private async drawAnnotation(coords: { x: number; y: number; width: number; height: number }) {
    // Get canvas element
    const canvas = this.page.locator('canvas').first();

    // Draw rectangle annotation
    await canvas.hover();
    await this.page.mouse.move(coords.x, coords.y);
    await this.page.mouse.down();
    await this.page.mouse.move(coords.x + coords.width, coords.y + coords.height);
    await this.page.mouse.up();

    await this.page.waitForTimeout(500);
  }

  // ========== ANNOTATION MANAGEMENT ==========

  /**
   * Delete annotation
   */
  async deleteAnnotation(confirmDeletion: boolean = true) {
    // Wait for delete modal
    await this.waitForSelector(this.selectors.dataLabelling['dl-delete']['annotation-modal']);

    if (confirmDeletion) {
      await this.click(this.selectors.dataLabelling['dl-delete']['annotation-yes-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-delete']['annotation-no-button']);
    }

    await this.waitForModalClose();
  }

  /**
   * Copy annotation to next image
   */
  async copyAnnotation(replaceExisting: boolean = false) {
    // Wait for copy modal
    await this.waitForSelector(this.selectors.dataLabelling['dl-copy']['annotation-modal']);

    if (replaceExisting) {
      await this.click(this.selectors.dataLabelling['dl-copy']['annotation-replace-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-copy']['annotation-cancel-button']);
    }

    await this.waitForModalClose();
  }

  // ========== SAVE / DISCARD CHANGES ==========

  /**
   * Handle unsaved changes dialog
   */
  async handleUnsavedChanges(action: 'save' | 'discard') {
    // Wait for unsaved changes modal
    await this.waitForSelector(this.selectors.dataLabelling['dl-unsaved']['changes-modal']);

    if (action === 'save') {
      await this.click(this.selectors.dataLabelling['dl-unsaved']['save-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-unsaved']['discard-button']);
    }

    await this.waitForModalClose();
  }

  /**
   * Handle unsaved changes before QC
   */
  async handleUnsavedChangesBeforeQC(action: 'save' | 'dontSave') {
    // Wait for unsaved before QC modal
    await this.waitForSelector(this.selectors.dataLabelling['dl-unsaved']['before-qc-modal']);

    if (action === 'save') {
      await this.click(this.selectors.dataLabelling['dl-unsaved']['before-qc-save-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-unsaved']['before-qc-dont-save-button']);
    }

    await this.waitForModalClose();
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate to next image
   */
  async navigateToNextImage() {
    await this.page.keyboard.press('ArrowRight');
    await this.waitForLoadingComplete();
  }

  /**
   * Navigate to previous image
   */
  async navigateToPreviousImage() {
    await this.page.keyboard.press('ArrowLeft');
    await this.waitForLoadingComplete();
  }

  /**
   * Navigate to specific image by index
   */
  async navigateToImage(index: number) {
    // This would depend on the UI implementation
    // Assuming there's a way to jump to specific image
    await this.page.keyboard.press('g'); // Example shortcut
    await this.page.keyboard.type(index.toString());
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingComplete();
  }

  // ========== KEYBOARD SHORTCUTS ==========

  /**
   * Use keyboard shortcuts for annotation
   */
  async useShortcut(shortcut: 'delete' | 'copy' | 'paste' | 'undo' | 'redo') {
    switch (shortcut) {
      case 'delete':
        await this.page.keyboard.press('Delete');
        break;
      case 'copy':
        await this.page.keyboard.press('Control+C');
        break;
      case 'paste':
        await this.page.keyboard.press('Control+V');
        break;
      case 'undo':
        await this.page.keyboard.press('Control+Z');
        break;
      case 'redo':
        await this.page.keyboard.press('Control+Y');
        break;
    }

    await this.page.waitForTimeout(300);
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Get current image count/index
   */
  async getCurrentImageInfo(): Promise<{ current: number; total: number }> {
    // This would depend on UI implementation
    // Example: Look for text like "Image 5 of 100"
    const infoText = await this.page.locator('.image-counter').textContent() || '';
    const match = infoText.match(/(\d+)\s+of\s+(\d+)/);

    if (match) {
      return {
        current: parseInt(match[1], 10),
        total: parseInt(match[2], 10)
      };
    }

    return { current: 0, total: 0 };
  }

  /**
   * Count annotations on current image
   */
  async getAnnotationCount(): Promise<number> {
    // This would depend on how annotations are rendered
    // Example: Count annotation elements
    const annotations = this.page.locator('.annotation-item, .konvajs-content rect');
    return await annotations.count();
  }

  /**
   * Verify annotation exists with specific label
   */
  async annotationExistsWithLabel(labelName: string): Promise<boolean> {
    return await this.isVisible(`text=${labelName}`);
  }

  /**
   * Wait for image to load
   */
  async waitForImageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Additional wait for image rendering
  }

  /**
   * Check if changes are saved
   */
  async areChangesSaved(): Promise<boolean> {
    // Check for save indicator (e.g., "All changes saved" message)
    return await this.isVisible('text=All changes saved');
  }
}
