declare const puter: any;

// ============================================================
// STORYREALM AI ENGINE v6 — Premium-First + Auto Key Loading + Integrations Hub
// ============================================================

// ===== KEY MANAGEMENT SYSTEM =====

export interface StoredKey {
  name: string;
  key: string;
  label: string;
  description: string;
  url: string;
  freeTier: boolean;
  freeTierDetails: string;
  paidTierDetails: string;
  icon: string;
}

export const AI_PROVIDERS: StoredKey[] = [
  {
    name: 'openai',
    key: '',
    label: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini — Best-in-class creative writing and grammar correction',
    url: 'https://platform.openai.com/api-keys',
    freeTier: true,
    freeTierDetails: 'Free trial credits on signup (~$5). Then pay-as-you-go.',
    paidTierDetails: 'GPT-4o-mini: $0.15/1M input tokens. GPT-4o: $2.50/1M input tokens.',
    icon: 'brain',
  },
  {
    name: 'claude',
    key: '',
    label: 'Anthropic Claude',
    description: 'Claude 3.5 Sonnet — Exceptional at long-form creative writing and nuanced prose',
    url: 'https://console.anthropic.com/settings/keys',
    freeTier: true,
    freeTierDetails: 'Free trial credits on signup (~$5). Then pay-as-you-go.',
    paidTierDetails: 'Claude 3.5 Haiku: $0.80/1M tokens. Sonnet: $3/1M input tokens.',
    icon: 'sparkles',
  },
  {
    name: 'groq',
    key: '',
    label: 'Groq',
    description: 'Ultra-fast Llama 3.1/3.3 inference — Great free tier with generous limits',
    url: 'https://console.groq.com/keys',
    freeTier: true,
    freeTierDetails: 'Free tier: 300,000 tokens/min, 1,000,000 tokens/day limit.',
    paidTierDetails: 'Pay-as-you-go beyond free limits. Very affordable rates.',
    icon: 'zap',
  },
  {
    name: 'together',
    key: '',
    label: 'Together AI',
    description: 'Llama 3.3 70B, Mixtral — Open-source models with free daily credits',
    url: 'https://api.together.xyz/settings/api-keys',
    freeTier: true,
    freeTierDetails: 'Free tier includes daily credits for Llama models.',
    paidTierDetails: 'Pay-as-you-go. Llama 3.3 70B: ~$0.88/1M tokens.',
    icon: 'users',
  },
  {
    name: 'gemini',
    key: '',
    label: 'Google Gemini',
    description: 'Gemini 2.0 Flash — Fast multimodal AI with generous free tier',
    url: 'https://aistudio.google.com/app/apikey',
    freeTier: true,
    freeTierDetails: 'Free tier: 1,500 requests/day, 1,000,000 tokens/min.',
    paidTierDetails: 'Pay-as-you-go beyond free limits. Very competitive pricing.',
    icon: 'globe',
  },
  {
    name: 'openrouter',
    key: '',
    label: 'OpenRouter',
    description: 'Access 100+ models (Claude, GPT, Llama, Mistral) through one API',
    url: 'https://openrouter.ai/keys',
    freeTier: true,
    freeTierDetails: 'Many free models available. Paid models require credits.',
    paidTierDetails: 'Add credits as needed. Prices vary by model.',
    icon: 'route',
  },
  {
    name: 'cohere',
    key: '',
    label: 'Cohere',
    description: 'Command R+ — Strong at following instructions and creative tasks',
    url: 'https://dashboard.cohere.com/api-keys',
    freeTier: true,
    freeTierDetails: 'Free trial: 1,000 API calls/month.',
    paidTierDetails: 'Production: $1/1,000 API calls for Command R+.',
    icon: 'command',
  },
];

// Key storage uses sr_{provider}_key pattern
function getStorageKey(providerName: string): string {
  return `sr_${providerName}_key`;
}

/** Save an API key to localStorage */
export function saveUserKey(providerName: string, apiKey: string): void {
  localStorage.setItem(getStorageKey(providerName), apiKey.trim());
}

/** Remove an API key from localStorage */
export function removeUserKey(providerName: string): void {
  localStorage.removeItem(getStorageKey(providerName));
}

