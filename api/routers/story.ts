import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { safeQuery, memInsert, memSelect, memUpdate, memDelete } from '../../db/connection.js';
import { stories, chapters, characters } from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const storyRouter = router({
  list: publicProcedure.query(async () => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      return db.select().from(stories).orderBy(desc(stories.updatedAt));
    }, memSelect('stories'));
  }),

  get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const story = await safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [s] = await db.select().from(stories).where(eq(stories.id, input.id));
      return s || null;
    }, memSelect('stories').find((s: any) => s.id === input.id) || null);

    const storyChapters = await safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      return db.select().from(chapters).where(eq(chapters.storyId, input.id));
    }, memSelect('chapters', { storyId: input.id }));

    const storyCharacters = await safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      return db.select().from(characters).where(eq(characters.storyId, input.id));
    }, memSelect('characters', { storyId: input.id }));

    return { story, chapters: storyChapters, characters: storyCharacters };
  }),

  create: publicProcedure.input(z.object({
    title: z.string().min(1), description: z.string().optional(),
    genre: z.string().optional(), authorName: z.string().optional(),
  })).mutation(async ({ input }) => {
    const data = { title: input.title, description: input.description || '', genre: input.genre || 'Fantasy', authorName: input.authorName || 'Anonymous', status: 'draft' };
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [story] = await db.insert(stories).values(data);
      return story;
    }, memInsert('stories', data)[0]);
  }),

  update: publicProcedure.input(z.object({
    id: z.number(), title: z.string().optional(), description: z.string().optional(),
    genre: z.string().optional(), status: z.string().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.update(stories).set(data).where(eq(stories.id, id));
      return { success: true };
    }, (memUpdate('stories', { id }, data), { success: true }));
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.delete(chapters).where(eq(chapters.storyId, input.id));
      await db.delete(characters).where(eq(characters.storyId, input.id));
      await db.delete(stories).where(eq(stories.id, input.id));
      return { success: true };
    }, (memDelete('chapters', { storyId: input.id }), memDelete('characters', { storyId: input.id }), memDelete('stories', { id: input.id }), { success: true }));
  }),

  createChapter: publicProcedure.input(z.object({
    storyId: z.number(), title: z.string().min(1), content: z.string().default(''), orderNum: z.number(),
  })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [c] = await db.insert(chapters).values(input);
      return c;
    }, memInsert('chapters', input)[0]);
  }),

  updateChapter: publicProcedure.input(z.object({
    id: z.number(), title: z.string().optional(), content: z.string().optional(), summary: z.string().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.update(chapters).set(data).where(eq(chapters.id, id));
      return { success: true };
    }, (memUpdate('chapters', { id }, data), { success: true }));
  }),

  deleteChapter: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.delete(chapters).where(eq(chapters.id, input.id));
      return { success: true };
    }, (memDelete('chapters', { id: input.id }), { success: true }));
  }),

  createCharacter: publicProcedure.input(z.object({
    storyId: z.number(), name: z.string().min(1), description: z.string().optional(),
    appearance: z.string().optional(), personality: z.string().optional(),
    role: z.string().optional(), avatarPrompt: z.string().optional(),
  })).mutation(async ({ input }) => {
    const data = { ...input, avatarUrl: '' };
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [c] = await db.insert(characters).values(data);
      return c;
    }, memInsert('characters', data)[0]);
  }),

  updateCharacter: publicProcedure.input(z.object({
    id: z.number(), name: z.string().optional(), description: z.string().optional(),
    appearance: z.string().optional(), personality: z.string().optional(),
    role: z.string().optional(), avatarUrl: z.string().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.update(characters).set(data).where(eq(characters.id, id));
      return { success: true };
    }, (memUpdate('characters', { id }, data), { success: true }));
  }),

  deleteCharacter: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      await db.delete(characters).where(eq(characters.id, input.id));
      return { success: true };
    }, (memDelete('characters', { id: input.id }), { success: true }));
  }),
});
