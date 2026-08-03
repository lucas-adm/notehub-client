interface SeedUser {
    email: string;
    username: string;
    displayName: string;
    password: string;
}

export const seedUsers: Record<'usera' | 'userb' | 'userc', SeedUser> = {
    usera: { email: 'usera@notehub.com.br', username: 'usera', displayName: 'User A', password: 'usera' },
    userb: { email: 'userb@notehub.com.br', username: 'userb', displayName: 'User B', password: 'userb' },
    userc: { email: 'userc@notehub.com.br', username: 'userc', displayName: 'User C', password: 'userc' },
}