/** Load a specific API key from localStorage */
export function loadUserKey(providerName: string): string | null {
  return localStorage.getItem(getStorageKey(providerName));
}

/** Check if user has any premium API keys configured */
export function hasPremiumKeys(): boolean {
  return AI_PROVIDERS.some((p) => {
    const key = loadUserKey(p.name);
    return key && key.length > 10;
  });
}

/** Get the name of the highest-priority available provider */
export function getPreferredProviderName(): string {
  for (const p of AI_PROVIDERS) {
    const key = loadUserKey(p.name);
    if (key && key.length > 10) return p.label;
  }
  return 'Pollinations AI (Free)';
}

/** Get all providers with their current key status */
export function getProviderStatus(): Array<StoredKey & { hasKey: boolean; keyMasked: string }> {
  return AI_PROVIDERS.map((p) => {
    const key = loadUserKey(p.name);
    const hasKey = !!(key && key.length > 10);
    return {
      ...p,
      hasKey,
      keyMasked: hasKey ? `${key!.slice(0, 8)}...${key!.slice(-4)}` : '',
    };
  });
}

/** Build options object from all stored keys for generateWithFallback */
function buildOptionsFromStoredKeys(): AIGenerateOptions {
  const opts: AIGenerateOptions = {};
  const openaiKey = loadUserKey('openai');
  if (openaiKey) opts.openaiKey = openaiKey;
  const groqKey = loadUserKey('groq');
  if (groqKey) opts.groqKey = groqKey;
  const togetherKey = loadUserKey('together');
  if (togetherKey) opts.togetherKey = togetherKey;
  const geminiKey = loadUserKey('gemini');
  if (geminiKey) opts.geminiKey = geminiKey;
  const openrouterKey = loadUserKey('openrouter');
  if (openrouterKey) opts.openrouterKey = openrouterKey;
  const cohereKey = loadUserKey('cohere');
  if (cohereKey) opts.cohereKey = cohereKey;
  // Companion
  const companionId = localStorage.getItem('storyrealm_companion') || 'eldrin';
  opts.companionId = companionId;
  return opts;
}

// ============================================================
// AI PROVIDER IMPLEMENTATIONS
// ============================================================

export interface AIProviderConfig {
  name: string;
  type: 'text' | 'image' | 'audio';
  priority: number;
  available: boolean;
  requiresKey: boolean;
  keyEnvName?: string;
  generate: (prompt: string, systemPrompt: string, options?: any) => Promise<string>;
}

// Companion influence system
function getCompanionPrompt(companionId: string): string {
  const companions: Record<string, { personality: string; style: string }> = {
    eldrin: { personality: 'wise, patient, thoughtful wizard', style: 'rich world-building, elegant prose, measured pacing' },
    lyra: { personality: 'fierce, passionate warrior', style: 'action-driven, bold descriptions, strong pacing' },
    shadow: { personality: 'mysterious, observant rogue', style: 'atmospheric tension, unreliable narration, plot twists' },
    melody: { personality: 'cheerful, musical bard', style: 'musical rhythm, emotional dialogue, lyrical prose' },
  };
  const c = companions[companionId] || companions.eldrin;
  return `\n\nWriting personality: ${c.personality}. Writing style: ${c.style}.`;
}

// 1. POLLINATIONS AI — 100% Free, No Key, Text + Images
async function pollinationsText(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      seed: Math.floor(Math.random() * 100000),
    }),
  });
  if (!response.ok) throw new Error('Pollinations failed');
  return response.text();
}

export function pollinationsImageUrl(prompt: string, width = 512, height = 768): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
}

// 2. GROQ API — Ultra-fast inference, generous free tier
async function groqText(prompt: string, systemPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || '';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
    }),
  });
  if (!response.ok) throw new Error('Groq failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

// 3. TOGETHER AI — Free tier Llama 3.3 70B
async function togetherText(prompt: string, systemPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || '';
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!response.ok) throw new Error('Together failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

// 4. GOOGLE GEMINI — Free tier Flash 2.0
async function geminiText(prompt: string, systemPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || '';
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
    }
  );
  if (!response.ok) throw new Error('Gemini failed');
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// 5. OPENROUTER — Free multi-model access
async function openRouterText(prompt: string, systemPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || '';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
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
}

// 6. COHERE API — Free trial Command R+
async function cohereText(prompt: string, systemPrompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || '';
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'command-r-plus',
      message: prompt,
      preamble: systemPrompt,
    }),
  });
  if (!response.ok) throw new Error('Cohere failed');
  const data = await response.json();
  return data.text;
}

