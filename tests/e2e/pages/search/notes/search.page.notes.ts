import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchNotesPage extends SearchPage {

    readonly noteArticles: Locator;
    readonly noteTitles: Locator;
    readonly noteTimestamps: Locator;
    readonly noteFlames: Locator;

    constructor(page: Page) {
        super(page);
        this.noteArticles = page.locator('article');
        this.noteTimestamps = page.locator('article time');
        this.noteTitles = page.locator('article h2');
        this.noteFlames = page.getByTestId('flame-count');
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

    async getFlamesCount(): Promise<number[]> {
        return this.noteFlames.evaluateAll(
            (elements) => elements.map((el) => parseInt(el.textContent?.trim() ?? '0'))
        )
    }

    async getFirstTwoFlamesCount(): Promise<[number, number]> {
        const flames = await this.getFlamesCount();
        if (flames.length >= 2) return [flames[0], flames[1]];
        throw new Error('Must have at least 2 notes in the result to validate sorting.');
    }

}