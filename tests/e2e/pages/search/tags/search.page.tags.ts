import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchTagsPage extends SearchPage {

    readonly noteArticles: Locator;
    readonly noteTimestamps: Locator;
    readonly noteFlames: Locator;
    readonly tags: Locator;

    constructor(page: Page) {
        super(page);
        this.noteArticles = page.locator('article');
        this.noteTimestamps = page.locator('article time');
        this.noteFlames = page.getByTestId('flame-count');
        this.tags = page.locator('article nav ul li a');
    }

    async getArticlesTags(): Promise<string[]> {
        return this.tags.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

}