// 7. OPENAI (premium user-provided key)
async function openaiText(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!response.ok) throw new Error('OpenAI failed');
  const data = await response.json();
  return data.choices[0].message.content;
}

// 8. ANTHROPIC CLAUDE (premium user-provided key)
async function claudeText(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!response.ok) throw new Error('Claude failed');
  const data = await response.json();
  return data.content[0].text;
}

// ============================================================
// MAIN AI ENGINE — PREMIUM-FIRST FALLBACK SYSTEM
// ============================================================

export interface AIGenerateOptions {
  mode?: 'story' | 'do' | 'say' | 'grammar' | 'suggest' | 'translate' | 'summarize' | 'mix' | 'develop' | 'question';
  companionId?: string;
  apiKey?: string;
  openaiKey?: string;
  claudeKey?: string;
  groqKey?: string;
  togetherKey?: string;
  geminiKey?: string;
  openrouterKey?: string;
  cohereKey?: string;
  targetLanguage?: string;
  usePuter?: boolean;
}

/** Generate text with 3-tier fallback: User Premium -> Free APIs -> Local Engine */
export async function generateWithFallback(
  userPrompt: string,
  mode: string = 'story',
  context: string = '',
  options: AIGenerateOptions = {}
): Promise<{ text: string; provider: string }> {
  // Merge stored keys with explicitly passed options
  const stored = buildOptionsFromStoredKeys();
  const merged: AIGenerateOptions = {
    ...stored,
    ...options,
    // Explicitly passed keys override stored keys
    ...(options.openaiKey ? { openaiKey: options.openaiKey } : {}),
    ...(options.claudeKey ? { claudeKey: options.claudeKey } : {}),
    ...(options.groqKey ? { groqKey: options.groqKey } : {}),
    ...(options.togetherKey ? { togetherKey: options.togetherKey } : {}),
    ...(options.geminiKey ? { geminiKey: options.geminiKey } : {}),
    ...(options.openrouterKey ? { openrouterKey: options.openrouterKey } : {}),
    ...(options.cohereKey ? { cohereKey: options.cohereKey } : {}),
  };

  const companionInfluence = merged.companionId ? getCompanionPrompt(merged.companionId) : '';

  const systemPrompts: Record<string, string> = {
    story: `You are a creative writing assistant. Continue the story with rich description, dialogue, and narrative. Write 3-5 compelling paragraphs.${companionInfluence}\n\nContext so far: ${context || 'Beginning of story.'}`,
    do: `You are a creative writing assistant. Write what happens next in 3rd person narrative. Focus on actions and events. Keep it 2-4 paragraphs.${companionInfluence}\n\nContext so far: ${context || 'Beginning of story.'}`,
    say: `You are a creative writing assistant. Write dialogue that fits the scene. Include dialogue tags and brief actions. Keep it natural and character-appropriate.${companionInfluence}\n\nContext so far: ${context || 'Beginning of story.'}`,
    grammar: `You are a master editor. Fix grammar, add proper punctuation, improve flow while preserving the author's voice. Return ONLY the corrected text, no explanations.`,
    suggest: `You are a literary consultant. Analyze the story and provide 3 specific, actionable suggestions to improve it. Format each suggestion as: [TYPE] Message | Fix: suggestion`,
    translate: `You are a professional literary translator. Translate the following text into ${merged.targetLanguage || 'the target language'} while preserving the tone, style, and emotional impact. Maintain character voices and narrative flow.`,
    summarize: `Summarize this story chapter in 2-3 sentences. Capture the key events and emotional beats.`,
    mix: `You are a master storyteller who specializes in blending narratives. Analyze the provided stories and create a new, unique story that combines the best elements from each. Create something fresh and original while honoring the source material.`,
    develop: `You are an expert novelist and story architect. Help develop a complete story from a premise. Be thorough, creative, and structured. Provide rich detail.`,
    question: `You are a creative writing coach. Ask the user ONE insightful, specific question at a time to help develop their story. Each question should build on previous answers. Keep questions concise (1-2 sentences).`,
  };

  const systemPrompt = systemPrompts[mode] || systemPrompts.story;
  const errors: string[] = [];

  // ===== TIER 0: PUTER.JS (Zero-cost premium AI — NO API KEY NEEDED) =====
  if (merged.usePuter !== false) {
    try {
      if (typeof puter !== 'undefined' && puter.ai?.chat) {
        const companionInfluence = merged.companionId ? getCompanionPrompt(merged.companionId) : '';
        const fullSystem = systemPrompt + companionInfluence;
        const messages: Array<{ role: string; content: string }> = [];
        if (fullSystem) messages.push({ role: 'system', content: fullSystem });
        messages.push({ role: 'user', content: userPrompt });
        const response = await puter.ai.chat(messages, { model: 'gpt-4o', stream: false });
        const text = response?.toString() || '';
        if (text.length > 20) return { text, provider: 'Puter.js GPT-4o (Free)' };
      }
    } catch (e: any) {
      errors.push(`Puter.js: ${e.message}`);
    }
  }

  // ===== TIER 1: PREMIUM PROVIDERS (User's own API keys — BEST QUALITY) =====
  const premiumProviders: Array<{ name: string; fn: () => Promise<string> }> = [];

  if (merged.openaiKey) premiumProviders.push({ name: 'OpenAI GPT-4o', fn: () => openaiText(userPrompt, systemPrompt, merged.openaiKey!) });
  if (merged.claudeKey) premiumProviders.push({ name: 'Claude 3.5 Haiku', fn: () => claudeText(userPrompt, systemPrompt, merged.claudeKey!) });
  if (merged.groqKey) premiumProviders.push({ name: 'Groq Llama 3.1', fn: () => groqText(userPrompt, systemPrompt, merged.groqKey) });
  if (merged.togetherKey) premiumProviders.push({ name: 'Together Llama 3.3', fn: () => togetherText(userPrompt, systemPrompt, merged.togetherKey) });
  if (merged.geminiKey) premiumProviders.push({ name: 'Gemini Flash 2.0', fn: () => geminiText(userPrompt, systemPrompt, merged.geminiKey) });
  if (merged.openrouterKey) premiumProviders.push({ name: 'OpenRouter', fn: () => openRouterText(userPrompt, systemPrompt, merged.openrouterKey) });
  if (merged.cohereKey) premiumProviders.push({ name: 'Cohere Command R+', fn: () => cohereText(userPrompt, systemPrompt, merged.cohereKey) });

  // Try premium providers first
  for (const provider of premiumProviders) {
    try {
      const result = await provider.fn();
      if (result && result.length > 20) {
        return { text: result, provider: provider.name };
      }
    } catch (e: any) {
      errors.push(`${provider.name}: ${e.message}`);
      continue;
    }
  }

  // ===== TIER 2: FREE PROVIDERS (Transparent fallback — NO KEYS NEEDED) =====
  const freeProviders: Array<{ name: string; fn: () => Promise<string> }> = [
    { name: 'Pollinations AI', fn: () => pollinationsText(userPrompt, systemPrompt) },
  ];

  for (const provider of freeProviders) {
    try {
      const result = await provider.fn();
      if (result && result.length > 20) {
        return { text: result, provider: provider.name };
      }
    } catch (e: any) {
      errors.push(`${provider.name}: ${e.message}`);
      continue;
    }
  }

  // ===== TIER 3: LOCAL ENGINE (Never fails) =====
  console.warn('[AI] All providers failed:', errors);
  return { text: localFallback(userPrompt, mode, merged.companionId || 'eldrin'), provider: 'Local Engine' };
}

