import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { safeQuery, memInsert, memSelect } from '../../db/connection.js';
import { audiobooks } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const audiobookRouter = router({
  list: publicProcedure.input(z.object({ storyId: z.number() })).query(async ({ input }) => {
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      return db.select().from(audiobooks).where(eq(audiobooks.storyId, input.storyId));
    }, memSelect('audiobooks', { storyId: input.storyId }));
  }),

  create: publicProcedure.input(z.object({
    storyId: z.number(), chapterId: z.number().optional(),
    voice: z.string().default('alloy'), ambience: z.string().default('fantasy'),
  })).mutation(async ({ input }) => {
    const data = { ...input, status: 'generating' };
    return safeQuery(async () => {
      const db = (await import('../../db/connection.js')).getDb();
      const [a] = await db.insert(audiobooks).values(data);
      return a;
    }, memInsert('audiobooks', data)[0]);
  }),

  generateSpeech: publicProcedure.input(z.object({
    text: z.string().min(1), voice: z.string().default('alloy'), apiKey: z.string().optional(),
  })).mutation(async ({ input }) => {
    if (!input.apiKey) {
      return { audioUrl: '', message: 'Add your OpenAI API key in Settings to generate audio.', segments: splitIntoSegments(input.text) };
    }
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST', headers: { 'Authorization': `Bearer ${input.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'tts-1', voice: input.voice || 'alloy', input: input.text.slice(0, 4000) }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const blob = await response.blob();
      return { audioUrl: URL.createObjectURL(blob), segments: splitIntoSegments(input.text) };
    } catch (_e) {
      return { audioUrl: '', message: 'Audio generation failed. Check your API key.', segments: splitIntoSegments(input.text) };
    }
  }),

  generateAmbience: publicProcedure.input(z.object({
    scene: z.string().min(1), mood: z.string().default('mysterious'),
  })).mutation(async ({ input }) => {
    const ambienceTypes: Record<string, string> = {
      mysterious: 'Eerie wind, distant whispers, subtle magical chimes',
      battle: 'Clashing swords, battle cries, intense percussion',
      romantic: 'Soft strings, gentle breeze, heartbeats',
      sad: 'Slow piano, rain, melancholic cello',
      epic: 'Orchestral brass, drums, choir',
      calm: 'Birdsong, flowing water, gentle harp',
    };
    return { description: ambienceTypes[input.mood] || ambienceTypes.mysterious, suggestion: `For ${input.scene}: Use "${ambienceTypes[input.mood] || ambienceTypes.mysterious}" ambience` };
  }),
});

function splitIntoSegments(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const segments: string[] = [];
  let currentSegment = '';
  for (const sentence of sentences) {
    if (currentSegment.length + sentence.length > 300) { segments.push(currentSegment.trim()); currentSegment = sentence; }
    else { currentSegment += sentence + ' '; }
  }
  if (currentSegment) segments.push(currentSegment.trim());
  return segments;
}
