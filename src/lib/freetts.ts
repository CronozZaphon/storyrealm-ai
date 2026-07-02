// ============================================================
// FREETTS.ORG — Free Professional Text-to-Speech
// 400+ neural voices, 75+ languages, 48kHz MP3
// Cost: $0. API Key: NONE. Rate limit: 20/min
// ============================================================

export interface FreeTTSVoice {
  id: string;
  name: string;
  lang: string;
  gender: string;
  preview: string;
}

export const FREETTS_VOICES: FreeTTSVoice[] = [
  // English - Best quality storytelling voices
  { id: 'en-US-JennyNeural', name: 'Jenny (US Female)', lang: 'English', gender: 'Female', preview: 'Warm, expressive storytelling voice' },
  { id: 'en-US-GuyNeural', name: 'Guy (US Male)', lang: 'English', gender: 'Male', preview: 'Deep, authoritative narrative voice' },
  { id: 'en-US-AriaNeural', name: 'Aria (US Female)', lang: 'English', gender: 'Female', preview: 'Bright, youthful narrator' },
  { id: 'en-US-DavisNeural', name: 'Davis (US Male)', lang: 'English', gender: 'Male', preview: 'Calm, measured storytelling' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female)', lang: 'English', gender: 'Female', preview: 'British accent, elegant narration' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male)', lang: 'English', gender: 'Male', preview: 'British accent, classic narrator' },
  { id: 'en-AU-NatashaNeural', name: 'Natasha (AU Female)', lang: 'English', gender: 'Female', preview: 'Australian accent, warm' },
  { id: 'en-IN-NeerjaNeural', name: 'Neerja (IN Female)', lang: 'English', gender: 'Female', preview: 'Indian accent, melodic' },
  // Japanese
  { id: 'ja-JP-NanamiNeural', name: 'Nanami (JP Female)', lang: 'Japanese', gender: 'Female', preview: 'Anime-style narration' },
  // Spanish
  { id: 'es-ES-ElviraNeural', name: 'Elvira (ES Female)', lang: 'Spanish', gender: 'Female', preview: 'Castilian storytelling' },
  // French
  { id: 'fr-FR-DeniseNeural', name: 'Denise (FR Female)', lang: 'French', gender: 'Female', preview: 'Elegant French narration' },
  // German
  { id: 'de-DE-KatjaNeural', name: 'Katja (DE Female)', lang: 'German', gender: 'Female', preview: 'Clear German storytelling' },
];

/** Convert text to speech using FreeTTS.org */
export async function freeTTSConvert(
  text: string,
  voiceId: string = 'en-US-JennyNeural',
  rate: string = '+0%',
  pitch: string = '+0Hz'
): Promise<{ audioUrl: string; fileId: string }> {
  const response = await fetch('https://freetts.org/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text.slice(0, 5000), // FreeTTS limit
      voice: voiceId,
      rate,
      pitch,
    }),
  });

  if (!response.ok) {
    throw new Error(`FreeTTS error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.file_id) {
    throw new Error('FreeTTS returned no file_id');
  }

  return {
    audioUrl: `https://freetts.org/api/audio/${data.file_id}`,
    fileId: data.file_id,
  };
}

/** Check if FreeTTS is available */
export async function isFreeTTSAvailable(): Promise<boolean> {
  try {
    const response = await fetch('https://freetts.org/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'test', voice: 'en-US-JennyNeural' }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
