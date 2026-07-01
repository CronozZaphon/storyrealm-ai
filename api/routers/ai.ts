import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { AIService, COMPANIONS, getRandomLine } from '../lib/ai-providers.js';

// Safe query wrapper
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    console.error('[AI Router Error]', e.message);
    return fallback;
  }
}

export const aiRouter = router({
  checkGrammar: publicProcedure
    .input(z.object({ text: z.string().min(1), apiKey: z.string().optional() }))
    .mutation(async ({ input }: { input: { text: string; apiKey?: string } }) => {
      return safeQuery(async () => {
        const ai = new AIService(input.apiKey);
        const systemPrompt = `You are a master editor. Fix grammar, add proper punctuation, improve flow while preserving the author's voice. Return JSON: { "corrected": string, "explanations": string[] }`;
        const result = await ai.generateWithFallback(`Fix this text: "${input.text}"`, systemPrompt, true);
        try { return JSON.parse(result); } catch { return { corrected: result, explanations: ['AI improvements applied'] }; }
      }, localGrammarCheck(input.text));
    }),

  suggest: publicProcedure
    .input(z.object({ text: z.string().min(1), context: z.string().optional(), apiKey: z.string().optional() }))
    .mutation(async ({ input }: { input: { text: string; context?: string; apiKey?: string } }) => {
      return safeQuery(async () => {
        const ai = new AIService(input.apiKey);
        const systemPrompt = `You are a literary consultant. Analyze the story and provide 3 specific, actionable suggestions. Return JSON: { "suggestions": [{ "type": string, "message": string, "fix": string }] }`;
        const result = await ai.generateWithFallback(`Context: ${input.context || 'N/A'}\n\nStory text: "${input.text}"`, systemPrompt, true);
        try { return JSON.parse(result); } catch { return localSuggestions(); }
      }, localSuggestions());
    }),

  generateStory: publicProcedure
    .input(z.object({
      prompt: z.string().min(1), mode: z.enum(['do', 'say', 'story']),
      context: z.string().optional(), apiKey: z.string().optional(), companion: z.string().optional(),
    }))
    .mutation(async ({ input }: { input: { prompt: string; mode: 'do' | 'say' | 'story'; context?: string; apiKey?: string; companion?: string } }) => {
      return safeQuery(async () => {
        const modeInstructions: Record<string, string> = {
          do: 'Write what happens next in 3rd person narrative. Focus on actions and events. Keep it 2-4 paragraphs.',
          say: 'Write dialogue that fits the scene. Include dialogue tags and brief actions. Keep it natural and character-appropriate.',
          story: 'Continue the story with rich description, dialogue, and narrative. Write 3-5 compelling paragraphs.',
        };
        const companion = input.companion ? COMPANIONS[input.companion] : null;
        const companionFlavor = companion ? ` Write in a style influenced by ${companion.name}'s personality: ${companion.personality} Focus on: ${companion.writingStyle}` : '';
        const systemPrompt = `You are a creative writing assistant.\n\n${modeInstructions[input.mode]}${companionFlavor}\n\nContext so far: ${input.context || 'Beginning of story.'}`;
        const ai = new AIService(input.apiKey);
        const result = await ai.generateWithFallback(input.prompt, systemPrompt);
        return { text: result };
      }, { text: localStoryGeneration(input.prompt, input.mode, input.companion || 'eldrin') });
    }),

  summarize: publicProcedure
    .input(z.object({ text: z.string().min(1), apiKey: z.string().optional() }))
    .mutation(async ({ input }: { input: { text: string; apiKey?: string } }) => {
      return safeQuery(async () => {
        const ai = new AIService(input.apiKey);
        const result = await ai.generateWithFallback(input.text, 'Summarize this story chapter in 2-3 sentences. Capture the key events and emotional beats.');
        return { summary: result };
      }, { summary: input.text.slice(0, 200) + '...' });
    }),

  getCompanion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }: { input: { id: string } }) => {
      return COMPANIONS[input.id] || COMPANIONS.eldrin;
    }),

  listCompanions: publicProcedure.query(async () => {
    return Object.values(COMPANIONS).map(c => ({
      id: c.id, name: c.name, title: c.title, image: c.image, role: c.role, personality: c.personality,
    }));
  }),

  getCompanionLine: publicProcedure
    .input(z.object({ id: z.string(), type: z.enum(['greetings', 'encouragements', 'writingTips', 'praises', 'farewells']) }))
    .query(async ({ input }: { input: { id: string; type: 'greetings' | 'encouragements' | 'writingTips' | 'praises' | 'farewells' } }) => {
      const companion = COMPANIONS[input.id] || COMPANIONS.eldrin;
      return { line: getRandomLine(companion, input.type) };
    }),

  generateImage: publicProcedure
    .input(z.object({ prompt: z.string().min(1), width: z.number().default(512), height: z.number().default(768) }))
    .mutation(async ({ input }: { input: { prompt: string; width: number; height: number } }) => {
      const ai = new AIService();
      return { imageUrl: ai.generateImageUrl(input.prompt, input.width, input.height) };
    }),
});

