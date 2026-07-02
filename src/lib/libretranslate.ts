// ============================================================
// LIBRETRANSLATE — Free Open-Source Translation
// 30+ languages, no API key, multiple public instances
// Cost: $0. Self-hostable.
// ============================================================

// Public instances (try in order of reliability)
const INSTANCES = [
  'https://libretranslate.de',
  'https://translate.argosopentech.com',
  'https://libretranslate.pussthecat.org',
  'https://translate.terraprint.co',
];

export const LIBRETRANSLATE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'cs', name: 'Czech' },
];

let workingInstance: string | null = null;

/** Find a working LibreTranslate instance */
async function getWorkingInstance(): Promise<string> {
  if (workingInstance) return workingInstance;

  for (const url of INSTANCES) {
    try {
      const response = await fetch(`${url}/languages`, { method: 'GET' });
      if (response.ok) {
        workingInstance = url;
        return url;
      }
    } catch { /* try next */ }
  }
  throw new Error('No LibreTranslate instance available');
}

/** Translate text using LibreTranslate */
export async function libreTranslate(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const base = await getWorkingInstance();

  const response = await fetch(`${base}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text',
    }),
  });

  if (!response.ok) {
    // If this instance fails, try others
    workingInstance = null;
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.translatedText || text;
}

/** Detect language */
export async function detectLanguage(text: string): Promise<string> {
  const base = await getWorkingInstance();

  const response = await fetch(`${base}/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text }),
  });

  if (!response.ok) return 'en';
  const data = await response.json();
  return data[0]?.language || 'en';
}

/** Check if LibreTranslate is available */
export async function isLibreTranslateAvailable(): Promise<boolean> {
  try {
    await getWorkingInstance();
    return true;
  } catch {
    return false;
  }
}
