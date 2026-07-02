// ============================================================
// PUTER.JS INTEGRATION — Premium AI at Zero Cost
// Users connect their Puter account, get GPT-4o/Claude/FLUX
// Cost to you: $0. Cost to users: $0.
// ============================================================

declare const puter: any;

export interface PuterStatus {
  available: boolean;
  authenticated: boolean;
  user?: { username: string };
}

/** Check if Puter.js is loaded and user is authenticated */
export function getPuterStatus(): PuterStatus {
  if (typeof puter === 'undefined') {
    return { available: false, authenticated: false };
  }
  return {
    available: true,
    authenticated: !!puter.auth?.isSignedIn?.(),
    user: puter.auth?.getUser?.() || undefined,
  };
}

/** Prompt user to sign in to Puter */
export async function signInToPuter(): Promise<boolean> {
  if (typeof puter === 'undefined') return false;
  try {
    await puter.auth.signIn();
    return true;
  } catch (e: any) {
    console.warn('[Puter] Sign in failed:', e.message);
    return false;
  }
}

/** Sign out from Puter */
export async function signOutFromPuter(): Promise<void> {
  if (typeof puter === 'undefined') return;
  try {
    await puter.auth.signOut();
  } catch (e) { /* noop */ }
}

/** Generate text using Puter's premium AI (GPT-4o, Claude, etc.) */
export async function puterGenerateText(
  prompt: string,
  systemPrompt?: string,
  model?: string
): Promise<{ text: string; model: string }> {
  if (typeof puter === 'undefined') {
    throw new Error('Puter.js not loaded');
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await puter.ai.chat(messages, {
    model: model || 'gpt-4o',
    stream: false,
  });

  return { text: response.toString(), model: model || 'gpt-4o' };
}

/** Generate image using Puter's FLUX/DALL-E */
export async function puterGenerateImage(
  prompt: string,
  width = 1024,
  height = 1024
): Promise<string> {
  if (typeof puter === 'undefined') {
    throw new Error('Puter.js not loaded');
  }

  const result = await puter.ai.imgGen(prompt, {
    width,
    height,
    model: 'openai/gpt-image-2',
  });

  // puter.ai.imgGen returns an image object with a play method or URL
  if (typeof result === 'string') return result;
  if (result?.url) return result.url;
  if (result?.src) return result.src;
  throw new Error('Image generation returned unexpected format');
}

/** Generate audio (TTS) using Puter's ElevenLabs integration */
export async function puterGenerateAudio(
  text: string,
  voice?: string
): Promise<string> {
  if (typeof puter === 'undefined') {
    throw new Error('Puter.js not loaded');
  }

  const result = await puter.ai.txt2speech(text, {
    voice: voice || 'alloy',
  });

  // Returns audio URL
  if (typeof result === 'string') return result;
  if (result?.audioUrl) return result.audioUrl;
  if (result?.url) return result.url;
  throw new Error('Audio generation returned unexpected format');
}

/** List available Puter models */
export function getPuterModels(): Array<{ id: string; name: string; type: string }> {
  return [
    { id: 'gpt-4o', name: 'GPT-4o (Best Quality)', type: 'text' },
    { id: 'claude', name: 'Claude 3.5 Sonnet', type: 'text' },
    { id: 'openai/gpt-image-2', name: 'GPT-Image-2 (Images)', type: 'image' },
    { id: 'flux', name: 'FLUX (High Quality Images)', type: 'image' },
    { id: 'alloy', name: 'Alloy (TTS Voice)', type: 'audio' },
    { id: 'nova', name: 'Nova (TTS Voice)', type: 'audio' },
  ];
}
