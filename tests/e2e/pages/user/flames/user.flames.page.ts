import { expect, Locator, Page } from '@playwright/test';
import { UserPage } from '../user.page';

export class UserFlamesPage extends UserPage {

    readonly searchInput: Locator;
    readonly recentSorter: Locator;
    readonly oldSorter: Locator;
    readonly noteTimestamps: Locator;
    readonly noteTitles: Locator;
    readonly emptyResultsDialog: Locator;
    readonly privateProfileDialog: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByPlaceholder('Encontrar uma nota...');
        this.recentSorter = page.getByRole('button', { name: 'Mais recente' });
        this.oldSorter = page.getByRole('button', { name: 'Mais antigo' });
        this.noteTimestamps = page.locator('article time');
        this.noteTitles = page.locator('article h2');
        this.emptyResultsDialog = page.getByRole('dialog', { name: 'Zero' });
        this.privateProfileDialog = page.getByRole('dialog', { name: 'Perfil privado' });
    }

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('?') &&
                res.ok()),
            action(),
        ])
        return response;
    }

    async clickAndWaitActive(locator: Locator) {
        await locator.click();
        await expect(locator).toBeDisabled();
    }

    async sortByRecent() {
        await this.clickAndWaitActive(this.recentSorter);
    }

    async sortByOld() {
        await this.clickAndWaitActive(this.oldSorter);
    }

    async getArticlesTitles(): Promise<string[]> {
        return this.noteTitles.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

    async getTimestamps(limit?: number): Promise<string[]> {
        const all = await this.noteTimestamps.evaluateAll(
            (elements) => elements.map((el) => el.getAttribute('datetime') ?? '')
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoTimestamps(): Promise<[string, string]> {
        const [first, second] = await this.getTimestamps(2);
        if (first && second) return [first, second];
        throw new Error('Must have at least 2 notes in the result to validate sorting.');
    }

    async search(query: string) {
        await this.searchInput.fill(query);
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