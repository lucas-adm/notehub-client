import { expect, test } from '../../../../fixtures/auth';
import { SearchNotesPage } from '../../../../pages';

test.describe.configure({ mode: 'serial' });
test.describe('Search - notes sorting and filtering', () => {

    let searchPage: SearchNotesPage;

    test.beforeAll(async ({ authenticatedPage }) => {
        searchPage = new SearchNotesPage(authenticatedPage);
        await searchPage.open();
    })

    test('sort by "Recent" should display the newest note first', async () => {
        await searchPage.sortByRecent();
        await expect(searchPage.noteArticles.first()).toBeVisible();
        await searchPage.noteArticles.first().isVisible();
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeGreaterThanOrEqual(new Date(second).getTime());
    })

    test('sort by "Old" should display the oldest note first', async () => {
        await searchPage.sortByOld();
        await expect(searchPage.noteArticles.first()).toBeVisible();
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeLessThanOrEqual(new Date(second).getTime());
    })

    test('sort by "Relevance" should display the more flamed note first', async () => {
        await searchPage.sortByRelevance();
        await expect(searchPage.noteArticles.first()).toBeVisible();
        const [first, second] = await searchPage.getFirstTwoFlamesCount();
        expect(first).toBeGreaterThanOrEqual(second);
    })

    test('search for "note" should display only notes that contain the term', async () => {
        await searchPage.search('note');
        await expect(searchPage.noteArticles.first()).toBeVisible();
        const texts = await searchPage.getArticlesTitles();
        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) expect(text.toLowerCase()).toContain('note');
    })

})