/** Generate an image using Pollinations AI (always free) */
export async function generateImage(prompt: string, width = 512, height = 768): Promise<string> {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;
}

/** Translate text — uses Puter/LibreTranslate/premium keys, then free services */
export async function translateText(text: string, targetLang: string, apiKey?: string): Promise<{ translated: string; provider: string }> {
  // Try Puter.js translation first (free, high quality)
  try {
    if (typeof puter !== 'undefined' && puter.ai?.chat) {
      const result = await puter.ai.chat([
        { role: 'system', content: `You are a professional literary translator. Translate the user's text into ${targetLang}. Preserve tone, style, and emotional impact. Only output the translation, nothing else.` },
        { role: 'user', content: text },
      ], { model: 'gpt-4o', stream: false });
      const translated = result?.toString() || '';
      if (translated && translated.length > 5) return { translated, provider: 'Puter.js Translate (Free)' };
    }
  } catch { /* fall through */ }

  // Try LibreTranslate (free, no key)
  try {
    const { libreTranslate } = await import('./libretranslate');
    const translated = await libreTranslate(text, 'auto', targetLang);
    if (translated && translated !== text) return { translated, provider: 'LibreTranslate (Free)' };
  } catch { /* fall through */ }

  // Premium keys...
  // Check for stored DeepL key (sr_deepl_key)
  const deeplKey = apiKey || loadUserKey('deepl');

  // Try DeepL first if key available
  if (deeplKey) {
    try {
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: { 'Authorization': `DeepL-Auth-Key ${deeplKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: [text], target_lang: targetLang.toUpperCase() }),
      });
      if (response.ok) {
        const data = await response.json();
        return { translated: data.translations[0].text, provider: 'DeepL Premium' };
      }
    } catch (_e) { /* fall through */ }
  }

  // Try LibreTranslate (free)
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'auto', target: targetLang }),
    });
    if (response.ok) {
      const data = await response.json();
      return { translated: data.translatedText, provider: 'LibreTranslate (Free)' };
    }
  } catch (_e) { /* fall through */ }

  // Fallback to AI translation via premium keys if available
  const stored = buildOptionsFromStoredKeys();
  if (hasPremiumKeys()) {
    try {
      const result = await generateWithFallback(
        text,
        'translate',
        '',
        { ...stored, targetLanguage: targetLang }
      );
      return { translated: result.text, provider: `${result.provider} Translate` };
    } catch (_e) { /* fall through */ }
  }

  // Last resort: Pollinations direct
  try {
    const result = await pollinationsText(
      text,
      `You are a professional literary translator. Translate the user's text into ${targetLang}. Preserve tone, style, and emotional impact. Only output the translation, nothing else.`
    );
    return { translated: result, provider: 'Pollinations AI Translate (Free)' };
  } catch (_e) {
    return { translated: text, provider: 'Fallback (no translation)' };
  }
}

// ============================================================
// STORY MIXER — Blend multiple stories
// ============================================================

export async function mixStories(
  stories: Array<{ title: string; content: string; genre: string }>,
  mixStyle: 'blend' | 'crossover' | 'inspired' | 'mashup',
  options: AIGenerateOptions = {}
): Promise<{ text: string; outline: string; provider: string }> {
  // Auto-load stored keys if none explicitly provided
  if (!options.openaiKey && !options.groqKey && !options.togetherKey && !options.geminiKey && !options.openrouterKey && !options.cohereKey) {
    const stored = buildOptionsFromStoredKeys();
    options = { ...stored, ...options };
  }

  const storyTexts = stories.map((s, i) => `STORY ${i + 1}: "${s.title}" (${s.genre})\n${s.content.slice(0, 800)}...`).join('\n\n---\n\n');

  const mixPrompts: Record<string, string> = {
    blend: 'Create a new story that seamlessly BLENDS these stories together. Merge characters, worlds, and plots into one coherent narrative.',
    crossover: 'Create a CROSSOVER story where characters from these different stories meet and interact in unexpected ways.',
    inspired: 'Create a new story INSPIRED by the themes, mood, and best elements of these stories. Not a direct combination, but spiritually connected.',
    mashup: 'Create a wild MASHUP that combines the most interesting elements from each story in surprising and creative ways.',
  };

  const prompt = `${mixPrompts[mixStyle]}\n\n${storyTexts}\n\nFirst, provide a brief outline (2-3 sentences) of the new story concept. Then write the opening chapter (3-5 paragraphs). Format as:\nOUTLINE: [your outline]\nCHAPTER:\n[your chapter]`;

  const result = await generateWithFallback(prompt, 'mix', '', options);

  const outlineMatch = result.text.match(/OUTLINE:\s*([\s\S]*?)(?=CHAPTER:|$)/i);
  const chapterMatch = result.text.match(/CHAPTER:\s*([\s\S]*)/i);

  return {
    outline: outlineMatch ? outlineMatch[1].trim() : 'A new story blending elements from your selected tales.',
    text: chapterMatch ? chapterMatch[1].trim() : result.text,
    provider: result.provider,
  };
}

// ============================================================
// AI STORY DEVELOPER — Auto mode generates full story
// ============================================================

export async function developStoryAuto(
  premise: string,
  genre: string,
  tone: string,
  targetLength: string,
  options: AIGenerateOptions = {}
): Promise<{ outline: string; characters: string; chapter1: string; provider: string }> {
  // Auto-load stored keys if none explicitly provided
  if (!options.openaiKey && !options.groqKey && !options.togetherKey && !options.geminiKey && !options.openrouterKey && !options.cohereKey) {
    const stored = buildOptionsFromStoredKeys();
    options = { ...stored, ...options };
  }

  const lengthGuide: Record<string, string> = {
    short: '5-10 chapters, novella length (~20,000 words)',
    medium: '15-25 chapters, full novel (~60,000 words)',
    epic: '30+ chapters, epic saga (~100,000+ words)',
  };

  const prompt = `Develop a complete story from this premise: "${premise}"

Genre: ${genre}
Tone: ${tone}
Target Length: ${lengthGuide[targetLength] || lengthGuide.medium}

Provide:
1. A 5-point story outline (Beginning, Inciting Incident, Rising Action, Climax, Resolution)
2. 4-6 main characters with names, roles, and brief descriptions
3. The opening chapter (3-5 compelling paragraphs)

Format exactly as:
OUTLINE:
1. ...
2. ...
3. ...
4. ...
5. ...

CHARACTERS:
- Name: Role — Description

CHAPTER 1:
[opening chapter]`;

  const result = await generateWithFallback(prompt, 'develop', '', options);

  const outlineMatch = result.text.match(/OUTLINE:([\s\S]*?)(?=CHARACTERS:|$)/i);
  const charactersMatch = result.text.match(/CHARACTERS:([\s\S]*?)(?=CHAPTER \d*:|$)/i);
  const chapterMatch = result.text.match(/CHAPTER \d*:([\s\S]*)/i);

  return {
    outline: outlineMatch ? outlineMatch[1].trim() : '1. The journey begins\n2. A challenge arises\n3. The protagonist grows\n4. The climactic confrontation\n5. Resolution and new beginning',
    characters: charactersMatch ? charactersMatch[1].trim() : '- Protagonist: Hero — The main character\n- Mentor: Guide — Wise advisor\n- Ally: Friend — Loyal companion\n- Antagonist: Villain — The opposition',
    chapter1: chapterMatch ? chapterMatch[1].trim() : result.text,
    provider: result.provider,
  };
}

// ============================================================
// AI STORY DEVELOPER — Q&A mode asks questions
// ============================================================

export async function generateNextQuestion(
  previousAnswers: Array<{ question: string; answer: string }>,
  options: AIGenerateOptions = {}
): Promise<{ question: string; isReady: boolean; story?: string; provider: string }> {
  // Auto-load stored keys
  if (!options.openaiKey && !options.groqKey && !options.togetherKey && !options.geminiKey && !options.openrouterKey && !options.cohereKey) {
    const stored = buildOptionsFromStoredKeys();
    options = { ...stored, ...options };
  }

  const answersText = previousAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n');

  // After 5 questions, generate the story
  if (previousAnswers.length >= 5) {
    const premise = previousAnswers.map((a) => a.answer).join('. ');
    const developed = await developStoryAuto(
      premise,
      previousAnswers.find((a) => a.question.toLowerCase().includes('genre'))?.answer || 'Fantasy',
      previousAnswers.find((a) => a.question.toLowerCase().includes('tone'))?.answer || 'Dramatic',
      'medium',
      options
    );
    return {
      question: '',
      isReady: true,
      story: `## ${developed.outline.split('\n')[0] || 'Your Story'}\n\n### Characters\n${developed.characters}\n\n### Chapter 1\n${developed.chapter1}`,
      provider: developed.provider,
    };
  }

  const prompt = `Based on these answers so far, ask the NEXT most important question to help develop a story:\n\n${answersText}\n\nAsk ONLY one concise question (1-2 sentences). Make it specific and creative. The question should help flesh out the world, characters, or plot.`;

  const result = await generateWithFallback(prompt, 'question', '', options);
  return {
    question: result.text.replace(/^["""]*|["""]*$/g, '').trim(),
    isReady: false,
    provider: result.provider,
  };
}

// ============================================================
// LOCAL FALLBACK ENGINE (Never fails, always works offline)
// ============================================================

function localFallback(_prompt: string, mode: string, companionId: string): string {
  const flavors: Record<string, string> = {
    eldrin: 'The scene unfolds with deliberate care, each detail placed like a stone in an arch.',
    lyra: 'Action explodes across the page — no time to breathe, only time to fight!',
    shadow: 'Something lurks beneath the surface. Not everything is it seems...',
    melody: 'The words dance together, a duet of emotion and melody.',
  };
  const flavor = flavors[companionId] || flavors.eldrin;

  const responses: Record<string, string> = {
    do: `The world shifted around them, shadows lengthening as the sun dipped below the horizon. Every step forward felt heavier, as if the very air had thickened with anticipation. ${flavor}\n\nThey pressed on, driven by a determination that burned brighter than their fear. The path ahead twisted through ancient ruins, their surfaces etched with symbols that seemed to pulse with an otherworldly light.`,
    say: `"I don't think we should be here," whispered Elara, her eyes darting between the crumbling pillars.\n\nKael grinned, the kind of smile that suggested he found danger more enticing than wisdom. "That's exactly why we are. The best stories never start in safe places."\n\n"Your definition of 'best' and mine differ significantly," she replied, tightening her grip on the lantern.`,
    story: `The chamber opened before them like the maw of some great beast, its depths lost to darkness that no torch could pierce. Elara felt her breath catch — not from fear, though there was plenty of that, but from the sheer scale of what they had discovered.\n\n${flavor}\n\n"By the Twelve," Kael breathed, his usual bravado momentarily forgotten. "It's real. All of it."\n\nElara stepped forward, her boots crunching on debris that hadn't been disturbed in centuries. The air tasted of dust and old magic, that peculiar metallic tang that prickled at the back of her throat.`,
    grammar: '',
    suggest: '[Style] Vary sentence structure | Fix: Mix short punchy sentences with longer flowing ones\n[Description] Add sensory details | Fix: Include what characters see, hear, smell, and feel\n[Dialogue] Give each character a distinct voice | Fix: Unique speech patterns, vocabulary, and rhythm per character',
    translate: '',
    summarize: 'The characters explore an ancient chamber filled with mystery and magic, discovering something that changes their understanding of their quest.',
    mix: `OUTLINE: A bold new tale woven from the threads of your existing stories, creating something entirely fresh yet comfortingly familiar.\n\nCHAPTER 1:\n${flavor}\n\nThe old tales spoke of convergence — moments when separate paths would merge into one. None who heard the legends believed they would live to see such a day. Yet here they stood, strangers from different worlds, bound together by forces they were only beginning to understand. Each carried the weight of their own story, their own triumphs and tragedies, their own reasons for being here. And now those stories would become one.`,
    develop: `OUTLINE:\n1. An ordinary world disrupted by an extraordinary call\n2. The reluctant hero accepts the burden of destiny\n3. Allies are gathered, enemies revealed, stakes raised\n4. The darkest hour before the dawn\n5. Victory through sacrifice, growth through struggle\n\nCHARACTERS:\n- Kael: Protagonist — A reluctant hero with a mysterious past\n- Elara: Mentor — Wise guide who sees potential in Kael\n- Mira: Ally — Fierce warrior with her own secret agenda\n- The Shadow King: Antagonist — Ancient evil awakening after centuries\n\nCHAPTER 1:\n${flavor}\n\nThe letter arrived on the night of the red moon, sealed with wax the color of old blood. Kael almost didn't open it. He had learned, over thirty years of hard living, that messages delivered under strange skies rarely brought good news. But something — perhaps the way the seal seemed to pulse in the lamplight, or perhaps simply the weight of the parchment — made him break the wax.\n\nThe words inside would change everything.`,
    question: "What kind of world does your story take place in? (A bustling medieval city, a distant space station, a magical forest...)",
  };
  return responses[mode] || responses.story;
}

// ============================================================
// EXPORTS: Languages, Templates, Mix Styles, Questions
// ============================================================

export const TRANSLATION_LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' }, { code: 'pl', name: 'Polish' }, { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' }, { code: 'zh', name: 'Chinese' }, { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' }, { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' }, { code: 'th', name: 'Thai' }, { code: 'id', name: 'Indonesian' },
  { code: 'sv', name: 'Swedish' }, { code: 'cs', name: 'Czech' },
];

