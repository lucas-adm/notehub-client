import { Page, Locator, expect } from '@playwright/test';
import type { LoginFormData } from '@/core';

export class LoginPage {

    readonly page: Page;
    readonly identifier: Locator;
    readonly password: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.identifier = page.getByLabel('Usuário ou email');
        this.password = page.getByLabel('Senha', { exact: true });
        this.submitButton = page.getByRole('button', { name: /Entrar/i });
    }

    async goto() {
        await this.page.goto('/signin');
    }

    async fill(data: LoginFormData) {
        await this.identifier.fill(data.identifier);
        await this.password.fill(data.password);
    }

    async submit() {
        await this.submitButton.click();
    }

    errorFor(field: keyof LoginFormData) {
        return this.page.locator(`[data-testid="error-${field}"]`);
    }

    async expectError(field: keyof LoginFormData, message: string) {
        await expect(this.errorFor(field)).toHaveText(message);
    }

}