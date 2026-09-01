interface SeedNote {
    author: 'usera' | 'userb' | 'userc';
    title: string;
    tags: string[],
    closed?: boolean;
    hidden?: boolean;
    flamesCount: number;
}

export const seedNotes: Record<
    'notea' | 'noteb' | 'notec' | 'cnote' | 'hnote' | 'other',
    SeedNote
> = {
    notea: {
        author: 'usera',
        title: 'notea',
        tags: ['taga'],
        flamesCount: 2,
    },
    noteb: {
        author: 'usera',
        title: 'noteb',
        tags: ['tagb'],
        flamesCount: 1,
    },
    notec: {
        author: 'usera',
        title: 'notec',
        tags: ['tagc'],
        flamesCount: 0,
    },
    cnote: {
        author: 'usera',
        title: 'cnote',
        tags: [],
        closed: true,
        flamesCount: 0,
    },
    hnote: {
        author: 'usera',
        title: 'hnote',
        tags: [],
        hidden: true,
        flamesCount: 0,
    },
    other: {
        author: 'usera',
        title: 'hnote',
        tags: ['other'],
        flamesCount: 0,
    },
}