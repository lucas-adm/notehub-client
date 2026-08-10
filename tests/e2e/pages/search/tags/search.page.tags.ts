import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchTagsPage extends SearchPage {

    readonly noteTimestamps: Locator;
    readonly noteFlames: Locator;
    readonly tags: Locator;

    constructor(page: Page) {
        super(page);
        this.noteTimestamps = page.locator('article time');
        this.noteFlames = page.getByTestId('flame-count');
        this.tags = page.locator('article nav ul li a');
    }

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('/notes/search/tag') &&
                res.ok()),
            action(),
        ])
        return response;
    }

    async getArticlesTags(): Promise<string[]> {
        return this.tags.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

}