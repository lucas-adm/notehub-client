import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env', quiet: true });

export default defineConfig({

    testDir: './tests/e2e',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    outputDir: 'playwright/test-results',
    reporter: [
        ['html', { outputFolder: 'playwright/playwright-report' }]
    ],

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    globalSetup: require.resolve('./tests/e2e/fixtures/global-setup.ts'),

    projects: [
        {
            name: 'authenticated',
            use: {
                ...devices['Desktop Chrome'],
            },
            testMatch: '**/*.auth.spec.ts',
            fullyParallel: false,
        },
        {
            name: 'unauthenticated',
            use: { ...devices['Desktop Chrome'] },
            testMatch: '**/*.unauth.spec.ts',
            fullyParallel: true,
        },
    ],

    webServer: {
        command: 'npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },

})