import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, ChevronLeft, Wand2, MessageCircle, Heart, Zap, BookOpen, Loader2, Save, Check, Feather, Lightbulb, User, Brain, Send, RotateCcw, Copy } from 'lucide-react'
import { storyDB } from '@/lib/db-client'
import { developStoryAuto, generateNextQuestion, INITIAL_QUESTIONS } from '@/lib/ai-engine'

type DevMode = 'auto' | 'qa'
type QaStep = 'start' | 'asking' | 'answering' | 'generating' | 'done'

const COMPANIONS = {
  shadow: {
    image: '/rogue-mystery.png',
    name: 'Shadow Whisper',
    autoGreeting: "*materializes from the darkness* You wish to birth a story from nothing? I shall be your midwife...",
    qaGreeting: "*steps closer* I will ask the right questions. Your answers will become the foundation of something... extraordinary.",
    autoPraise: "The shadows themselves are jealous of what you have created. A masterpiece born from pure imagination.",
    qaPraise: "You have answered well. The web is woven. Now behold what we have created together.",
  },
}

const GENRES = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Cyberpunk', 'Historical', 'Thriller', 'Adventure', 'Steampunk', 'Dystopian', 'Mythological']
const TONES = ['Dark and gritty', 'Lighthearted and fun', 'Epic and grand', 'Intimate and emotional', 'Suspenseful and tense', 'Whimsical and magical', 'Tragic and profound', 'Hopeful and uplifting']
const LENGTHS = [
  { id: 'short', label: 'Novella', desc: '~20,000 words, 5-10 chapters' },
  { id: 'medium', label: 'Novel', desc: '~60,000 words, 15-25 chapters' },
  { id: 'epic', label: 'Epic Saga', desc: '~100,000+ words, 30+ chapters' },
]

