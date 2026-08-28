import { randomUUID } from 'crypto';
import { request, APIRequestContext } from '@playwright/test';

export class ApiClient {

  private readonly device = randomUUID();

  private constructor(private readonly ctx: APIRequestContext) { }

  static async create(): Promise<ApiClient> {
    const ctx = await request.newContext({ baseURL: `${process.env.NEXT_PUBLIC_API_URL}/` });
    return new ApiClient(ctx);
  }

  async createUser(user: { email: string; username: string; displayName: string; password: string }) {
    const res = await this.ctx.post('test/users/register', { data: user });
    return res.json();
  }

  async login(identifier: string, password: string): Promise<string> {
    const res = await this.ctx.post('auth/login', {
      headers: { 'X-Device-Id': this.device },
      data: { identifier, password },
    })
    const body = await res.json();
    return body.token.access_token;
  }

  async changeProfileVisibility(accessToken: string) {
    await this.ctx.patch('users/profile/visibility', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async createFollow(accessToken: string, targetUsername: string) {
    await this.ctx.post(`users/${targetUsername}/follow`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async createNote(
    accessToken: string,
    note: { title: string; tags?: string[]; closed?: boolean; hidden?: boolean }
  ): Promise<{ id: string }> {
    const res = await this.ctx.post('notes/new-note', {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        title: note.title,
        tags: note.tags ?? [],
        closed: note.closed ?? false,
        hidden: note.hidden ?? false,
      },
    })
    return res.json();
  }

  async createFlame(accessToken: string, noteId: string) {
    await this.ctx.post(`flames/${noteId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  async dispose() {
    await this.ctx.dispose();
  }

}