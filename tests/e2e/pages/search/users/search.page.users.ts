import { Page, Locator } from '@playwright/test';
import { SearchPage } from '../search.page';

export class SearchUsersPage extends SearchPage {

    readonly userNames: Locator;
    readonly userTimestamps: Locator;
    readonly userFollowers: Locator;

    constructor(page: Page) {
        super(page);
        this.userNames = page.locator('article header h4');
        this.userTimestamps = page.locator('article time');
        this.userFollowers = page.getByTestId('followers-count');
    }

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('/users') &&
                res.ok()),
            action(),
        ])
        return response;
    }

    async getTimestamps(limit?: number): Promise<string[]> {
        const all = await this.userTimestamps.evaluateAll(
            (elements) => elements.map((el) => el.getAttribute('datetime') ?? '')
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoTimestamps(): Promise<[string, string]> {
        const [first, second] = await this.getTimestamps(2);
        if (first && second) return [first, second];
        throw new Error('Must have at least 2 users in the result to validate sorting.');
    }

    async getFollowersCount(): Promise<number[]> {
        return this.userFollowers.evaluateAll(
            (elements) => elements.map((el) => parseInt(el.textContent?.trim() ?? '0'))
        )
    }

    async getFirstTwoFollowersCount(): Promise<[number, number]> {
        const followers = await this.getFollowersCount();
        if (followers.length >= 2) return [followers[0], followers[1]];
        throw new Error('Must have at least 2 users in the result to validate sorting.');
    }

    async getArticlesUsernames(): Promise<string[]> {
        return this.userNames.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

}