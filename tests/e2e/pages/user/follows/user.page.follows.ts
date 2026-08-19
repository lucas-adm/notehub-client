import { expect, Locator, Page } from '@playwright/test';
import { SearchableListPage } from '../user.page.searchable.list';

export class UserFollowsPage extends SearchableListPage {

    private readonly searchUserInput: Locator;
    readonly followerSorter: Locator;
    readonly azSorter: Locator;
    readonly zaSorter: Locator;
    readonly users: Locator;
    readonly usernames: Locator;
    readonly followerCount: Locator;
    readonly followerButtons: Locator;

    constructor(page: Page) {
        super(page);
        this.searchUserInput = page.getByPlaceholder('Encontrar uma pessoa...');
        this.followerSorter = page.getByRole('button', { name: 'Seguidores' });
        this.azSorter = page.getByRole('button', { name: 'A-Z' });
        this.zaSorter = page.getByRole('button', { name: 'Z-A' });
        this.users = page.locator('section main ul li section');
        this.usernames = this.users.locator('a figcaption span');
        this.followerCount = this.users.locator('figure span');
        this.followerButtons = this.users.locator('button');
    }

    private async clickAndWaitDisabled(locator: Locator) {
        await locator.click();
        await expect(locator).toBeDisabled();
    }

    private async getFollowersCount(limit?: number): Promise<number[]> {
        const all = await this.followerCount.evaluateAll(
            (elements) => elements.map((el) => Number(el.textContent?.trim() ?? '0'))
        )
        return limit ? all.slice(0, limit) : all;
    }

    async searchUser(query: string) {
        await this.searchUserInput.fill(query);
    }

    async sortByAz() {
        await this.clickAndWaitDisabled(this.azSorter);
    }

    async sortByZa() {
        await this.clickAndWaitDisabled(this.zaSorter);
    }

    async sortByFollowers() {
        await this.clickAndWaitDisabled(this.followerSorter);
    }

    async getUsernames(limit?: number): Promise<string[]> {
        const all = await this.usernames.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoUsernames(): Promise<[string, string]> {
        const [first, second] = await this.getUsernames(2);
        if (first && second) return [first, second];
        throw new Error('Must have at least 2 users in the result to validate sorting.');
    }

    async getFirstTwoFollowerCount(): Promise<[number, number]> {
        const [first, second] = await this.getFollowersCount(2);
        if (first && second) return [first, second];
        throw new Error('Must have at least 2 users in the result to validate sorting.');
    }

}