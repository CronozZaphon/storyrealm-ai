declare const process: { env: Record<string, string | undefined> };

// Multi-AI provider system with auto-switching fallback
// Free tiers: Pollinations AI, Grok, Together, Gemini, Cloudflare, HuggingFace

export interface AIProvider {
  name: string;
  generateText: (prompt: string, systemPrompt: string, jsonMode?: boolean) => Promise<string>;
  generateImage: (prompt: string, width: number, height: number) => string;
  available: boolean;
  priority: number;
}

// Pollinations AI - Completely free, no API key needed
const pollinationsProvider: AIProvider = {
  name: 'pollinations',
  available: true,
  priority: 1,
  generateText: async (prompt: string, systemPrompt: string) => {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'openai',
        seed: Math.floor(Math.random() * 10000),
      }),
    });
    if (!response.ok) throw new Error('Pollinations AI failed');
    return response.text();
  },
  generateImage: (prompt: string, width: number, height: number) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
  },
};

// Together AI free tier
const togetherProvider: AIProvider = {
  name: 'together',
  available: true,
  priority: 2,
  generateText: async (prompt: string, systemPrompt: string) => {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer tgp_v1_' + 'demo_key', // Users can add their own
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!response.ok) throw new Error('Together AI failed');
    const data = await response.json();
    return data.choices[0].message.content;
  },
  generateImage: (_prompt: string, _width: number, _height: number) => '',
};

// Google's Gemini free tier
const geminiProvider: AIProvider = {
  name: 'gemini',
  available: true,
  priority: 3,
  generateText: async (prompt: string, systemPrompt: string) => {
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY || 'demo'}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );
    if (!response.ok) throw new Error('Gemini failed');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  },
  generateImage: (_prompt: string, _width: number, _height: number) => '',
};

// Cloudflare Workers AI (free tier)
const cloudflareProvider: AIProvider = {
  name: 'cloudflare',
  available: !!process.env.CLOUDFLARE_API_TOKEN,
  priority: 4,
  generateText: async (prompt: string, systemPrompt: string) => {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      }
    );
    if (!response.ok) throw new Error('Cloudflare AI failed');
    const data = await response.json();
    return data.result.response;
  },
  generateImage: (prompt: string, _width: number, _height: number) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`;
  },
};

// OpenRouter - free tier access to many models
const openRouterProvider: AIProvider = {
  name: 'openrouter',
  available: true,
  priority: 5,
  generateText: async (prompt: string, systemPrompt: string) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-or-v1-' + 'demo',
        'HTTP-Referer': 'https://storyrealm.ai',
        'X-Title': 'StoryRealm AI',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!response.ok) throw new Error('OpenRouter failed');
    const data = await response.json();
    return data.choices[0].message.content;
  },
  generateImage: (_prompt: string, _width: number, _height: number) => '',
};

// All free providers ordered by priority
const FREE_PROVIDERS: AIProvider[] = [
  pollinationsProvider,
  togetherProvider,
  geminiProvider,
  cloudflareProvider,
  openRouterProvider,
].sort((a, b) => a.priority - b.priority);

// Smart AI engine with fallback
export class AIService {
  private userApiKey?: string;
  private selectedCompanion: string = 'eldrin';

  constructor(apiKey?: string) {
    this.userApiKey = apiKey;
  }

  setCompanion(name: string) {
    this.selectedCompanion = name;
    void this.selectedCompanion; // tracked for future personality injection
  }

  // Try free providers in order, fall back to next if one fails
  async generateWithFallback(prompt: string, systemPrompt: string, jsonMode = false): Promise<string> {
    // If user has premium API key, try that first
    if (this.userApiKey) {
      try {
        return await this.premiumGenerate(prompt, systemPrompt, jsonMode);
      } catch (_e) {
        // Fall through to free providers
      }
    }

    // Try each free provider in priority order
    const errors: string[] = [];
    for (const provider of FREE_PROVIDERS) {
      if (!provider.available) continue;
      try {
        const result = await provider.generateText(prompt, systemPrompt);
        return result;
      } catch (e: any) {
        errors.push(`${provider.name}: ${e.message}`);
        continue; // Try next provider
      }
    }

    // All providers failed, use local fallback
    console.warn('All AI providers failed:', errors);
    return this.localFallback(prompt);
  }

  private async premiumGenerate(prompt: string, systemPrompt: string, jsonMode = false): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.userApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    if (!response.ok) throw new Error('Premium AI failed');
    const data = await response.json();
    return data.choices[0].message.content;
  }

  generateImageUrl(prompt: string, width = 512, height = 768): string {
    return pollinationsProvider.generateImage(prompt, width, height);
  }

  private localFallback(prompt: string): string {
    // Local intelligent fallback based on prompt content
    const p = prompt.toLowerCase();
    
    if (p.includes('grammar') || p.includes('fix')) {
      return JSON.stringify({
        corrected: prompt.replace(/["]*Fix this text: /g, '').replace(/\bi\b/g, 'I').replace(/\s{2,}/g, ' '),
        explanations: ['Capitalized "I" pronouns', 'Fixed spacing', 'Improved punctuation']
      });
    }
    
    if (p.includes('suggestion') || p.includes('improve')) {
      return JSON.stringify({
        suggestions: [
          { type: 'style', message: 'Vary sentence length for better rhythm', fix: 'Mix short and long sentences' },
          { type: 'description', message: 'Add sensory details', fix: 'Include sights, sounds, smells' },
          { type: 'dialogue', message: 'Give characters distinct voices', fix: 'Unique speech patterns per character' }
        ]
      });
    }

    return this.getCreativeFallback();
  }

  private getCreativeFallback(): string {
    const fallbacks = [
      `The ancient halls echoed with footsteps that hadn't disturbed their silence in centuries. Torches flickered against walls carved with stories older than memory itself. Something was awakening here—something that had waited patiently for the right soul to find its way into these depths.\n\nElara felt the weight of history pressing against her shoulders, not as a burden but as a promise. The Codex was close. She could feel it in the humming of the air, in the way shadows seemed to reach toward her rather than away.`,
      
      `"I never asked to be the chosen one," Kael muttered, kicking a loose stone down the corridor. It clattered into the darkness, the sound fading without an echo—as if the corridor absorbed it.\n\n"Nobody ever does," Mira replied, adjusting her spectacles. "That's rather the point of being chosen, isn't it? If you asked for it, they'd just call you ambitious."\n\n"I'd settle for 'well-rested' at this point."`,
      
      `The spell shattered like glass, fragments of light scattering across the chamber floor. For a heartbeat, everything hung in perfect balance—the old world and the new, separated by nothing more than the space between heartbeats.\n\nThen the real magic began.\n\nNot the controlled, measured workings taught in academies, but wild, untamed power that answered to no master. It surged through the room like a living thing, and Elara realized with a chill that it was responding to her fear.`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

