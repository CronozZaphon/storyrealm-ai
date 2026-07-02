import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sparkles, BookOpen, Wand2, Music, Heart, Sword, Scroll, Gem, GitMerge, Brain, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

const praiseQuotes = [
  { character: 'Eldrin the Wise', image: './wizard-guide.png', quote: 'Your stories have the power to shape worlds, brave author!' },
  { character: 'Lyra Stormblade', image: './warrior-praise.png', quote: 'A mighty pen is sharper than any sword! Forge on!' },
  { character: 'Shadow Whisper', image: './rogue-mystery.png', quote: 'Even in darkness, your tales shine bright...' },
  { character: 'Melody Quickstring', image: './bard-audio.png', quote: 'Your words shall become songs sung across the realms!' },
]

const features = [
  { icon: BookOpen, title: 'NovelAI-Style Editor', desc: 'Write with Do, Say, and Story modes. Let AI continue your narrative in the style you choose.', color: 'text-amber-400' },
  { icon: Wand2, title: 'AI Grammar Sage', desc: 'Real-time grammar fixing with explanations. Your personal editor that teaches while it corrects.', color: 'text-purple-400' },
  { icon: GitMerge, title: 'Story Mixer', desc: 'Blend 2-4 existing stories into a new tale. Choose blend, crossover, inspired, or mashup styles.', color: 'text-indigo-400' },
  { icon: Brain, title: 'AI Story Developer', desc: 'Auto mode builds from a premise, or Q&A mode interviews you to craft a unique story.', color: 'text-violet-400' },
  { icon: Scroll, title: 'Manhua Converter', desc: 'Transform your stories into visual comic panels with consistent character art.', color: 'text-emerald-400' },
  { icon: Globe, title: 'Translation', desc: 'Translate your stories into 20+ languages for international Amazon KDP markets.', color: 'text-cyan-400' },
  { icon: BookOpen, title: 'Amazon KDP Formatter', desc: 'One-click formatting for professional book publication on Amazon Kindle.', color: 'text-blue-400' },
  { icon: Music, title: 'Audiobook Creator', desc: 'Generate narration with ambient music for YouTube, Facebook, and podcasts.', color: 'text-rose-400' },
  { icon: Sparkles, title: 'Story Memory', desc: 'AI remembers everything - characters, plotlines, and world details across sessions.', color: 'text-fuchsia-400' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % praiseQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              StoryRealm AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-purple-300 hover:text-white hover:bg-purple-900/30" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
              <Heart className="w-4 h-4 mr-1 text-rose-400" /> Support
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700" onClick={() => navigate('/dashboard')}>
              <Sword className="w-4 h-4 mr-1" /> Enter the Realm
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="./hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-sm">
            <Sparkles className="w-4 h-4" /> Powered by AI - Free to Use!
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Forge Your Legends with{' '}
            <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">
              StoryRealm AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate AI storytelling companion. Write novels, convert to manhua, 
            create audiobooks, and publish to Amazon - all in one magical realm.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-lg px-8 py-6" onClick={() => navigate('/dashboard')}>
              <Sword className="w-5 h-5 mr-2" /> Begin Your Quest
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 text-lg px-8 py-6" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
              <Gem className="w-5 h-5 mr-2 text-amber-400" /> Support the Realm
            </Button>
          </div>
        </div>

        {/* Floating Characters */}
        <div className="absolute bottom-0 left-0 w-48 md:w-64 opacity-80 hover:opacity-100 transition-opacity hidden md:block">
          <img src="./wizard-guide.png" alt="Eldrin the Wise" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-0 right-0 w-48 md:w-64 opacity-80 hover:opacity-100 transition-opacity hidden md:block">
          <img src="./warrior-praise.png" alt="Lyra Stormblade" className="w-full h-auto drop-shadow-2xl" />
        </div>
      </section>

      {/* Character Quote Popup */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <img src={praiseQuotes[currentQuote].image} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50" />
              <div>
                <p className="text-sm font-bold text-amber-400 mb-1">{praiseQuotes[currentQuote].character}</p>
                <p className="text-sm text-slate-300 italic">"{praiseQuotes[currentQuote].quote}"</p>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-slate-500 hover:text-white text-xs">&times;</button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Arsenal of Creation</h2>
            <p className="text-slate-400 text-lg">Every tool a storyteller needs, forged with AI magic</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="group bg-slate-900/60 backdrop-blur-sm border border-purple-800/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-900/20 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <feat.icon className={`w-10 h-10 ${feat.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Path of Creation</h2>
            <p className="text-slate-400 text-lg">From first word to published masterpiece</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Write', desc: 'Use AI-powered editor with Do/Say/Story modes', icon: BookOpen },
              { step: '2', title: 'Perfect', desc: 'AI grammar checking & suggestions with explanations', icon: Sparkles },
              { step: '3', title: 'Transform', desc: 'Convert to manhua or audiobook format', icon: Wand2 },
              { step: '4', title: 'Publish', desc: 'Format for Amazon KDP, YouTube, or Facebook', icon: Scroll },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {s.step}
                </div>
                <s.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-600 to-transparent" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Showcase */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Companions on This Quest</h2>
            <p className="text-slate-400 text-lg">Guiding spirits who celebrate your creativity</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {praiseQuotes.map((q, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-4 mx-auto w-40 h-56 overflow-hidden rounded-2xl border border-purple-800/30 bg-slate-900/50">
                  <img src={q.image} alt={q.character} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>
                <h3 className="font-bold text-amber-400">{q.character}</h3>
                <p className="text-slate-400 text-sm italic mt-1">"{q.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/50 via-purple-950/50 to-amber-950/50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <img src="./dragon-donate.png" alt="Golden Dragon" className="w-64 md:w-80 mx-auto drop-shadow-2xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Support the Realm</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            StoryRealm AI is free for all adventurers. Your donations help keep the magic alive 
            and bring new features to life. Every contribution is a legendary deed!
          </p>
          <Button size="lg" className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-lg px-8 py-6" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-5 h-5 mr-2" /> Donate on Ko-fi
          </Button>
          <p className="mt-4 text-sm text-slate-500">Powered by community love &times; AI magic</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-purple-800/20 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-bold">StoryRealm AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
              <button onClick={() => navigate('/settings')} className="hover:text-white transition-colors">Settings</button>
              <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="hover:text-rose-400 transition-colors">Support Us</button>
            </div>
            <p className="text-sm text-slate-500"> Crafted with magic for storytellers everywhere</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 border-t border-purple-800/10 pt-4">
            <button onClick={() => navigate('/terms')} className="hover:text-slate-400 transition-colors">Terms of Service</button>
            <span>&middot;</span>
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-400 transition-colors">Privacy Policy</button>
            <span>&middot;</span>
            <button onClick={() => navigate('/dmca')} className="hover:text-slate-400 transition-colors">DMCA / Copyright</button>
            <span>&middot;</span>
            <span>StoryRealm AI uses Pollinations AI, Together AI, Google Gemini, Cloudflare Workers AI, and OpenRouter free tiers.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
