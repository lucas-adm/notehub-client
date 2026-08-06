import { SearchNotesPage } from '../../../pages/search/notes/search.page.notes';
import { test, expect } from '@playwright/test';

test.describe('Search - notes sorting and filtering', () => {

    test.beforeEach(async ({ page }) => {
        const searchPage = new SearchNotesPage(page);
        await searchPage.goto();
    })

    test('search for "note" should display only notes that contain the term', async ({ page }) => {
        const searchPage = new SearchNotesPage(page);
        await searchPage.waitForNotesResponse(() => searchPage.search('notea'));
        const texts = await searchPage.getArticlesTitles();
        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) expect(text.toLowerCase()).toContain('notea');
    })

    test('sort by "Recent" should display the newest note first', async ({ page }) => {
        const searchPage = new SearchNotesPage(page);
        await searchPage.waitForNotesResponse(() => searchPage.search('note'));
        await searchPage.waitForNotesResponse(() => searchPage.sortByRecent());
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeGreaterThanOrEqual(new Date(second).getTime());
    })

    test('sort by "Old" should display the oldest note first', async ({ page }) => {
        const searchPage = new SearchNotesPage(page);
        await searchPage.waitForNotesResponse(() => searchPage.search('note'));
        await searchPage.waitForNotesResponse(() => searchPage.sortByOld());
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeLessThanOrEqual(new Date(second).getTime());
    })

})