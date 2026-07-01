import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, ChevronLeft, GitMerge, Shuffle, Wand2, Zap, Heart, BookOpen, Check, Loader2, Feather, Copy, Save, ArrowRight } from 'lucide-react'
import { storyDB } from '@/lib/db-client'
import { mixStories, MIX_STYLES } from '@/lib/ai-engine'

interface Story { id: number; title: string; content: string; genre: string; description: string; selected?: boolean }

const COMPANION_LINES = {
  greeting: "*eyes gleaming* Ah, you wish to weave disparate tales into one? A bold endeavor!",
  mixing: "The threads are intertwining... watch as separate worlds become one!",
  done: "Magnificent! Two stories have become something entirely new. The art of the remix!",
};

export default function StoryMixer() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [mixStyle, setMixStyle] = useState<'blend' | 'crossover' | 'inspired' | 'mashup'>('blend')
  const [isMixing, setIsMixing] = useState(false)
  const [result, setResult] = useState<{ outline: string; text: string; provider: string } | null>(null)
  const [_showResult, setShowResult] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadStories = useCallback(async () => {
    const list = await storyDB.list()
    // Load chapters for each story to get content
    const withContent = await Promise.all(
      list.map(async (s: any) => {
        const detail = await storyDB.get(s.id)
        const chapters = detail.chapters || []
        const content = chapters.map((c: any) => c.content).join('\n\n')
        return { ...s, content: content || s.description || 'No content yet', selected: false }
      })
    )
    setStories(withContent)
  }, [])

  useEffect(() => { loadStories() }, [loadStories])

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const handleMix = async () => {
    if (selectedIds.length < 2) return
    setIsMixing(true)
    const selected = stories.filter((s) => selectedIds.includes(s.id))
    const apiKey = localStorage.getItem('openai_api_key') || undefined
    const companionId = localStorage.getItem('storyrealm_companion') || 'eldrin'

    const result = await mixStories(
      selected.map((s) => ({ title: s.title, content: s.content, genre: s.genre })),
      mixStyle,
      { companionId, apiKey, openaiKey: apiKey }
    )
    setResult(result)
    setShowResult(true)
    setIsMixing(false)
  }

  const handleSaveMixed = async () => {
    if (!result) return
    const styleLabel = MIX_STYLES.find((s) => s.id === mixStyle)?.name || 'Mixed'
    const selected = stories.filter((s) => selectedIds.includes(s.id))
    const title = `${styleLabel}: ${selected.map((s) => s.title).join(' + ')}`.slice(0, 100)
    const story = await storyDB.create({ title, description: result.outline, genre: 'Mixed', status: 'draft' })
    await storyDB.saveChapter({ storyId: story.id, title: 'Chapter 1: The Convergence', content: result.text, orderNum: 1 })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result.text)
  }

  const styleConfig = {
    blend: { icon: GitMerge, color: 'from-purple-600 to-indigo-600', border: 'border-purple-500', label: 'Seamless Blend' },
    crossover: { icon: Shuffle, color: 'from-blue-600 to-cyan-600', border: 'border-blue-500', label: 'Crossover' },
    inspired: { icon: Sparkles, color: 'from-amber-600 to-orange-600', border: 'border-amber-500', label: 'Inspired By' },
    mashup: { icon: Zap, color: 'from-rose-600 to-pink-600', border: 'border-rose-500', label: 'Wild Mashup' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-indigo-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <GitMerge className="w-5 h-5 text-indigo-400" />
            <div>
              <h1 className="font-bold text-lg">Story Mixer</h1>
              <p className="text-xs text-slate-400">Blend existing stories into something new</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Companion Line */}
        <div className="flex items-center gap-3 bg-slate-900/40 border border-indigo-800/20 rounded-xl p-4 mb-8 max-w-lg">
          <img src="/wizard-guide.png" alt="Eldrin" className="w-12 h-12 rounded-full object-cover border border-amber-400/30 shrink-0" />
          <div>
            <p className="text-xs text-amber-400 font-bold">Eldrin the Wise</p>
            <p className="text-sm text-slate-300 italic">"{result ? COMPANION_LINES.done : isMixing ? COMPANION_LINES.mixing : COMPANION_LINES.greeting}"</p>
          </div>
        </div>

        {/* Step 1: Select Stories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Step 1: Select Stories to Mix
          </h2>
          <p className="text-sm text-slate-400 mb-4">Choose 2-4 stories to blend together. Select at least 2.</p>

          {stories.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-indigo-800/20">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No stories yet. Create some first!</p>
              <Button className="mt-3 bg-gradient-to-r from-purple-600 to-amber-600" onClick={() => navigate('/dashboard')}>
                <ArrowRight className="w-4 h-4 mr-2" /> Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stories.map((story) => {
                const isSelected = selectedIds.includes(story.id)
                return (
                  <button
                    key={story.id}
                    onClick={() => toggleSelect(story.id)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-900/20 shadow-lg shadow-indigo-900/20'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-indigo-800/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <Badge variant="outline" className="border-indigo-800/30 text-indigo-300 text-[10px] mb-2">{story.genre}</Badge>
                    <p className={`font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>{story.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{story.description || story.content.slice(0, 100)}...</p>
                    <p className="text-[10px] text-slate-600 mt-2">{story.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words</p>
                  </button>
                )
              })}
            </div>
          )}
          <p className="text-sm text-slate-500 mt-2">{selectedIds.length} of 4 selected {selectedIds.length >= 2 && '✓ Ready to mix!'}</p>
        </div>

        {/* Step 2: Choose Mix Style */}
        {selectedIds.length >= 2 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-400" /> Step 2: Choose Mix Style
            </h2>
            <div className="grid md:grid-cols-4 gap-3">
              {MIX_STYLES.map((style) => {
                const config = styleConfig[style.id as keyof typeof styleConfig]
                const Icon = config.icon
                const isActive = mixStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => setMixStyle(style.id as any)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isActive ? `${config.border} bg-slate-800/60` : 'border-slate-700/30 bg-slate-800/20 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>{style.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{style.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Mix Button */}
        {selectedIds.length >= 2 && (
          <div className="text-center mb-8">
            <Button
              size="lg"
              onClick={handleMix}
              disabled={isMixing}
              className={`bg-gradient-to-r ${styleConfig[mixStyle].color} text-lg px-8 py-6`}
            >
              {isMixing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Weaving Your New Tale...</>
              ) : (
                <><GitMerge className="w-5 h-5 mr-2" /> Mix Stories</>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <Card className="bg-slate-900/60 border-indigo-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Your Mixed Story
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Generated via {result.provider}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-slate-700 text-slate-400" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-amber-600" onClick={handleSaveMixed}>
                    {saved ? <><Check className="w-4 h-4 mr-1" /> Saved!</> : <><Save className="w-4 h-4 mr-1" /> Save to Library</>}
                  </Button>
                </div>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-800/20 rounded-lg p-4 mb-4">
                <p className="text-xs text-indigo-400 font-bold mb-1">OUTLINE</p>
                <p className="text-sm text-slate-300">{result.outline}</p>
              </div>

              <ScrollArea className="max-h-96">
                <div className="prose prose-invert max-w-none">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{result.text}</p>
                </div>
              </ScrollArea>

              <div className="flex gap-3 mt-6 pt-4 border-t border-indigo-800/20">
                <Button variant="outline" className="flex-1 border-indigo-800/30 text-indigo-400" onClick={() => navigate('/editor')}>
                  <Feather className="w-4 h-4 mr-2" /> Continue in Editor
                </Button>
                <Button variant="outline" className="flex-1 border-indigo-800/30 text-indigo-400" onClick={handleMix}>
                  <Wand2 className="w-4 h-4 mr-2" /> Remix Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
