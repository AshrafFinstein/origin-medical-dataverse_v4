import { BaseModule } from '../shared/base-module';

export class DLVisualizationModule extends BaseModule {
  private get modKey() {
    return process.platform === 'darwin' ? 'Meta' : 'Control';
  }

  async lockVisualization() {
    await this.click(this.selectors.dataLabelling['dl-visualization']['lock-button']);
    await this.waitForLoadingComplete();
  }

  async unlockVisualization() {
    await this.click(this.selectors.dataLabelling['dl-visualization']['unlock-button']);
    await this.waitForLoadingComplete();
  }

  async isVisualizationLocked(): Promise<boolean> {
    return await this.isVisible(this.selectors.dataLabelling['dl-visualization']['unlock-button']);
  }

  async invertColors(invert: boolean) {
    const selector = this.selectors.dataLabelling['dl-invert']['color-checkbox'];
    const isChecked = await this.ctx.isChecked(selector);

    if (invert && !isChecked) {
      await this.ctx.check(selector);
    } else if (!invert && isChecked) {
      await this.ctx.uncheck(selector);
    }

    await this.waitForLoadingComplete();
  }

  async navigateToNextImage() {
    await this.ctx.pressKey('ArrowRight');
    await this.waitForLoadingComplete();
  }

  async navigateToPreviousImage() {
    await this.ctx.pressKey('ArrowLeft');
    await this.waitForLoadingComplete();
  }

  async navigateToImage(index: number) {
    await this.ctx.pressKey('g');
    await this.ctx.typeByKeyboard(index.toString());
    await this.ctx.pressKey('Enter');
    await this.waitForLoadingComplete();
  }

  async useShortcut(shortcut: 'delete' | 'copy' | 'paste' | 'undo' | 'redo') {
    switch (shortcut) {
      case 'delete':
        await this.ctx.pressKey('Delete');
        break;

      case 'copy':
        await this.ctx.pressKey(`${this.modKey}+C`);
        break;

      case 'paste':
        await this.ctx.pressKey(`${this.modKey}+V`);
        break;

      case 'undo':
        await this.ctx.pressKey(`${this.modKey}+Z`);
        break;

      case 'redo':
        await this.ctx.pressKey(`${this.modKey}+Y`);
        break;
    }

    await this.waitForLoadingComplete();
  }
}