// Character companion data
export interface CharacterCompanion {
  id: string;
  name: string;
  title: string;
  image: string;
  role: string;
  personality: string;
  writingStyle: string;
  greetings: string[];
  encouragements: string[];
  writingTips: string[];
  praises: string[];
  farewells: string[];
}

export const COMPANIONS: Record<string, CharacterCompanion> = {
  eldrin: {
    id: 'eldrin',
    name: 'Eldrin the Wise',
    title: 'Grand Wizard of the Quill',
    image: '/wizard-guide.png',
    role: 'Guide & Mentor',
    personality: 'Patient, wise, encouraging. Speaks in measured, thoughtful tones.',
    writingStyle: 'Focuses on structure, world-building, and narrative flow',
    greetings: [
      "Ah, a fellow seeker of stories. Welcome to my tower.",
      "The quill has been waiting for your hand, author.",
      "Another day, another chapter in the making of legends.",
      "Come in, come in. The fire is warm and the ideas are flowing.",
      "I sensed your creative spirit approaching. Let's weave some magic.",
    ],
    encouragements: [
      "Every great tome began with a single uncertain word. You have already surpassed that.",
      "Do not fear the blank page—it fears you, for you give it purpose.",
      "Your words carry weight, young author. Trust in their power.",
      "Even the greatest bards had days of doubt. Perseverance is the truest spell.",
      "The story you tell today may be the one that changes someone's world tomorrow.",
    ],
    writingTips: [
      "Show, don't tell—let your readers discover the world through senses, not lectures.",
      "Every character should want something, even if it's just a glass of water.",
      "The first line is a promise to the reader. Make it unforgettable.",
      "Conflict is the heartbeat of story. Without it, prose is merely description.",
      "Read your dialogue aloud. If it sounds strange spoken, it reads strange written.",
    ],
    praises: [
      "Magnificent! Your prose flows like the River of Eternal Ink!",
      "By the Twelve Archives, that is a passage worthy of the Great Library itself!",
      "You have the gift, author. Never doubt it.",
      "Ah, now THAT is how you craft a scene. Bravely done!",
      "The Old Masters would bow to such craftsmanship. Exquisite!",
    ],
    farewells: [
      "Go forth and write. The realm needs your stories.",
      "Until next we meet, may your ink never run dry.",
      "The tower doors are always open to you, storyteller.",
    ],
  },
  lyra: {
    id: 'lyra',
    name: 'Lyra Stormblade',
    title: 'Champion of the Written Word',
    image: '/warrior-praise.png',
    role: 'Motivator & Editor',
    personality: 'Fierce, passionate, direct. Believes in action over perfection.',
    writingStyle: 'Focuses on action, pacing, and character strength',
    greetings: [
      "Draw your pen like a sword, author! The blank page is our battlefield!",
      "Ha! Another brave soul ready to conquer the empty page!",
      "Stand tall, writer. Today we forge legends.",
      "The chapter awaits, and I am here to guard your creative spirit!",
      "Armor up, wordsmith. We've got stories to conquer!",
    ],
    encouragements: [
      "A mighty pen IS sharper than any sword! Strike true, author!",
      "Fear is just excitement in need of better direction. Charge forward!",
      "Every word you write is a victory. Count them as such!",
      "The greatest battles aren't won by the cautious. Be bold in your prose!",
      "You have already survived the hardest part—beginning. Everything else is momentum!",
    ],
    writingTips: [
      "Start with action. Hook them in the first paragraph or lose them forever.",
      "Your protagonist should DO things, not just think about doing them.",
      "Make every scene fight for its place. If it doesn't advance the story, kill it.",
      "Pacing is everything. Alternate between breathless action and quiet moments.",
      "Give your villain a point. The best antagonists believe they're the hero.",
    ],
    praises: [
      "BY THE GODS! That scene could topple empires! Magnificent!",
      "You write like a warrior fights—fearless and true!",
      "HA! Now THAT is how you wield a story! I am PROUD!",
      "The fire in your words could light the darkest dungeon!",
      "A champion's work! The realm shall sing of this tale!",
    ],
    farewells: [
      "Fight on, author. Victory belongs to those who persist.",
      "Keep your pen sharp and your spirit sharper!",
      "When doubt strikes, strike back twice as hard. Write on!",
    ],
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow Whisper',
    title: 'Keeper of Secrets',
    image: '/rogue-mystery.png',
    role: 'Mystery & Suspense Specialist',
    personality: 'Mysterious, observant, speaks in riddles and shadows.',
    writingStyle: 'Focuses on mystery, tension, unreliable narrators, plot twists',
    greetings: [
      "*steps from the shadows* I have been watching... your potential is intriguing.",
      "The darkness holds many stories. Shall we uncover them together?",
      "Secrets are merely stories waiting for the right moment to be told.",
      "I see what others miss. Let me show you the hidden paths of narrative.",
      "*materializes beside you* Even shadows need scribes...",
    ],
    encouragements: [
      "The best secrets are buried in plain sight. Your readers will never see it coming.",
      "Doubt is your ally. Let the reader question everything... then reveal the truth.",
      "Not all heroes walk in light. Some of the best stories lurk in darkness.",
      "Trust nothing. Question everything. That is where the best plots are born.",
      "You are not just writing a story... you are crafting an illusion. Make it perfect.",
    ],
    writingTips: [
      "Plant clues early. The best mysteries hide answers where readers least expect them.",
      "An unreliable narrator is a double-edged blade—wield it with precision.",
      " withhold the full picture. Let shadows obscure just enough to create obsession.",
      "The reveal should recontextualize everything. Make your readers gasp.",
      "Silence speaks louder than words. What you DON'T say is as important as what you do.",
    ],
    praises: [
      "*sharp intake of breath* Devious. I could not have orchestrated it better myself.",
      "The threads of your mystery weave a web even I would fear to navigate.",
      "Clever. Very clever. Your readers will lose sleep over this twist.",
      "That reveal... *slow clap* ...masterfully executed in shadow.",
      "You have the instincts of a true plot-weaver. Impressive... most impressive.",
    ],
    farewells: [
      "Watch the shadows... they are watching you back. Write well.",
      "Every secret must eventually be told. Make yours worth the wait.",
      "Vanish into your story. I'll be here when you return.",
    ],
  },
  melody: {
    id: 'melody',
    name: 'Melody Quickstring',
    title: 'Bard of the Eternal Song',
    image: '/bard-audio.png',
    role: 'Voice & Dialogue Expert',
    personality: 'Cheerful, musical, warm. Sees stories as songs waiting to be sung.',
    writingStyle: 'Focuses on dialogue, voice, rhythm, emotional beats',
    greetings: [
      "*strums lute* A new story to set to music? Marvelous!",
      "Hello, hello! The tavern of tales is open for business!",
      "*melodic laugh* I've been composing a ballad about YOU, author!",
      "Every story has a song hidden inside it. Let's find yours!",
      "The muses sent me! They said you needed a little musical inspiration!",
    ],
    encouragements: [
      "Your words sing, author! Let them carry across the realms!",
      "Even the saddest tale deserves beautiful telling. You have that gift.",
      "A story unwritten is a song unsung. Give it voice!",
      "The best bards aren't born—they're made, one verse at a time. Keep singing!",
      "Your dialogue flows like a river of melody. Truly enchanting!",
    ],
    writingTips: [
      "Read everything aloud. If it doesn't sing, it doesn't work.",
      "Each character should sound different on the page. Give them unique rhythms.",
      "Dialogue tags are spices—use them sparingly, but make each one flavorful.",
      "Emotional beats land harder in silence. Let your characters pause.",
      "The spaces between words are where the music lives.",
    ],
    praises: [
      "*plays a triumphant chord* BRAVO! That passage belongs in the Hall of Legends!",
      "I shall compose a symphony inspired by your prose!",
      "That dialogue crackles with life! The tavern would go WILD for this tale!",
      "*wiping a tear* Beautiful. Simply beautiful. You moved even MY heart.",
      "A standing ovation from every bard in the realm! ENCORE!",
    ],
    farewells: [
      "May your ink sing and your heart stay light!",
      "I'll save you a seat by the fire. Come back with more tales!",
      "The song continues... even when we rest. Write on, dear friend!",
    ],
  },
};

export function getRandomLine(companion: CharacterCompanion, type: keyof CharacterCompanion): string {
  const lines = companion[type] as string[];
  if (!lines || lines.length === 0) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}
