import { Locator, Page } from '@playwright/test';

type MapValueFn = (raw: string) => string | null;

type FilterDropdownConfig = {
    selectButton: Locator;
    menu: Locator;
    closeButton: Locator;
    options: Locator;
    selectedOption: Locator;
    testIdPrefix: string;
    paramName: string;
    mapValue?: MapValueFn;
}

export class FilterDropdown {

    readonly page: Page;
    readonly selectButton: Locator;
    readonly menu: Locator;
    readonly closeButton: Locator;
    readonly options: Locator;
    readonly selectedOption: Locator;
    private readonly testIdPrefix: string;
    private readonly paramName: string;
    private readonly mapValue: MapValueFn;

    constructor(page: Page, config: FilterDropdownConfig) {
        this.page = page;
        this.selectButton = config.selectButton;
        this.menu = config.menu;
        this.closeButton = config.closeButton;
        this.options = config.options;
        this.selectedOption = config.selectedOption;
        this.testIdPrefix = config.testIdPrefix;
        this.paramName = config.paramName;
        this.mapValue = config.mapValue ?? ((v) => v);
    }

    async open() {
        if (await this.selectButton.getAttribute('aria-expanded') !== 'true') {
            await this.selectButton.click();
        }
    }

    async close() {
        await this.closeButton.click();
    }

    getOption(testId: string): Locator {
        return this.options.and(this.page.getByTestId(testId));
    }

    async getOptionsTexts(): Promise<string[]> {
        return this.options.allTextContents();
    }

    async testAllOptions(expectParams: (expected: Record<string, string | null>) => Promise<void>) {
        const count = await this.options.count();
        for (let i = 0; i < count; i++) {
            await this.open();
            const option = this.options.nth(i);
            const testId = await option.getAttribute('data-testid');
            const raw = testId?.replace(this.testIdPrefix, '') ?? '';
            const paramValue = this.mapValue(raw);
            await option.click();
            await expectParams({ [this.paramName]: paramValue });
        }
    }

}