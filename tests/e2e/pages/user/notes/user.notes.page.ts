import { expect, Locator, Page } from '@playwright/test';
import { UserPage } from '../user.page';

export class UserNotesPage extends UserPage {

    readonly searchInput: Locator;
    readonly typeSelectButton: Locator;
    readonly typeMenu: Locator;
    readonly typeCloseButton: Locator;
    readonly selectedTypeOption: Locator;
    readonly typeOptions: Locator;
    readonly tagSelectButton: Locator;
    readonly tagsMenu: Locator;
    readonly tagsCloseButton: Locator;
    readonly tagSearchInput: Locator;
    readonly selectedTagOption: Locator;
    readonly tagOptions: Locator;
    readonly orderSelectButton: Locator;
    readonly orderMenu: Locator;
    readonly orderCloseButton: Locator;
    readonly selectedOrderOption: Locator;
    readonly orderOptions: Locator;
    readonly sortSelectButton: Locator;
    readonly sortMenu: Locator;
    readonly sortCloseButton: Locator;
    readonly selectedSortOption: Locator;
    readonly sortOptions: Locator;
    readonly noteArticles: Locator;
    readonly noteTimestamps: Locator;
    readonly noteCommentsCount: Locator;
    readonly noteFlamesCount: Locator;
    readonly noteTitles: Locator;
    readonly noteSVGS: Locator;
    readonly noteTags: Locator;
    readonly noteCommentsLabel: Locator;
    readonly emptyResultsDialog: Locator;
    readonly privateProfileDialog: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByPlaceholder('Encontrar uma nota...');
        this.typeSelectButton = page.getByTestId('select-type');
        this.typeMenu = page.getByTestId('type-menu');
        this.typeCloseButton = page.getByTestId('close-type-menu');
        this.selectedTypeOption = page.getByTestId('option-type-all').locator('span[role="option"]');
        this.typeOptions = page.locator('[data-testid^="option-type-"]');
        this.tagSelectButton = page.getByTestId('select-tag');
        this.tagsMenu = page.getByTestId('tags-menu');
        this.tagsCloseButton = page.getByTestId('close-tags-menu');
        this.tagSearchInput = page.getByPlaceholder('Filtrar...');
        this.selectedTagOption = page.getByTestId('option-tag-all').locator('span[role="option"]');
        this.tagOptions = page.locator('[data-testid^="option-tag-"]');
        this.orderSelectButton = page.getByTestId('select-order');
        this.orderMenu = page.getByTestId('order-menu');
        this.orderCloseButton = page.getByTestId('close-order-menu');
        this.selectedOrderOption = page.getByTestId('option-order-modifiedAt').locator('span[role="option"]');
        this.orderOptions = page.locator('[data-testid^="option-order-"]');
        this.sortSelectButton = page.getByTestId('select-sort');
        this.sortMenu = page.getByTestId('sort-menu');
        this.sortCloseButton = page.getByTestId('close-sort-menu');
        this.selectedSortOption = page.getByTestId('option-sort-desc').locator('span[role="option"]');
        this.sortOptions = page.locator('[data-testid^="option-sort-"]');
        this.noteArticles = page.locator('article time');
        this.noteTimestamps = page.locator('article time');
        this.noteCommentsCount = page.getByTestId('comment-count');
        this.noteFlamesCount = page.getByTestId('flame-count');
        this.noteTitles = page.locator('article h2');
        this.noteSVGS = page.locator('article header svg');
        this.noteTags = page.locator('article nav ul li a');
        this.noteCommentsLabel = page.locator('footer a');
        this.emptyResultsDialog = page.getByRole('dialog', { name: 'Zero' });
        this.privateProfileDialog = page.getByRole('dialog', { name: 'Perfil privado' });
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

    async waitForNotesResponse(action: () => Promise<void>) {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) =>
                res.url().includes('?') &&
                res.ok()),
            action(),
        ])
        return response;
    }

    async openDropdown(locator: Locator) {
        if (await locator.getAttribute('aria-expanded') !== 'true') await locator.click();
    }

    async closeDropdown(locator: Locator) {
        await locator.click();
    }

    async testFilterOptions(
        selectButton: Locator,
        options: Locator,
        testIdPrefix: string,
        paramName: string,
        mapValue: (raw: string) => string | null = (v) => v
    ) {
        const count = await options.count();
        for (let i = 0; i < count; i++) {
            await this.openDropdown(selectButton);
            const option = options.nth(i);
            const testId = await option.getAttribute('data-testid');
            const raw = testId?.replace(testIdPrefix, '') ?? '';
            const paramValue = mapValue(raw);
            await option.click();
            await this.expectParams({ [paramName]: paramValue });
        }
    }

    getOption(options: Locator, testId: string): Locator {
        return options.and(this.page.getByTestId(testId));
    }

    async getTagOptionsTexts(): Promise<string[]> {
        return await this.tagOptions.allTextContents();
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

    async getCommentsCount(limit?: number): Promise<number[]> {
        const all = await this.noteCommentsCount.evaluateAll(
            (elements) => elements.map((el) => Number(el.textContent?.trim() ?? '0'))
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoCommentsCount(): Promise<[number, number]> {
        const [first, second] = await this.getCommentsCount(2);
        if (first !== undefined && second !== undefined) return [first, second];
        throw new Error('Must have at least 2 notes in the result to validate sorting.');
    }

    async getFlamesCount(limit?: number): Promise<number[]> {
        const all = await this.noteFlamesCount.evaluateAll(
            (elements) => elements.map((el) => Number(el.textContent?.trim() ?? '0'))
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoFlamesCount(): Promise<[number, number]> {
        const [first, second] = await this.getFlamesCount(2);
        if (first !== undefined && second !== undefined) return [first, second];
        throw new Error('Must have at least 2 notes in the result to validate sorting.');
    }

    async getArticlesTitles(limit?: number): Promise<string[]> {
        const all = await this.noteTitles.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
        return limit ? all.slice(0, limit) : all;
    }

    async getFirstTwoTitles(): Promise<[string, string]> {
        const [first, second] = await this.getArticlesTitles(2);
        if (first && second) return [first, second];
        throw new Error('Must have at least 2 notes in the result to validate sorting.');
    }

    async getArticlesTags(): Promise<string[]> {
        return this.noteTags.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

    async getArticlesCommentsLabel(): Promise<string[]> {
        return this.noteCommentsLabel.evaluateAll(
            (elements) => elements.map((el) => el.textContent?.trim() ?? '')
        )
    }

    async search(query: string) {
        await this.searchInput.fill(query);
    }

}