import { test } from '../../fixtures/auth';
import { UserPage } from '../../pages/user/user.page';

test.describe('User profile page', () => {

    let userPage: UserPage;

    test.beforeAll(async ({ authenticatedPage }) => {
        userPage = new UserPage(authenticatedPage);
        await userPage.goto('/');
        await userPage.openAndWaitForProfile();
    })

    test('should already be in the user profile page', async () => {
        await userPage.clickAndWaitActive(userPage.about);
    })

    test('should load avatar, banner, main section and main title', async () => {
        await userPage.expectProfileLoaded();
    })

})