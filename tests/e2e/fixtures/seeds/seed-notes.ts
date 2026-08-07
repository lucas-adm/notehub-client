interface SeedNote {
    title: string;
    owner: 'usera' | 'userb' | 'userc';
}

export const seedNotes: Record<'notea' | 'noteb' | 'notec', SeedNote> = {
    notea: {owner: 'usera', title: 'notea'},
    noteb: {owner: 'userb', title: 'noteb'},
    notec: {owner: 'userc', title: 'notec'},
}