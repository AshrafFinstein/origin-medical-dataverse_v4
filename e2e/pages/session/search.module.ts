import { BaseModule } from '../shared/base-module';

import type { SessionSearchCriteria, ImageSearchCriteria } from './index';

export class SessionSearchModule extends BaseModule {
  async searchSession(criteria: SessionSearchCriteria) {
    await this.fill(this.selectors.session['session-search'].input, criteria.searchTerm);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }

  async clearSessionSearch() {
    await this.ctx.clear(this.selectors.session['session-search'].input);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }

  async searchImages(criteria: ImageSearchCriteria) {
    await this.click(this.selectors.session['session-image']['search-button']);
    await this.waitForSelector(this.selectors.session['session-image']['search-modal']);

    if (criteria.count) {
      await this.fill(
        this.selectors.session['session-image']['count-input'],
        criteria.count.toString()
      );
    }

    await this.fill(this.selectors.session['session-image']['search-input'], criteria.searchTerm);
    await this.waitForSelector(this.selectors.session['session-image']['search-table']);
  }

  async applyFilter(searchTerm: string) {
    await this.fill(this.selectors.session['session-search'].input, searchTerm);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }
}
