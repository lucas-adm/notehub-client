import { LoginPage } from '../pages/auth/signin/signin.page';
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.fill({ identifier: 'usera', password: 'usera' });
  await loginPage.submit();

  await expect(page).toHaveURL('/');
  await page.context().storageState({ path: authFile });
})