export const WRITING_TEMPLATES = [
  { id: 'hero-journey', name: "The Hero's Journey", desc: 'Classic 12-step hero arc', prompt: 'Write the next scene following the Hero\'s Journey structure. The hero faces a test that will change them forever.' },
  { id: 'meet-cute', name: 'Meet Cute', desc: 'Romantic first encounter', prompt: 'Write a charming, unexpected meeting between two characters who are destined for each other.' },
  { id: 'plot-twist', name: 'Plot Twist', desc: 'Shocking revelation', prompt: 'Write a scene that reveals a secret completely recontextualizing everything the characters believed.' },
  { id: 'battle', name: 'Epic Battle', desc: 'Climactic fight scene', prompt: 'Write an intense battle scene where the stakes are life, death, and the fate of the world.' },
  { id: 'heist', name: 'The Heist', desc: 'Planning and execution', prompt: 'Write the moment the heist begins to go wrong, and the team must improvise.' },
  { id: 'discovery', name: 'Ancient Discovery', desc: 'Uncovering lost secrets', prompt: 'Write the moment the characters discover something ancient and powerful that should have stayed hidden.' },
  { id: 'betrayal', name: 'Betrayal', desc: 'Trust shattered', prompt: 'Write the devastating scene where a trusted ally reveals their true allegiance.' },
  { id: 'redemption', name: 'Redemption Arc', desc: 'A villain seeks forgiveness', prompt: 'Write the scene where a former villain takes their first step toward redemption.' },
  { id: 'sacrifice', name: 'The Sacrifice', desc: 'Ultimate act of love', prompt: 'Write the moment a character chooses to sacrifice everything for someone they love.' },
  { id: 'reunion', name: 'Emotional Reunion', desc: 'Long-lost characters meet', prompt: 'Write an emotional reunion between characters who thought they would never see each other again.' },
];

