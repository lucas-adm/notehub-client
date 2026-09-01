interface SeedUser {
    email: string;
    username: string;
    displayName: string;
    password: string;
    privateProfile: boolean;
    followersCount: number;
    followingCount: number;
}

export const seedUsers: Record<'usera' | 'userb' | 'userc' | 'userd', SeedUser> = {
    usera: {
        email: 'usera@notehub.com.br',
        username: 'usera',
        displayName: 'User A',
        password: 'usera',
        privateProfile: false,
        followersCount: 2,
        followingCount: 2,
    },
    userb: {
        email: 'userb@notehub.com.br',
        username: 'userb',
        displayName: 'User B',
        password: 'userb',
        privateProfile: false,
        followersCount: 1,
        followingCount: 1,
    },
    userc: {
        email: 'userc@notehub.com.br',
        username: 'userc',
        displayName: 'User C',
        password: 'userc',
        privateProfile: true,
        followersCount: 0,
        followingCount: 0,
    },
    userd: {
        email: 'userd@notehub.com.br',
        username: 'userd',
        displayName: 'User D',
        password: 'userd',
        privateProfile: false,
        followersCount: 0,
        followingCount: 0,
    },
}