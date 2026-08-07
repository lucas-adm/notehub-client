import { expect, test } from '../../../fixtures/auth';
import { SearchNotesPage } from '../../../pages/search/notes/search.page.notes';

test.describe.configure({ mode: 'serial' });
test.describe('Search - notes sorting and filtering', () => {

    let searchPage: SearchNotesPage;

    test.beforeAll(async ({ authenticatedPage }) => {
        searchPage = new SearchNotesPage(authenticatedPage);
        await searchPage.open();
    })

    test('sort by "Recent" should display the newest note first', async () => {
        await searchPage.waitForNotesResponse(() => searchPage.sortByRecent());
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeGreaterThanOrEqual(new Date(second).getTime());
    })

    test('sort by "Old" should display the oldest note first', async () => {
        await searchPage.waitForNotesResponse(() => searchPage.sortByOld());
        const [first, second] = await searchPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeLessThanOrEqual(new Date(second).getTime());
    })

    test('sort by "Relevance" should display the more flamed note first', async () => {
        await searchPage.waitForNotesResponse(() => searchPage.sortByRelevance());
        const [first, second] = await searchPage.getFirstTwoFlamesCount();
        expect(first).toBeGreaterThanOrEqual(second);
    })

    test('search for "note" should display only notes that contain the term', async () => {
        await searchPage.waitForNotesResponse(() => searchPage.search('note'));
        const texts = await searchPage.getArticlesTitles();
        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) expect(text.toLowerCase()).toContain('note');
    })

})