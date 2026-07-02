import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Wand2, BookOpen, Download, Sparkles, Image, Loader2, Heart } from 'lucide-react'

interface Panel {
  narration: string
  dialogue: string
  characters: string[]
  imageUrl: string
  imageDescription: string
}

export default function ManhuaGenerator() {
  const navigate = useNavigate()
  const [storyText, setStoryText] = useState('The ancient library of Valdris stretched endlessly in all directions. Elara ran her fingers along the spines of leather-bound tomes, each one humming with residual magic. "You\'re not the only one hunting for the Codex," a voice purred from the darkness.')
  const [isGenerating, setIsGenerating] = useState(false)
  const [panels, setPanels] = useState<Panel[]>([])
  const [characters, setCharacters] = useState('Elara, Kael')
  const [generated, setGenerated] = useState(false)

  const generateManhua = async () => {
    setIsGenerating(true)

    // Simulate panel generation
    setTimeout(() => {
      const charList = characters.split(',').map((c) => c.trim())
      const sentences = storyText.match(/[^.!?]+[.!?]+/g) || [storyText]
      
      const generatedPanels: Panel[] = sentences.slice(0, 6).map((sentence, i) => {
        const isDialogue = sentence.includes('"') || sentence.includes('"')
        const dialogueMatch = sentence.match(/["""]([^"""]+)["""]/)
        const narration = isDialogue
          ? sentence.replace(/["""][^"""]*["""]/g, '').trim()
          : sentence.trim()
        const dialogue = dialogueMatch ? dialogueMatch[1] : ''

        const prompts = [
          `Manhua comic panel dramatic fantasy scene dark ink style: ${sentence.slice(0, 120)}`,
          `Chinese manhua black ink screentone dramatic: ${sentence.slice(0, 120)}`,
        ]
        const prompt = prompts[i % prompts.length]

        return {
          narration,
          dialogue,
          characters: charList,
          imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true&seed=${i + 1}`,
          imageDescription: sentence.slice(0, 200),
        }
      })

      setPanels(generatedPanels)
      setGenerated(true)
      setIsGenerating(false)
    }, 2500)
  }

  const exportManhua = () => {
    const manhuaData = {
      title: 'The Dragon\'s Oath - Manhua',
      panels: panels.map((p, i) => ({
        page: i + 1,
        narration: p.narration,
        dialogue: p.dialogue,
        characters: p.characters,
      })),
    }
    const blob = new Blob([JSON.stringify(manhuaData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'manhua-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h1 className="font-bold text-lg">Manhua Studio</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {generated && (
              <Button size="sm" variant="outline" className="border-emerald-800/30 text-emerald-400" onClick={exportManhua}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
              <Heart className="w-4 h-4 text-rose-400" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-emerald-400" /> Story to Manhua
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Paste your story text and watch it transform into visual comic panels!
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Characters (comma-separated)</label>
              <input
                type="text"
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                className="w-full bg-slate-800/50 border border-emerald-800/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
                placeholder="Elara, Kael, Mira..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Story Text</label>
              <Textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Paste your story chapter here..."
                className="min-h-[200px] bg-slate-800/50 border-emerald-800/20 text-white placeholder:text-slate-600 resize-none"
              />
            </div>

            <Button
              onClick={generateManhua}
              disabled={isGenerating || !storyText.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Panels...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Generate Manhua Panels
                </>
              )}
            </Button>

            {/* Tips */}
            <div className="bg-slate-900/50 border border-emerald-800/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-emerald-400 mb-2">Pro Tips</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Include dialogue in quotes for speech bubbles</li>
                <li>• Describe scenes vividly for better images</li>
                <li>• List all characters for consistent art</li>
                <li>• Add your own API key in Settings for premium quality</li>
              </ul>
            </div>

            {/* Character Companion */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-800/20 rounded-xl p-4 text-center">
              <img src="./rogue-mystery.png" alt="Shadow Whisper" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-emerald-400/30" />
              <p className="text-xs text-emerald-400 font-bold mb-1">Shadow Whisper</p>
              <p className="text-xs text-slate-400 italic">
                {generated
                  ? "The shadows come alive with your story! Beautiful work."
                  : "Feed me words, and I shall paint them into darkness and light."}
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-emerald-400" /> Preview
            </h2>

            {!generated && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-dashed border-emerald-800/20 rounded-2xl">
                <BookOpen className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400">Your manhua panels will appear here</p>
                <p className="text-slate-500 text-sm">Enter story text and click Generate</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-emerald-800/20 rounded-2xl">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                <p className="text-emerald-400 font-semibold">Conjuring your manhua panels...</p>
                <p className="text-slate-500 text-sm mt-2">The artist is at work</p>
              </div>
            )}

            {generated && (
              <div className="space-y-6">
                {panels.map((panel, i) => (
                  <Card key={i} className="bg-slate-900/60 border-emerald-800/20 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="bg-slate-800/30 min-h-[300px] flex items-center justify-center">
                          <img
                            src={panel.imageUrl}
                            alt={`Panel ${i + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="768" viewBox="0 0 512 768"%3E%3Crect fill="%231e293b" width="512" height="768"/%3E%3Ctext fill="%2394a3b8" x="50%25" y="50%25" text-anchor="middle" font-family="sans-serif" font-size="16"%3EManhua Panel {i + 1}%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        </div>
                        {/* Text */}
                        <div className="p-6 flex flex-col justify-center">
                          <Badge variant="outline" className="w-fit mb-3 border-emerald-800/30 text-emerald-400">
                            Panel {i + 1}
                          </Badge>
                          {panel.dialogue && (
                            <div className="mb-3">
                              <p className="text-xs text-emerald-400 font-bold mb-1">DIALOGUE</p>
                              <p className="text-white italic text-lg">"{panel.dialogue}"</p>
                            </div>
                          )}
                          {panel.narration && (
                            <div>
                              <p className="text-xs text-slate-500 font-bold mb-1">NARRATION</p>
                              <p className="text-slate-300">{panel.narration}</p>
                            </div>
                          )}
                          <div className="mt-4 flex flex-wrap gap-1">
                            {panel.characters.map((char, ci) => (
                              <Badge key={ci} variant="outline" className="border-purple-800/30 text-purple-300 text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
