import { LoginPage } from '../../pages/auth/signin/signin.page';
import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
    authenticatedPage: Page;
}

export { expect } from '@playwright/test';
export const test = base.extend<{}, AuthFixtures>({
    authenticatedPage: [
        async ({ browser }, use) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.fill({ identifier: 'usera', password: 'usera', });
            await loginPage.submit();
            await page.waitForURL('/');
            await use(page);
            await context.close();
        },
        {
            scope: 'worker',
        },
    ],
})