import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { safeQuery, memInsert, memSelect, memUpdate } from '../../db/connection.js';
import { userSettings } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const settingsRouter = router({
  get: publicProcedure.query(async () => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [settings] = await db.select().from(userSettings).limit(1);
      return settings || null;
    }, memSelect('user_settings')[0] || null);
  }),

  update: publicProcedure.input(z.object({
    openaiKey: z.string().optional(), claudeKey: z.string().optional(),
    preferredAi: z.string().optional(), theme: z.string().optional(),
  })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const existing = await db.select().from(userSettings).limit(1);
      if (existing.length > 0) {
        await db.update(userSettings).set({ ...input, updatedAt: new Date() }).where(eq(userSettings.id, existing[0].id));
        return { success: true, id: existing[0].id };
      } else {
        const [settings] = await db.insert(userSettings).values({
          openaiKey: input.openaiKey || '', claudeKey: input.claudeKey || '',
          preferredAi: input.preferredAi || 'free', theme: input.theme || 'dark',
        });
        return { success: true, id: settings.insertId };
      }
    }, (() => {
      const existing = memSelect('user_settings');
      if (existing.length > 0) { memUpdate('user_settings', { id: existing[0].id }, { ...input, updatedAt: new Date() }); return { success: true, id: existing[0].id }; }
      else { const s = memInsert('user_settings', input)[0]; return { success: true, id: s.id }; }
    })());
  }),
});
