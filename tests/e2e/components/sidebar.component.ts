import { Page, Locator } from '@playwright/test';

export class Sidebar {

    readonly page: Page;
    readonly root: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('aside');
    }

    link(text: string): Locator {
        return this.root.getByRole('link', { name: text, exact: true });
    }

    async navigateTo(text: string) {
        await this.link(text).click();
    }

}