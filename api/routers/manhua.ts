import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { safeQuery, memInsert, memSelect } from '../../db/connection.js';
import { manhuaPages } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const manhuaRouter = router({
  list: publicProcedure.input(z.object({ storyId: z.number() })).query(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      return db.select().from(manhuaPages).where(eq(manhuaPages.storyId, input.storyId));
    }, memSelect('manhua_pages', { storyId: input.storyId }));
  }),

  create: publicProcedure.input(z.object({
    storyId: z.number(), chapterId: z.number(), pageNumber: z.number(),
    panelData: z.any(), imageUrl: z.string().optional(),
  })).mutation(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [page] = await db.insert(manhuaPages).values(input);
      return page;
    }, memInsert('manhua_pages', input)[0]);
  }),

  generatePanels: publicProcedure.input(z.object({
    text: z.string().min(1), characters: z.array(z.string()).optional(), apiKey: z.string().optional(),
  })).mutation(async ({ input }) => {
    const sentences = input.text.match(/[^.!?]+[.!?]+/g) || [input.text];
    const panels = [];
    for (let i = 0; i < Math.min(sentences.length, 6); i++) {
      const sentence = sentences[i].trim();
      const isDialogue = sentence.includes('"') || sentence.includes('"');
      const dialogueMatch = sentence.match(/["""]([^"""]+)["""]/);
      const prompt = `Manhua comic panel dramatic fantasy scene: ${sentence.slice(0, 120)}`;
      panels.push({
        narration: isDialogue ? '' : sentence,
        dialogue: dialogueMatch ? dialogueMatch[1] : (isDialogue ? sentence.replace(/["""]/g, '') : ''),
        characters: input.characters || ['protagonist'],
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true&seed=${i + 1}`,
        imageDescription: sentence.slice(0, 200),
      });
    }
    return { panels };
  }),
});