function localGrammarCheck(text: string) {
  let corrected = text.replace(/\bi\b/g, 'I').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?])/g, '$1').replace(/([.,;:!?])([^\s])/g, '$1 $2').replace(/\s+$/g, '');
  const explanations: string[] = [];
  if (text.match(/\bi\b/)) explanations.push('Capitalized "I" pronouns');
  if (text.match(/\s{2,}/)) explanations.push('Removed extra spaces');
  if (text.match(/\s+[.,;:!?]/)) explanations.push('Fixed spacing before punctuation');
  if (explanations.length === 0) explanations.push('Your writing looks great! No major issues found.');
  return { corrected, explanations };
}

function localSuggestions() {
  return { suggestions: [
    { type: 'style', message: 'Consider varying sentence length for better rhythm', fix: 'Mix short punchy sentences with longer descriptive ones' },
    { type: 'description', message: 'Add sensory details to immerse the reader', fix: 'Include what characters see, hear, smell, or feel' },
    { type: 'dialogue', message: 'Give characters distinct voices', fix: 'Each character should have unique speech patterns' },
  ]};
}

function localStoryGeneration(_prompt: string, mode: string, companionId: string): string {
  const companionFlavors: Record<string, string> = {
    eldrin: 'The scene unfolds with deliberate care, each detail placed like a stone in an arch.',
    lyra: 'Action explodes across the page—no time to breathe, only time to fight!',
    shadow: 'Something lurks beneath the surface. Not everything is as it seems...',
    melody: 'The words dance together, a duet of emotion and melody.',
  };
  const flavor = companionFlavors[companionId] || companionFlavors.eldrin;

  const responses: Record<string, string> = {
    do: `The world shifted around them, shadows lengthening as the sun dipped below the horizon. Every step forward felt heavier, as if the very air had thickened with anticipation. ${flavor}\n\nThey pressed on, driven by a determination that burned brighter than their fear. The path ahead twisted through ancient ruins, their surfaces etched with symbols that seemed to pulse with an otherworldly light. Each footfall echoed, a reminder that they were not alone in this place.`,
    say: `"I don't think we should be here," whispered Elara, her eyes darting between the crumbling pillars.\n\nKael grinned, the kind of smile that suggested he found danger more enticing than wisdom. "That's exactly why we are. The best stories never start in safe places."\n\n"Your definition of 'best' and mine differ significantly," she replied, tightening her grip on the lantern. "Particularly when 'best' involves potentially becoming a dragon's midnight snack."\n\n"Fair point," Kael conceded, his hand resting on the hilt of his sword. "But imagine the tale we'll have. 'The Night We Faced the Beast of Broken Spire.' Has a nice ring to it, doesn't it?"`,
    story: `The chamber opened before them like the maw of some great beast, its depths lost to darkness that no torch could pierce. Elara felt her breath catch—not from fear, though there was plenty of that, but from the sheer scale of what they had discovered. Columns rose like the ribs of a massive creature, supporting a ceiling that vanished into shadow.\n\n${flavor}\n\n"By the Twelve," Kael breathed, his usual bravado momentarily forgotten. "It's real. All of it."\n\nElara stepped forward, her boots crunching on debris that hadn't been disturbed in centuries. The air tasted of dust and old magic, that peculiar metallic tang that prickled at the back of her throat.\n\n"The Seal of Binding," she whispered, recognizing the design from half-remembered texts. "Kael, this isn't just a temple. It's a prison."\n\nThe temperature dropped, and somewhere in the darkness, chains rattled. Not the sound of metal against stone, but something deeper, something wrong. Kael's sword hissed free of its scabbard, the blade catching blue-white light from Elara's lantern.\n\n"Then let's make sure it stays locked," he said, but his voice lacked its usual certainty.`,
  };
  return responses[mode] || responses.story;
}
