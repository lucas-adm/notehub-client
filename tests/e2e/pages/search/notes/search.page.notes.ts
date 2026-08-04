import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchNotesPage extends SearchPage {

    readonly noteTimestamps: Locator;
    readonly noteArticles: Locator;

    constructor(page: Page) {
        super(page);
        this.noteTimestamps = page.locator('article time');
        this.noteArticles = page.locator('article');
    }

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('/notes/search') &&
                res.ok()),
            action(),
        ])
        return response;
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

    async getArticlesText(): Promise<string[]> {
        return this.noteArticles.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

}