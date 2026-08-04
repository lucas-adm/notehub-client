import { expect, test } from '@playwright/test';
import { SearchPage } from '../../pages/search/search.page';

test.describe('Search - params application', () => {

    test.beforeEach(async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.goto();
    })

    test('search for "note" should apply the q parameter in the url', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.search('note');
        await searchPage.expectParams({ q: 'note' });
    })

    test('clicking "Recent" should apply order=createdAt&sort=desc', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.sortByRecent();
        await searchPage.expectParams({ order: 'createdAt', sort: 'desc' });
    })

    test('clicking "Old" should apply order=createdAt&sort=asc', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.sortByOld();
        await searchPage.expectParams({ order: 'createdAt', sort: 'asc' });
    })

    test('should initialize with "Notes" active by default (without type parameter)', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await expect(searchPage.notesSorter).toBeDisabled();
        await searchPage.expectParams({ type: null });
    });

    test('clicking "Tags" should apply type=tags', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.filterByType('tags');
        await searchPage.expectParams({ type: 'tags' });
    })

    test('clicking "People" should apply type=users', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.filterByType('users');
        await searchPage.expectParams({ type: 'users' });
    })

    test('clicking "Notes" after another filter should apply type=notes explicitly', async ({ page }) => {
        const searchPage = new SearchPage(page);
        await searchPage.filterByType('users');
        await searchPage.filterByType('notes');
        await searchPage.expectParams({ type: 'notes' });
    })

})