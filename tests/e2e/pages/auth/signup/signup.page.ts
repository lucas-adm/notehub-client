import { Page, Locator, expect } from '@playwright/test';
import type { CreateUserFormData } from '@/core';

export class RegisterPage {

    readonly page: Page;
    readonly email: Locator;
    readonly username: Locator;
    readonly displayName: Locator;
    readonly password: Locator;
    readonly repeatPassword: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.getByLabel('Email');
        this.username = page.getByLabel('Usuário');
        this.displayName = page.getByLabel('Nome');
        this.password = page.getByLabel('Senha', { exact: true });
        this.repeatPassword = page.getByLabel('Repetir senha');
        this.submitButton = page.getByRole('button', { name: /cadastrar/i });
    }

    async goto() {
        await this.page.goto('/signup');
    }

    async fill(data: CreateUserFormData) {
        await this.email.fill(data.email);
        await this.username.fill(data.username);
        await this.displayName.fill(data.displayName);
        await this.password.fill(data.password);
        await this.repeatPassword.fill(data.repeatPassword);
    }

    async submit() {
        await this.submitButton.click();
    }

    errorFor(field: keyof CreateUserFormData) {
        return this.page.locator(`[data-testid="error-${field}"]`);
    }

    async expectError(field: keyof CreateUserFormData, message: string) {
        await expect(this.errorFor(field)).toHaveText(message);
    }
    
}