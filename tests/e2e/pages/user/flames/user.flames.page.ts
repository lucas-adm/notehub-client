import { expect, Locator, Page } from '@playwright/test';
import { SearchableListPage } from '../user.page.searchable.list';

export class UserFlamesPage extends SearchableListPage {

    readonly recentSorter: Locator;
    readonly oldSorter: Locator;

    constructor(page: Page) {
        super(page);
        this.recentSorter = page.getByRole('button', { name: 'Mais recente' });
        this.oldSorter = page.getByRole('button', { name: 'Mais antigo' });
    }

    private async clickAndWaitDisabled(locator: Locator) {
        await locator.click();
        await expect(locator).toBeDisabled();
    }

    async sortByRecent() {
        await this.clickAndWaitDisabled(this.recentSorter);
    }

    async sortByOld() {
        await this.clickAndWaitDisabled(this.oldSorter);
    }

}