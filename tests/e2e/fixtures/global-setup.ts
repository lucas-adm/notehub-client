import { ApiClient } from './api';
import { FullConfig } from '@playwright/test';
import { seedNotes, seedUsers } from './seeds';

export default async function globalSetup(config: FullConfig) {

    const api = await ApiClient.create();

    for (const user of Object.values(seedUsers)) {
        await api.createUser(user);
    }

    const tokens: Record<keyof typeof seedUsers, string> = {} as never;
    for (const [key, user] of Object.entries(seedUsers)) {
        tokens[key as keyof typeof seedUsers] = await api.login(user.username, user.password);
    }

    for (const [key, user] of Object.entries(seedUsers)) {
        if (user.privateProfile) await api.changeProfileVisibility(tokens[key as keyof typeof seedUsers]);
    }

    await api.createFollow(tokens.usera, seedUsers.userb.username);
    await api.createFollow(tokens.usera, seedUsers.userd.username);
    await api.createFollow(tokens.userb, seedUsers.usera.username);
    await api.createFollow(tokens.userd, seedUsers.usera.username);

    const noteIds: Record<keyof typeof seedNotes, string> = {} as never;
    for (const [key, note] of Object.entries(seedNotes)) {
        const created = await api.createNote(tokens[note.author], {
            title: note.title,
            tags: note.tags,
            closed: note.closed,
            hidden: note.hidden,
        })
        noteIds[key as keyof typeof seedNotes] = created.id;
    }

    await api.createFlame(tokens.usera, noteIds.notea);
    await api.createFlame(tokens.userb, noteIds.notea);
    await api.createFlame(tokens.usera, noteIds.noteb);

    await api.dispose();

}