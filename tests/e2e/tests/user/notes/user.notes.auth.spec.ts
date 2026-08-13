import { expect, seedUsers, test } from '../../../fixtures';
import { UserNotesPage } from '../../../pages/user/notes/user.notes.page';

test.describe('User notes page', () => {

    let notesPage: UserNotesPage;

    test.beforeAll(async ({ authenticatedPage }) => {
        notesPage = new UserNotesPage(authenticatedPage);
        await notesPage.goto('/');
        await notesPage.openAndWaitForProfile();
        await notesPage.waitForNotesResponse(() => notesPage.notes.click());
    })

    test('should display the default selected filters', async () => {
        await expect(notesPage.selectedTypeOption).toHaveAttribute('aria-selected', 'true')
        await expect(notesPage.selectedTagOption).toHaveAttribute('aria-selected', 'true')
        await expect(notesPage.selectedOrderOption).toHaveAttribute('aria-selected', 'true')
        await expect(notesPage.selectedSortOption).toHaveAttribute('aria-selected', 'true')
    })

    test('should open and close all menus', async () => {
        const openBtns = [notesPage.typeSelectButton, notesPage.tagSelectButton, notesPage.orderSelectButton, notesPage.sortSelectButton];
        const menus = [notesPage.typeMenu, notesPage.tagsMenu, notesPage.orderMenu, notesPage.sortMenu];
        const closeBtns = [notesPage.typeCloseButton, notesPage.tagsCloseButton, notesPage.orderCloseButton, notesPage.sortCloseButton];
        for (let i = 0; i < openBtns.length; i++) {
            await notesPage.openDropdown(openBtns[i]);
            await expect(menus[i]).toHaveAttribute('aria-hidden', 'false');
            await notesPage.closeDropdown(closeBtns[i]);
            await expect(menus[i]).toHaveAttribute('aria-hidden', 'true');
        }
    })

    test('should filter by all type options', async () => {
        await notesPage.testFilterOptions(
            notesPage.typeSelectButton,
            notesPage.typeOptions,
            'option-type-',
            'type',
            (v) => v === 'all' ? null : v
        )
    })

    test('should filter by all tag options', async () => {
        await notesPage.testFilterOptions(
            notesPage.tagSelectButton,
            notesPage.tagOptions,
            'option-tag-',
            'tag',
            (v) => v === 'all' ? null : v
        )
    })

    test('should filter by all order options', async () => {
        await notesPage.testFilterOptions(
            notesPage.orderSelectButton,
            notesPage.orderOptions,
            'option-order-',
            'order'
        )
    })

    test('should filter by all sort options', async () => {
        await notesPage.testFilterOptions(
            notesPage.sortSelectButton,
            notesPage.sortOptions,
            'option-sort-',
            'sort'
        )
    })

    test('should display only closed notes when filtered by type "closed"', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.openDropdown(notesPage.typeSelectButton);
        await notesPage.getOption(notesPage.typeOptions, 'option-type-closed').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const comments = await notesPage.getArticlesCommentsLabel();
        expect(comments.length).toBeGreaterThan(0);
        for (const c of comments) expect(c.toLowerCase()).toContain('fechado');
    })

    test('should display only closed notes when filtered by type "hidden"', async () => {
        await notesPage.openDropdown(notesPage.typeSelectButton);
        await notesPage.getOption(notesPage.typeOptions, 'option-type-hidden').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const totalNotes = await notesPage.noteArticles.count();
        const hiddenNotes = await notesPage.noteSVGS.count();
        expect(totalNotes).toBeGreaterThan(0);
        expect(hiddenNotes).toBe(totalNotes);
    })

    test('should display only tags that match the search input', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.openDropdown(notesPage.tagSelectButton);
        await notesPage.tagSearchInput.fill('other');
        const options = await notesPage.tagOptions.allTextContents();
        expect(options.length).toBeGreaterThan(0);
        for (const option of options) {
            const text = option.trim().toLowerCase();
            if (text === 'todas') continue;
            expect(text).toContain('other');
        }
    })

    test('should display only notes containing the selected tag', async () => {
        await notesPage.getOption(notesPage.tagOptions, 'option-tag-other').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const tags = await notesPage.getArticlesTags();
        expect(tags.length).toBeGreaterThan(0);
        for (const t of tags) expect(t.toLowerCase()).toContain('other');
    })

    test('should sort notes alphabetically by title', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.openDropdown(notesPage.sortSelectButton);
        await notesPage.getOption(notesPage.sortOptions, 'option-sort-asc').click();
        await notesPage.openDropdown(notesPage.orderSelectButton);
        await notesPage.getOption(notesPage.orderOptions, 'option-order-title').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const titles = await notesPage.getFirstTwoTitles();
        expect(titles.length).toBeGreaterThan(0);
        const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
        expect(titles).toEqual(sortedTitles);
    })

    test('should sort notes by comment count in descending order', async () => {
        await notesPage.openDropdown(notesPage.orderSelectButton);
        await notesPage.getOption(notesPage.orderOptions, 'option-order-commentsCount').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const [first, second] = await notesPage.getFirstTwoCommentsCount();
        expect(first).toBeGreaterThanOrEqual(second);
    })

    test('should sort notes by flame count in descending order', async () => {
        await notesPage.openDropdown(notesPage.orderSelectButton);
        await notesPage.getOption(notesPage.orderOptions, 'option-order-flamesCount').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const [first, second] = await notesPage.getFirstTwoFlamesCount();
        expect(first).toBeGreaterThanOrEqual(second);
    })

    test('should display oldest notes first', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.openDropdown(notesPage.sortSelectButton);
        await notesPage.getOption(notesPage.sortOptions, 'option-sort-asc').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const [first, second] = await notesPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeLessThanOrEqual(new Date(second).getTime());
    })

    test('should display newest notes first', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.openDropdown(notesPage.sortSelectButton);
        await notesPage.getOption(notesPage.sortOptions, 'option-sort-desc').click();
        await expect(notesPage.noteArticles.first()).toBeVisible();
        const [first, second] = await notesPage.getFirstTwoTimestamps();
        expect(new Date(first).getTime()).toBeGreaterThan(new Date(second).getTime());
    })

    test('should display search results when a search term is entered', async () => {
        await notesPage.about.click();
        await notesPage.notes.click();
        await notesPage.waitForNotesResponse(() => notesPage.search('note'));
        await notesPage.expectParams({ q: 'note' });
        const texts = await notesPage.getArticlesTitles();
        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) expect(text.toLowerCase()).toContain('note');
    })

    test('should display empty results when no notes match the search term', async () => {
        await notesPage.waitForNotesResponse(() => notesPage.search('xyz'));
        await notesPage.expectParams({ q: 'xyz' });
        await expect(notesPage.emptyResultsDialog).toBeVisible();
    })

    test('should display the private profile dialog when accessing a private profile without mutual access', async () => {
        await notesPage.goto(`/${seedUsers.userc.username}/notes`);
        await expect(notesPage.privateProfileDialog).toBeVisible();
    })

})