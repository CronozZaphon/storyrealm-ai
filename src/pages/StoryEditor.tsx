import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Send, BookOpen, MessageCircle, FileText, Check, AlertCircle, Lightbulb, Wand2, ChevronLeft, Zap, User, Ghost, Heart, Users, X, Globe, Target, Download } from 'lucide-react'
import { generateWithFallback, translateText, TRANSLATION_LANGUAGES, WRITING_TEMPLATES, hasPremiumKeys, getPreferredProviderName } from '@/lib/ai-engine'
import { storyDB } from '@/lib/db-client'

type StoryMode = 'story' | 'do' | 'say'

interface Suggestion { type: string; message: string; fix: string }
interface GrammarResult { corrected: string; explanations: string[] }

interface Companion {
  id: string; name: string; title: string; image: string; role: string;
  greetings: string[]; encouragements: string[]; writingTips: string[]; praises: string[]; farewells: string[];
}

const COMPANIONS: Record<string, Companion> = {
  eldrin: { id: 'eldrin', name: 'Eldrin the Wise', title: 'Grand Wizard of the Quill', image: './wizard-guide.png', role: 'Guide & Mentor', greetings: ["Ah, a fellow seeker of stories. Welcome to my tower.", "The quill has been waiting for your hand, author.", "Another day, another chapter in the making of legends.", "Come in, come in. The fire is warm and the ideas are flowing.", "I sensed your creative spirit approaching. Let's weave some magic."], encouragements: ["Every great tome began with a single uncertain word. You have already surpassed that.", "Do not fear the blank page—it fears you, for you give it purpose.", "Your words carry weight, young author. Trust in their power.", "Even the greatest bards had days of doubt. Perseverance is the truest spell.", "The story you tell today may be the one that changes someone's world tomorrow.", "The ink flows through you, not from you. You are merely the vessel for great tales.", "I have seen many authors begin their journey. Few have your dedication.", "Do not compare your chapter one to someone else's chapter twenty."], writingTips: ["Show, don't tell—let your readers discover the world through senses, not lectures.", "Every character should want something, even if it's just a glass of water.", "The first line is a promise to the reader. Make it unforgettable.", "Conflict is the heartbeat of story. Without it, prose is merely description.", "Read your dialogue aloud. If it sounds strange spoken, it reads strange written.", "A chapter should end with a question, not an answer.", "The setting is a character. Give it desires, moods, and secrets.", "Backstory is seasoning, not the main course. Sprinkle, don't pour."], praises: ["Magnificent! Your prose flows like the River of Eternal Ink!", "By the Twelve Archives, that is a passage worthy of the Great Library itself!", "You have the gift, author. Never doubt it.", "Ah, now THAT is how you craft a scene. Bravely done!", "The Old Masters would bow to such craftsmanship. Exquisite!", "I shall recommend your work to the Council of Scribes!", "That metaphor is... *chef's kiss* ...divinely inspired!"], farewells: ["Go forth and write. The realm needs your stories.", "Until next we meet, may your ink never run dry.", "The tower doors are always open to you, storyteller."] },
  lyra: { id: 'lyra', name: 'Lyra Stormblade', title: 'Champion of the Written Word', image: './warrior-praise.png', role: 'Motivator & Editor', greetings: ["Draw your pen like a sword, author! The blank page is our battlefield!", "Ha! Another brave soul ready to conquer the empty page!", "Stand tall, writer. Today we forge legends.", "The chapter awaits, and I am here to guard your creative spirit!", "Armor up, wordsmith. We've got stories to conquer!"], encouragements: ["A mighty pen IS sharper than any sword! Strike true, author!", "Fear is just excitement in need of better direction. Charge forward!", "Every word you write is a victory. Count them as such!", "The greatest battles aren't won by the cautious. Be bold in your prose!", "You have already survived the hardest part—beginning. Everything else is momentum!", "I've seen dragons fall to weaker weapons than your vocabulary!", "That scene? That scene could make a stone weep! Power on!", "Quitters write outlines. FINISHERS write LEGENDS!"], writingTips: ["Start with action. Hook them in the first paragraph or lose them forever.", "Your protagonist should DO things, not just think about doing them.", "Make every scene fight for its place. If it doesn't advance the story, kill it.", "Pacing is everything. Alternate between breathless action and quiet moments.", "Give your villain a point. The best antagonists believe they're the hero.", "Subvert expectations, but earn the twist. Don't cheat your reader.", "A fight scene is choreography. Every move must serve the story.", "End chapters on cliffhangers. Sleep is for the weak—and your readers!"], praises: ["BY THE GODS! That scene could topple empires! Magnificent!", "You write like a warrior fights—fearless and true!", "HA! Now THAT is how you wield a story! I am PROUD!", "The fire in your words could light the darkest dungeon!", "A champion's work! The realm shall sing of this tale!", "I'd follow that protagonist into ANY battle!", "*slams table* THAT is what I'm talking about! RAW POWER!"], farewells: ["Fight on, author. Victory belongs to those who persist.", "Keep your pen sharp and your spirit sharper!", "When doubt strikes, strike back twice as hard. Write on!"] },
  shadow: { id: 'shadow', name: 'Shadow Whisper', title: 'Keeper of Secrets', image: './rogue-mystery.png', role: 'Mystery & Suspense Specialist', greetings: ["*steps from the shadows* I have been watching... your potential is intriguing.", "The darkness holds many stories. Shall we uncover them together?", "Secrets are merely stories waiting for the right moment to be told.", "I see what others miss. Let me show you the hidden paths of narrative.", "*materializes beside you* Even shadows need scribes..."], encouragements: ["The best secrets are buried in plain sight. Your readers will never see it coming.", "Doubt is your ally. Let the reader question everything... then reveal the truth.", "Not all heroes walk in light. Some of the best stories lurk in darkness.", "Trust nothing. Question everything. That is where the best plots are born.", "You are not just writing a story... you are crafting an illusion. Make it perfect.", "I have woven a thousand deceptions. You show promise, young one.", "They think they know where this is going. Let them think that.", "The most satisfying twist is the one they SHOULD have seen coming."], writingTips: ["Plant clues early. The best mysteries hide answers where readers least expect them.", "An unreliable narrator is a double-edged blade—wield it with precision.", "Withhold the full picture. Let shadows obscure just enough to create obsession.", "The reveal should recontextualize everything. Make your readers gasp.", "Silence speaks louder than words. What you DON'T say is as important as what you do.", "Red herrings are art. Make them too obvious and you're insulting your reader.", "The best lies contain a kernel of truth. The best truths contain a whisper of doubt.", "Paranoia is a spice. Use it sparingly, or the whole dish becomes bitter."], praises: ["*sharp intake of breath* Devious. I could not have orchestrated it better myself.", "The threads of your mystery weave a web even I would fear to navigate.", "Clever. Very clever. Your readers will lose sleep over this twist.", "That reveal... *slow clap* ...masterfully executed in shadow.", "You have the instincts of a true plot-weaver. Impressive... most impressive.", "*whispers* They will never see it coming. Brilliantly woven.", "The shadows themselves are jealous of your narrative craft."], farewells: ["Watch the shadows... they are watching you back. Write well.", "Every secret must eventually be told. Make yours worth the wait.", "Vanish into your story. I'll be here when you return."] },
  melody: { id: 'melody', name: 'Melody Quickstring', title: 'Bard of the Eternal Song', image: './bard-audio.png', role: 'Voice & Dialogue Expert', greetings: ["*strums lute* A new story to set to music? Marvelous!", "Hello, hello! The tavern of tales is open for business!", "*melodic laugh* I've been composing a ballad about YOU, author!", "Every story has a song hidden inside it. Let's find yours!", "The muses sent me! They said you needed a little musical inspiration!"], encouragements: ["Your words sing, author! Let them carry across the realms!", "Even the saddest tale deserves beautiful telling. You have that gift.", "A story unwritten is a song unsung. Give it voice!", "The best bards aren't born—they're made, one verse at a time. Keep singing!", "Your dialogue flows like a river of melody. Truly enchanting!", "I would play your scenes in every tavern from here to the Far Coast!", "That line? THAT LINE? I'm stealing it for my next ballad!", "You make the heartstrings vibrate. That is TRUE magic!"], writingTips: ["Read everything aloud. If it doesn't sing, it doesn't work.", "Each character should sound different on the page. Give them unique rhythms.", "Dialogue tags are spices—use them sparingly, but make each one flavorful.", "Emotional beats land harder in silence. Let your characters pause.", "The spaces between words are where the music lives.", "Love is a duet, not a solo. Both voices must be heard.", "Humor is timing. Punchlines are percussion in your prose symphony.", "The most powerful moment in a scene is often the unspoken one."], praises: ["*plays a triumphant chord* BRAVO! That passage belongs in the Hall of Legends!", "I shall compose a symphony inspired by your prose!", "That dialogue crackles with life! The tavern would go WILD for this tale!", "*wiping a tear* Beautiful. Simply beautiful. You moved even MY heart.", "A standing ovation from every bard in the realm! ENCORE!", "The guild masters are going to be SO jealous of your talent!", "*whispers* That emotional beat? Perfect. Absolutely perfect."], farewells: ["May your ink sing and your heart stay light!", "I'll save you a seat by the fire. Come back with more tales!", "The song continues... even when we rest. Write on, dear friend!"] },
}

