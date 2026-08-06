import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchNotesPage extends SearchPage {

    readonly noteTitles: Locator;
    readonly noteTimestamps: Locator;
    readonly noteArticles: Locator;

    constructor(page: Page) {
        super(page);
        this.noteArticles = page.locator('article');
        this.noteTimestamps = page.locator('article time');
        this.noteTitles = page.locator('article h2');
    }

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('/notes/search?') &&
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

    async getArticlesTitles(): Promise<string[]> {
        return this.noteTitles.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        );
    }

}