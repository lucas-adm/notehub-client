import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {

    readonly page: Page;
    readonly searchInput: Locator;
    readonly relevanceSorter: Locator;
    readonly recentSorter: Locator;
    readonly oldSorter: Locator;
    readonly notesSorter: Locator;
    readonly tagsSorter: Locator;
    readonly usersSorter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder('Pesquisar');
        this.relevanceSorter = page.getByRole('button', { name: 'Relevância' });
        this.recentSorter = page.getByRole('button', { name: 'Recente' });
        this.oldSorter = page.getByRole('button', { name: 'Antigo' });
        this.notesSorter = page.getByRole('button', { name: 'Notas' });
        this.tagsSorter = page.getByRole('button', { name: 'Tags' });
        this.usersSorter = page.getByRole('button', { name: 'Pessoas' });
    }

    async goto() {
        await this.page.goto('/search');
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }

    private async clickAndWaitActive(locator: Locator) {
        await locator.click();
        await expect(locator).toBeDisabled();
    }

    async sortByRecent() {
        await this.clickAndWaitActive(this.recentSorter);
    }

    async sortByOld() {
        await this.clickAndWaitActive(this.oldSorter);
    }

    async filterByType(type: 'notes' | 'tags' | 'users') {
        const sorter = { notes: this.notesSorter, tags: this.tagsSorter, users: this.usersSorter }[type];
        await this.clickAndWaitActive(sorter);
    }

    async expectParams(expected: Record<string, string | null>) {
        for (const [key, value] of Object.entries(expected)) {
            if (value === null) {
                await expect.poll(() => {
                    const url = new URL(this.page.url());
                    return url.searchParams.has(key);
                }).toBeFalsy();
            } else {
                await expect.poll(() => {
                    const url = new URL(this.page.url());
                    return url.searchParams.get(key);
                }).toBe(value);
            }
        }
    }

}