export const MIX_STYLES = [
  { id: 'blend', name: 'Seamless Blend', desc: 'Merge stories into one coherent narrative', icon: 'git-merge' },
  { id: 'crossover', name: 'Crossover', desc: 'Characters from different stories meet', icon: 'shuffle' },
  { id: 'inspired', name: 'Inspired By', desc: 'New story inspired by themes and elements', icon: 'sparkles' },
  { id: 'mashup', name: 'Wild Mashup', desc: 'Surprising combination of the best elements', icon: 'zap' },
];

export const INITIAL_QUESTIONS = [
  "What's the core premise? (e.g., 'A dragon who wants to be a librarian')",
  "What genre speaks to you? (Fantasy, Sci-Fi, Romance, Horror, etc.)",
  "What's the emotional tone? (Dark and gritty, Lighthearted, Epic, Intimate...)",
  "Who is your protagonist? (A reluctant hero, a cunning rogue, a lost soul...)",
  "What drives the story? (Revenge, Love, Discovery, Survival, Redemption...)",
];

// ============================================================
// TEXT-TO-SPEECH — Free browser API + Premium ElevenLabs
// ============================================================

/** Speak text using browser's built-in TTS (free, no key needed) */
export function speakTextBrowser(text: string, voiceName?: string, rate = 1, pitch = 1): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  if (voiceName) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name.includes(voiceName));
    if (voice) utterance.voice = voice;
  }
  window.speechSynthesis.speak(utterance);
}

/** Check if browser TTS is available */
export function isBrowserTTSAvailable(): boolean {
  return 'speechSynthesis' in window;
}

/** Get available browser voices */
export function getBrowserVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

/** Stop any playing TTS */
export function stopTTS(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
