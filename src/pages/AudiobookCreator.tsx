import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, Music, Headphones, Sparkles, Loader2, Play, Pause, Volume2, Heart, Wand2, Mic, Waves, Wind, Flame, Droplets } from 'lucide-react'

const voiceOptions = [
  { value: 'alloy', label: 'Alloy - Neutral', desc: 'Balanced and versatile' },
  { value: 'echo', label: 'Echo - Deep', desc: 'Rich male voice' },
  { value: 'fable', label: 'Fable - British', desc: 'Sophisticated accent' },
  { value: 'onyx', label: 'Onyx - Powerful', desc: 'Strong and commanding' },
  { value: 'nova', label: 'Nova - Warm', desc: 'Friendly female voice' },
  { value: 'shimmer', label: 'Shimmer - Clear', desc: 'Bright and expressive' },
]

const ambienceOptions = [
  { value: 'fantasy', label: 'Fantasy Realm', icon: Sparkles, desc: 'Magical chimes, ethereal wind' },
  { value: 'battle', label: 'Epic Battle', icon: Flame, desc: 'Drums, swords, intensity' },
  { value: 'forest', label: 'Enchanted Forest', icon: Wind, desc: 'Birds, leaves, gentle streams' },
  { value: 'ocean', label: 'Ocean Waves', icon: Droplets, desc: 'Waves, seagulls, calm' },
  { value: 'mystery', label: 'Mystery', icon: Waves, desc: 'Rain, subtle tension' },
  { value: 'romance', label: 'Romance', icon: Heart, desc: 'Soft strings, gentle breeze' },
]

export default function AudiobookCreator() {
  const navigate = useNavigate()
  const [storyText, setStoryText] = useState('The ancient library of Valdris stretched endlessly in all directions. Elara ran her fingers along the spines of leather-bound tomes, each one humming with residual magic.')
  const [voice, setVoice] = useState('alloy')
  const [ambience, setAmbience] = useState('fantasy')
  const [speed, setSpeed] = useState([1.0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [segments, setSegments] = useState<string[]>([])

  const generateAudiobook = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      // Split text into segments
      const sentences = storyText.match(/[^.!?]+[.!?]+/g) || [storyText]
      const segs: string[] = []
      let current = ''
      
      for (const sentence of sentences) {
        if (current.length + sentence.length > 300) {
          segs.push(current.trim())
          current = sentence
        } else {
          current += sentence + ' '
        }
      }
      if (current) segs.push(current.trim())
      
      setSegments(segs)
      setGenerated(true)
      setIsGenerating(false)
    }, 2000)
  }

  const selectedAmbience = ambienceOptions.find((a) => a.value === ambience)
  const AmbienceIcon = selectedAmbience?.icon || Sparkles

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-rose-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-rose-400" />
              <h1 className="font-bold text-lg">Audiobook Lab</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-rose-400" /> Narration Settings
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Configure your audiobook voice and atmosphere
              </p>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400" /> Voice
              </label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="bg-slate-800/50 border-rose-800/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-rose-800/20">
                  {voiceOptions.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      <div>
                        <div className="font-medium">{v.label}</div>
                        <div className="text-xs text-slate-500">{v.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ambience Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-400" /> Ambient Atmosphere
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ambienceOptions.map((a) => {
                  const Icon = a.icon
                  return (
                    <button
                      key={a.value}
                      onClick={() => setAmbience(a.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        ambience === a.value
                          ? 'border-rose-500 bg-rose-900/30'
                          : 'border-slate-700 bg-slate-800/30 hover:border-rose-800/30'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-rose-400 mb-1" />
                      <p className="text-xs font-medium">{a.label}</p>
                      <p className="text-[10px] text-slate-500">{a.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Speed Slider */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-400" /> Speed: {speed[0]}x
              </label>
              <Slider value={speed} onValueChange={setSpeed} min={0.5} max={2.0} step={0.1} className="py-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Story Text */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Story Text</label>
              <Textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Paste your story text here..."
                className="min-h-[150px] bg-slate-800/50 border-rose-800/20 text-white placeholder:text-slate-600 resize-none"
              />
            </div>

            <Button
              onClick={generateAudiobook}
              disabled={isGenerating || !storyText.trim()}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Audiobook...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Audiobook
                </>
              )}
            </Button>

            {/* Character Companion */}
            <div className="bg-gradient-to-br from-rose-900/20 to-slate-900 border border-rose-800/20 rounded-xl p-4 text-center">
              <img src="/bard-audio.png" alt="Melody" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-rose-400/30" />
              <p className="text-xs text-rose-400 font-bold mb-1">Melody Quickstring</p>
              <p className="text-xs text-slate-400 italic">
                {generated
                  ? "Your tale shall echo through taverns and halls alike!"
                  : "Give me words, and I shall give them voice and soul."}
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-rose-400" /> Audiobook Preview
            </h2>

            {!generated && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-dashed border-rose-800/20 rounded-2xl">
                <Headphones className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400">Your audiobook will appear here</p>
                <p className="text-slate-500 text-sm">Configure settings and click Generate</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-rose-800/20 rounded-2xl">
                <Loader2 className="w-12 h-12 text-rose-400 animate-spin mb-4" />
                <p className="text-rose-400 font-semibold">Weaving your audiobook...</p>
                <p className="text-slate-500 text-sm mt-2">Composing narration and ambience</p>
              </div>
            )}

            {generated && (
              <div className="space-y-4">
                {/* Audio Player */}
                <Card className="bg-slate-900/60 border-rose-800/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">The Dragon's Oath</h3>
                        <p className="text-sm text-slate-400">Chapter 1 &bull; {voiceOptions.find((v) => v.value === voice)?.label}</p>
                      </div>
                      <Badge variant="outline" className="border-rose-800/30 text-rose-400">
                        <AmbienceIcon className="w-3 h-3 mr-1" />
                        {selectedAmbience?.label}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
                      <div className="h-full w-1/3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-4">
                      {isPlaying ? 'Playing narration...' : 'Click play to preview'}
                    </p>
                    <p className="text-center text-xs text-slate-600">
                      Note: Add your OpenAI API key in Settings for full audio generation
                    </p>
                  </CardContent>
                </Card>

                {/* Segments */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-300">Narration Segments</h3>
                  {segments.map((seg, i) => (
                    <Card key={i} className="bg-slate-900/40 border-rose-800/10">
                      <CardContent className="p-3 flex items-start gap-3">
                        <Badge variant="outline" className="border-rose-800/30 text-rose-400 shrink-0 mt-0.5">
                          {i + 1}
                        </Badge>
                        <p className="text-sm text-slate-300">{seg}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Export Options */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-rose-800/30 text-rose-400">
                    <Music className="w-4 h-4 mr-2" /> Export Audio
                  </Button>
                  <Button variant="outline" className="flex-1 border-rose-800/30 text-rose-400">
                    <Headphones className="w-4 h-4 mr-2" /> Export for YouTube
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