export default function AIStoryDeveloper() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<DevMode>('auto')
  const [qaStep, setQaStep] = useState<QaStep>('start')

  // Auto mode state
  const [premise, setPremise] = useState('')
  const [genre, setGenre] = useState('Fantasy')
  const [tone, setTone] = useState('Epic and grand')
  const [length, setLength] = useState('medium')
  const [isDeveloping, setIsDeveloping] = useState(false)

  // Q&A mode state
  const [qaAnswers, setQaAnswers] = useState<Array<{ question: string; answer: string }>>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [_qaIndex, setQaIndex] = useState(0)

  // Shared result state
  const [result, setResult] = useState<{ outline: string; characters: string; chapter1: string; provider: string } | null>(null)
  const [saved, setSaved] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const companion = COMPANIONS.shadow

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [result, qaAnswers])

  // AUTO MODE
  const handleAutoDevelop = async () => {
    if (!premise.trim()) return
    setIsDeveloping(true)
    setResult(null)
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    const companionId = localStorage.getItem('storyrealm_companion') || 'eldrin'

    const developed = await developStoryAuto(premise, genre, tone, length, {
      companionId, apiKey, openaiKey: apiKey,
    })
    setResult(developed)
    setIsDeveloping(false)
  }

  // Q&A MODE
  const startQA = () => {
    setQaStep('asking')
    setQaAnswers([])
    setQaIndex(0)
    setCurrentQuestion(INITIAL_QUESTIONS[0])
    setCurrentAnswer('')
  }

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return

    const newAnswers = [...qaAnswers, { question: currentQuestion, answer: currentAnswer }]
    setQaAnswers(newAnswers)
    setCurrentAnswer('')

    if (newAnswers.length >= 5) {
      setQaStep('generating')
      const apiKey = localStorage.getItem('openai_api_key') || undefined
      const companionId = localStorage.getItem('storyrealm_companion') || 'eldrin'

      const premise = newAnswers.map((a) => a.answer).join('. ')
      const genre = newAnswers.find((a) => a.question.toLowerCase().includes('genre'))?.answer || 'Fantasy'
      const tone = newAnswers.find((a) => a.question.toLowerCase().includes('tone'))?.answer || 'Epic and grand'

      const developed = await developStoryAuto(premise, genre, tone, 'medium', {
        companionId, apiKey, openaiKey: apiKey,
      })
      setResult(developed)
      setQaStep('done')
      return
    }

    // Generate next question using AI
    setQaStep('asking')
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    const companionId = localStorage.getItem('storyrealm_companion') || 'eldrin'

    const nextQ = await generateNextQuestion(newAnswers, { companionId, apiKey, openaiKey: apiKey })
    setCurrentQuestion(nextQ.question || INITIAL_QUESTIONS[Math.min(newAnswers.length, INITIAL_QUESTIONS.length - 1)])
    setQaIndex(newAnswers.length)
    setQaStep('answering')
  }

  const handleSave = async () => {
    if (!result) return
    const story = await storyDB.create({
      title: premise || result.outline.split('\n')[0].slice(0, 80) || 'AI Developed Story',
      description: result.outline,
      genre: genre || 'Fantasy',
      status: 'draft',
    })
    await storyDB.saveChapter({ storyId: story.id, title: 'Chapter 1: The Beginning', content: result.chapter1, orderNum: 1 })
    await storyDB.saveChapter({ storyId: story.id, title: 'Characters', content: result.characters, orderNum: 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCopy = (text: string) => navigator.clipboard.writeText(text)

  const qaProgress = Math.min(((qaAnswers.length) / 5) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-violet-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Brain className="w-5 h-5 text-violet-400" />
            <div>
              <h1 className="font-bold text-lg">AI Story Developer</h1>
              <p className="text-xs text-slate-400">Let AI craft your tale — alone or together</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Companion */}
        <div className="flex items-center gap-3 bg-slate-900/40 border border-violet-800/20 rounded-xl p-4 mb-8 max-w-lg">
          <img src={companion.image} alt={companion.name} className="w-12 h-12 rounded-full object-cover border border-violet-400/30 shrink-0" />
          <div>
            <p className="text-xs text-violet-400 font-bold">{companion.name}</p>
            <p className="text-sm text-slate-300 italic">
              "{result ? (mode === 'auto' ? companion.autoPraise : companion.qaPraise) : mode === 'auto' ? companion.autoGreeting : companion.qaGreeting}"
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        {!result && qaStep === 'start' && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 border border-violet-800/20 rounded-xl p-1 flex">
              <button
                onClick={() => setMode('auto')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'auto' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" /> Auto Mode
              </button>
              <button
                onClick={() => setMode('qa')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'qa' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Q&A Mode
              </button>
            </div>
          </div>
        )}

        {/* AUTO MODE */}
        {mode === 'auto' && !result && (
          <Card className="bg-slate-900/60 border-violet-800/20 max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Zap className="w-6 h-6 text-violet-400" /> Auto Story Creator
                </h2>
                <p className="text-sm text-slate-400">Give me a premise and I'll build your entire story foundation</p>
              </div>

              {/* Premise */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Your Story Premise
                </label>
                <textarea
                  value={premise}
                  onChange={(e) => setPremise(e.target.value)}
                  placeholder="e.g., A dragon who wants to be a librarian in a world where magic is forbidden..."
                  className="w-full h-24 bg-slate-800 border border-violet-800/20 rounded-lg p-3 text-white placeholder:text-slate-600 resize-none focus:border-violet-500/50 focus:outline-none"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        genre === g ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        tone === t ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Story Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        length === l.id ? 'border-violet-500 bg-violet-900/20' : 'border-slate-700 bg-slate-800/30'
                      }`}
                    >
                      <p className={`font-bold text-sm ${length === l.id ? 'text-violet-300' : 'text-slate-400'}`}>{l.label}</p>
                      <p className="text-[10px] text-slate-500">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAutoDevelop}
                disabled={isDeveloping || !premise.trim()}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg py-6"
              >
                {isDeveloping ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Forging Your Story...</>
                ) : (
                  <><Wand2 className="w-5 h-5 mr-2" /> Develop My Story</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Q&A MODE */}
        {mode === 'qa' && qaStep !== 'done' && (
          <div className="max-w-2xl mx-auto">
            {qaStep === 'start' && (
              <Card className="bg-slate-900/60 border-violet-800/20 text-center p-8">
                <MessageCircle className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Q&A Story Builder</h2>
                <p className="text-slate-400 mb-6">I'll ask you 5 questions. Your answers will become the foundation of a unique story crafted just for you.</p>
                <Button onClick={startQA} className="bg-gradient-to-r from-violet-600 to-purple-600 text-lg px-8 py-6">
                  <MessageCircle className="w-5 h-5 mr-2" /> Begin the Interview
                </Button>
              </Card>
            )}

            {(qaStep === 'asking' || qaStep === 'answering') && (
              <Card className="bg-slate-900/60 border-violet-800/20">
                <CardContent className="p-6">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Question {qaAnswers.length + 1} of 5</span>
                      <span className="text-xs text-violet-400">{Math.round(qaProgress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all" style={{ width: `${qaProgress}%` }} />
                    </div>
                  </div>

                  {/* Previous Q&A */}
                  {qaAnswers.length > 0 && (
                    <ScrollArea className="max-h-40 mb-4">
                      <div className="space-y-2">
                        {qaAnswers.map((qa, i) => (
                          <div key={i} className="bg-slate-800/40 rounded-lg p-3">
                            <p className="text-xs text-violet-400 font-bold mb-1">Q{i + 1}: {qa.question}</p>
                            <p className="text-sm text-slate-300">{qa.answer}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {/* Current Question */}
                  <div className="bg-violet-900/20 border border-violet-800/30 rounded-xl p-4 mb-4">
                    <p className="text-xs text-violet-400 font-bold mb-1 flex items-center gap-1">
                      <Brain className="w-3 h-3" /> SHADOW WHISPER ASKS:
                    </p>
                    <p className="text-lg text-white font-medium">{currentQuestion}</p>
                  </div>

                  {/* Answer Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="flex-1 bg-slate-800 border border-violet-800/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                      onKeyDown={(e) => { if (e.key === 'Enter') submitAnswer() }}
                      autoFocus
                    />
                    <Button onClick={submitAnswer} disabled={!currentAnswer.trim()} className="bg-gradient-to-r from-violet-600 to-purple-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {qaStep === 'generating' && (
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
                <p className="text-xl font-bold text-violet-400">Weaving your tale...</p>
                <p className="text-sm text-slate-400 mt-2">The AI is analyzing your answers and crafting a unique story</p>
              </div>
            )}
          </div>
        )}

        {/* RESULT — Shared between both modes */}
        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Your Story is Ready!</h2>
              <p className="text-sm text-slate-400">Generated via {result.provider}</p>
            </div>

            {/* Outline */}
            <Card className="bg-slate-900/60 border-amber-800/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Story Outline
                </h3>
                <div className="bg-slate-800/40 rounded-lg p-4">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{result.outline}</p>
                </div>
              </CardContent>
            </Card>

            {/* Characters */}
            <Card className="bg-slate-900/60 border-violet-800/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-violet-400 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" /> Characters
                </h3>
                <div className="bg-slate-800/40 rounded-lg p-4">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{result.characters}</p>
                </div>
                <Button size="sm" variant="outline" className="mt-3 border-slate-700 text-slate-400" onClick={() => handleCopy(result.characters)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy Characters
                </Button>
              </CardContent>
            </Card>

            {/* Chapter 1 */}
            <Card className="bg-slate-900/60 border-emerald-800/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <Feather className="w-5 h-5" /> Chapter 1
                </h3>
                <ScrollArea className="max-h-96">
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{result.chapter1}</p>
                  </div>
                </ScrollArea>
                <Button size="sm" variant="outline" className="mt-3 border-slate-700 text-slate-400" onClick={() => handleCopy(result.chapter1)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy Chapter
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Button className="bg-gradient-to-r from-purple-600 to-amber-600" onClick={handleSave}>
                {saved ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save to Library</>}
              </Button>
              <Button variant="outline" className="border-violet-800/30 text-violet-400" onClick={() => navigate('/editor')}>
                <Feather className="w-4 h-4 mr-2" /> Continue Writing
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-400" onClick={() => { setResult(null); setQaStep('start'); setPremise(''); }}>
                <RotateCcw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>

            <div ref={scrollRef} />
          </div>
        )}
      </div>
    </div>
  )
}