function getRandomLine(lines: string[]): string { return lines[Math.floor(Math.random() * lines.length)] }

export default function StoryEditor() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [mode, setMode] = useState<StoryMode>('story')
  const [storyText, setStoryText] = useState('')
  const [instruction, setInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showGrammar, setShowGrammar] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [memory, setMemory] = useState<string[]>([])
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [companionId, setCompanionId] = useState(() => localStorage.getItem('storyrealm_companion') || 'eldrin')
  const [showCompanionPicker, setShowCompanionPicker] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showTranslate, setShowTranslate] = useState(false)
  const [translateLang, setTranslateLang] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [companionLine, setCompanionLine] = useState('')
  const [companionLineType, setCompanionLineType] = useState<'greetings'|'encouragements'|'writingTips'|'praises'>('greetings')
  const [lastProvider, setLastProvider] = useState<string | null>(null)
  const [premiumStatus, setPremiumStatus] = useState({ hasPremium: false, provider: 'Free Tier' })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPremiumStatus({
      hasPremium: hasPremiumKeys(),
      provider: getPreferredProviderName(),
    })
  }, [])

  const companion = COMPANIONS[companionId] || COMPANIONS.eldrin

  // Load saved session
  useEffect(() => {
    if (storyId) {
      storyDB.getSession(Number(storyId)).then((content) => {
        if (content) setStoryText(content)
      })
    }
  }, [storyId])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!storyId || !storyText) return
    const interval = setInterval(() => {
      storyDB.saveSession(Number(storyId), storyText)
      setLastSaved(new Date().toLocaleTimeString())
    }, 30000)
    return () => clearInterval(interval)
  }, [storyId, storyText])

  useEffect(() => { setCharCount(storyText.length); setWordCount(storyText.split(/\s+/).filter(Boolean).length) }, [storyText])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [storyText])

  useEffect(() => {
    const types: Array<'greetings'|'encouragements'|'writingTips'|'praises'> = ['greetings','encouragements','writingTips','praises']
    const type = types[Math.floor(Math.random() * types.length)]
    setCompanionLineType(type)
    setCompanionLine(getRandomLine(companion[type]))
  }, [companion])

  const refreshCompanionLine = useCallback(() => {
    const types: Array<'greetings'|'encouragements'|'writingTips'|'praises'> = ['greetings','encouragements','writingTips','praises']
    const type = types[Math.floor(Math.random() * types.length)]
    setCompanionLineType(type)
    setCompanionLine(getRandomLine(companion[type]))
  }, [companion])

  const handleGenerate = async () => {
    if (!instruction.trim()) return
    setIsGenerating(true)
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    const result = await generateWithFallback(instruction, mode, storyText.slice(-2000), {
      companionId, apiKey, openaiKey: apiKey,
    })
    if (result.text) {
      const newText = storyText + (storyText ? '\n\n' : '') + result.text
      setStoryText(newText)
      if (storyId) storyDB.saveSession(Number(storyId), newText)
      setMemory((prev) => [...prev, `[${mode.toUpperCase()}] ${instruction} (${result.provider})`])
      setLastProvider(result.provider)
      setCompanionLineType('praises')
      setCompanionLine(getRandomLine(companion.praises))
    }
    setInstruction('')
    setIsGenerating(false)
  }

  const checkGrammar = async () => {
    if (!storyText.trim()) return
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    setIsGenerating(true)
    const result = await generateWithFallback(storyText, 'grammar', '', { apiKey })
    setIsGenerating(false)
    if (result.text) {
      setGrammarResult({ corrected: result.text, explanations: ['AI-powered grammar improvements applied'] })
    } else {
      let corrected = storyText.replace(/\bi\b/g, 'I').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?])/g, '$1').replace(/([.,;:!?])([^\s])/g, '$1 $2').replace(/\s+$/g, '')
      const explanations: string[] = []
      if (storyText.match(/\bi\b/)) explanations.push('Capitalized "I" pronouns')
      if (storyText.match(/\s{2,}/)) explanations.push('Removed extra spaces')
      if (storyText.match(/\s+[.,;:!?]/)) explanations.push('Fixed spacing before punctuation')
      if (explanations.length === 0) explanations.push('Your writing looks great!')
      setGrammarResult({ corrected, explanations })
    }
    setShowGrammar(true)
  }

  const getSuggestions = async () => {
    if (!storyText.trim()) return
    setIsGenerating(true)
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    const result = await generateWithFallback(storyText, 'suggest', memory.join('\n'), { apiKey })
    setIsGenerating(false)
    // Parse suggestions from text
    const lines = result.text.split('\n').filter(Boolean)
    const parsed: Suggestion[] = []
    for (const line of lines) {
      const match = line.match(/\[?([^\]|]+)\]?\s*(.+)/)
      if (match) parsed.push({ type: match[1].trim(), message: match[2].trim(), fix: 'Apply this suggestion to improve your writing' })
    }
    if (parsed.length === 0) parsed.push(
      { type: 'Style', message: 'Vary sentence length for better rhythm', fix: 'Mix short and long sentences' },
      { type: 'Description', message: 'Add sensory details', fix: 'Include sights, sounds, smells' },
      { type: 'Dialogue', message: 'Give characters distinct voices', fix: 'Unique speech patterns per character' },
    )
    setSuggestions(parsed)
    setShowSuggestions(true)
  }

  const handleTranslate = async () => {
    if (!storyText.trim()) return
    setIsTranslating(true)
    const apiKey = localStorage.getItem('deepl_api_key') || undefined
    const result = await translateText(storyText, translateLang, apiKey)
    setTranslatedText(result.translated)
    setIsTranslating(false)
  }

  const handleExport = () => {
    const blob = new Blob([storyText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `story-chapter-${new Date().toISOString().split('T')[0]}.md`; a.click()
    URL.revokeObjectURL(url)
  }

  const applyCorrection = () => { if (grammarResult) { setStoryText(grammarResult.corrected); setShowGrammar(false) } }
  const selectCompanion = (id: string) => { setCompanionId(id); localStorage.setItem('storyrealm_companion', id); setShowCompanionPicker(false); setCompanionLineType('greetings'); setCompanionLine(getRandomLine(COMPANIONS[id].greetings)) }
  const useTemplate = (prompt: string) => { setInstruction(prompt); setShowTemplates(false) }

  const modeConfig: Record<StoryMode, { icon: typeof FileText; label: string; placeholder: string; color: string }> = {
    story: { icon: FileText, label: 'Story', placeholder: 'Continue the narrative...', color: 'text-purple-400' },
    do: { icon: Zap, label: 'Do', placeholder: 'Describe an action or event...', color: 'text-amber-400' },
    say: { icon: MessageCircle, label: 'Say', placeholder: 'Write dialogue...', color: 'text-emerald-400' },
  }
  const typeLabels: Record<string, string> = { greetings: 'GREETING', encouragements: 'WISDOM', writingTips: 'WRITING TIP', praises: 'PRAISE' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white flex flex-col">
      {/* Companion Picker */}
      <Dialog open={showCompanionPicker} onOpenChange={setShowCompanionPicker}>
        <DialogContent className="bg-slate-900 border-purple-800/30 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-amber-400" /> Choose Your Companion</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-400 mb-4">Select a character to guide your writing journey.</p>
          <div className="space-y-3">
            {Object.values(COMPANIONS).map((c) => (
              <button key={c.id} onClick={() => selectCompanion(c.id)} className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${companionId === c.id ? 'border-amber-500 bg-amber-900/20' : 'border-purple-800/20 bg-slate-800/30 hover:border-purple-500/40'}`}>
                <img src={c.image} alt={c.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-800/30 shrink-0" />
                <div><p className="text-sm font-bold text-amber-400">{c.name}</p><p className="text-xs text-slate-400">{c.title} &middot; {c.role}</p></div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="bg-slate-900 border-purple-800/30 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-amber-400" /> Writing Templates</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-400 mb-4">Click a template to load it into the AI instruction box.</p>
          <div className="space-y-2">
            {WRITING_TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => useTemplate(t.prompt)} className="w-full text-left p-3 rounded-lg border border-purple-800/20 bg-slate-800/30 hover:border-amber-500/40 hover:bg-amber-900/10 transition-all">
                <p className="font-bold text-sm text-amber-400">{t.name}</p><p className="text-xs text-slate-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={showTranslate} onOpenChange={setShowTranslate}>
        <DialogContent className="bg-slate-900 border-purple-800/30 text-white max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-amber-400" /> Translate Story</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <select value={translateLang} onChange={(e) => setTranslateLang(e.target.value)} className="w-full bg-slate-800 border border-purple-800/30 rounded-lg px-3 py-2 text-white text-sm">
              {TRANSLATION_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <Button onClick={handleTranslate} disabled={isTranslating} className="w-full bg-gradient-to-r from-purple-600 to-amber-600">
              {isTranslating ? <Sparkles className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />} Translate
            </Button>
            {translatedText && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Translated Text:</p>
                <ScrollArea className="h-48 bg-slate-800/50 rounded-lg p-3"><p className="text-sm text-slate-300 whitespace-pre-wrap">{translatedText}</p></ScrollArea>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}><ChevronLeft className="w-4 h-4" /></Button>
            <div>
              <h1 className="font-bold text-lg">Story Editor</h1>
              <p className="text-xs text-slate-400">{wordCount} words &middot; {charCount} chars {lastSaved && `&middot; Saved ${lastSaved}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-amber-800/30 text-amber-400 hidden sm:flex" onClick={() => setShowTemplates(true)}><Target className="w-4 h-4 mr-1" /> Templates</Button>
            <Button size="sm" variant="outline" className="border-cyan-800/30 text-cyan-400 hidden sm:flex" onClick={() => setShowTranslate(true)}><Globe className="w-4 h-4 mr-1" /> Translate</Button>
            <Button size="sm" variant="outline" className="border-emerald-800/30 text-emerald-400" onClick={handleExport}><Download className="w-4 h-4 mr-1" /> Export</Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}><Heart className="w-4 h-4 text-rose-400" /></Button>
          </div>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="border-b border-purple-800/20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
          <Tabs value={mode} onValueChange={(v) => setMode(v as StoryMode)} className="w-auto">
            <TabsList className="bg-slate-800/50 border border-purple-800/20">
              {(Object.keys(modeConfig) as StoryMode[]).map((m) => {
                const Icon = modeConfig[m].icon
                return <TabsTrigger key={m} value={m} className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-1.5 px-4"><Icon className="w-4 h-4" />{modeConfig[m].label}</TabsTrigger>
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 min-h-[400px] mb-4">
            <Textarea value={storyText} onChange={(e) => setStoryText(e.target.value)}
              placeholder={`Begin your epic tale here... ${companion.name} is ready to guide you!`}
              className="min-h-[400px] bg-slate-900/40 border-purple-800/20 text-white placeholder:text-slate-600 resize-none font-serif text-base leading-relaxed" />
            <div ref={bottomRef} />
          </ScrollArea>

          {/* AI Input */}
          <div className="bg-slate-900/60 border border-purple-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {(() => { const Icon = modeConfig[mode].icon; return <Icon className={`w-4 h-4 ${modeConfig[mode].color}`} /> })()}
              <span className="text-sm font-semibold text-slate-300">
                {mode === 'story' && 'What happens next?'}{mode === 'do' && 'What action?'}{mode === 'say' && 'What do they say?'}
              </span>
              <div className="flex-1" />
              <button onClick={() => setShowTemplates(true)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"><Target className="w-3 h-3" /> Templates</button>
            </div>
            <div className="flex gap-2">
              <Textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder={modeConfig[mode].placeholder}
                className="flex-1 bg-slate-800/50 border-purple-800/20 text-white placeholder:text-slate-600 resize-none min-h-[60px]"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() } }} />
              <Button onClick={handleGenerate} disabled={isGenerating || !instruction.trim()}
                className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 self-end">
                {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 border-l border-purple-800/20 bg-slate-900/30 p-4 space-y-4">
          {/* Premium Status */}
          <div className={`rounded-lg p-3 border ${premiumStatus.hasPremium ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-purple-950/20 border-purple-800/30'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {premiumStatus.hasPremium ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-300 font-medium">{premiumStatus.provider}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300">Free AI Active</span>
                  </>
                )}
              </div>
              <button onClick={() => navigate('/integrations')} className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> Upgrade
              </button>
            </div>
            {lastProvider && (
              <p className="text-[10px] text-slate-500 mt-1">Last used: {lastProvider}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400" /> AI Tools</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={checkGrammar} disabled={isGenerating}>
                <Check className="w-4 h-4 mr-2 text-emerald-400" /> Check Grammar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={getSuggestions} disabled={isGenerating}>
                <Lightbulb className="w-4 h-4 mr-2 text-amber-400" /> Get Suggestions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={() => setShowTemplates(true)}>
                <Target className="w-4 h-4 mr-2 text-rose-400" /> Templates
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={() => setShowTranslate(true)}>
                <Globe className="w-4 h-4 mr-2 text-cyan-400" /> Translate
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={() => navigate(`/manhua/${storyId}`)}>
                <BookOpen className="w-4 h-4 mr-2 text-rose-400" /> Make Manhua
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={() => navigate(`/audiobook/${storyId}`)}>
                <User className="w-4 h-4 mr-2 text-cyan-400" /> Make Audiobook
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-purple-800/30 hover:bg-purple-900/30" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2 text-emerald-400" /> Export MD
              </Button>
            </div>
          </div>

          {showGrammar && grammarResult && (
            <div className="bg-slate-800/50 border border-emerald-800/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Grammar</h4>
                <button onClick={() => setShowGrammar(false)} className="text-slate-500 hover:text-white"><X className="w-3 h-3" /></button>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 mb-3">
                {grammarResult.explanations.map((exp, i) => <li key={i} className="flex items-start gap-1"><AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />{exp}</li>)}
              </ul>
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={applyCorrection}>Apply Fixes</Button>
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-slate-800/50 border border-amber-800/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Suggestions</h4>
                <button onClick={() => setShowSuggestions(false)} className="text-slate-500 hover:text-white"><X className="w-3 h-3" /></button>
              </div>
              <div className="space-y-3">
                {suggestions.map((s, i) => <div key={i} className="text-xs"><Badge variant="outline" className="border-purple-800/30 text-purple-300 mb-1">{s.type}</Badge><p className="text-slate-300">{s.message}</p></div>)}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Ghost className="w-4 h-4 text-cyan-400" /> Story Memory</h3>
            <ScrollArea className="h-24">
              <div className="space-y-1">
                {memory.length === 0 ? <p className="text-xs text-slate-500 italic">AI context appears here...</p> : memory.slice(-5).map((m, i) => <div key={i} className="text-[10px] bg-slate-800/30 rounded p-1.5 text-slate-400 truncate">{m}</div>)}
              </div>
            </ScrollArea>
          </div>

          {/* Companion Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/30 border border-purple-800/30 rounded-xl p-4 text-center relative">
            <button onClick={() => setShowCompanionPicker(true)} className="absolute top-2 right-2 text-xs bg-slate-800/60 hover:bg-slate-700/60 rounded-full px-2 py-0.5 text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <Users className="w-3 h-3" /> Change
            </button>
            <img src={companion.image} alt={companion.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-amber-400/40 cursor-pointer hover:scale-105 transition-transform" onClick={refreshCompanionLine} title="Click for new advice" />
            <p className="text-xs text-amber-400 font-bold">{companion.name}</p>
            <p className="text-[10px] text-slate-500 mb-2">{companion.title}</p>
            <Badge variant="outline" className="border-purple-800/30 text-purple-300 text-[10px] mb-2">{typeLabels[companionLineType]}</Badge>
            <p className="text-xs text-slate-300 italic leading-relaxed">"{companionLine}"</p>
          </div>

          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 pt-2">
            <button onClick={() => navigate('/docs')} className="hover:text-slate-400">Help</button><span>&middot;</span>
            <button onClick={() => navigate('/terms')} className="hover:text-slate-400">Terms</button><span>&middot;</span>
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-400">Privacy</button>
          </div>
        </div>
      </div>
    </div>
  )
}
