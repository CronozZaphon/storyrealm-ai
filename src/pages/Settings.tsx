import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Key, Sparkles, Zap, Heart, Globe, BookOpen, Wand2, Music, Scroll, Shield, Eye, EyeOff, Users, Crown, ArrowRight, Check, ExternalLink, AlertCircle } from 'lucide-react'
import { hasPremiumKeys, getPreferredProviderName, AI_PROVIDERS } from '@/lib/ai-engine'

const COMPANIONS = [
  { id: 'eldrin', name: 'Eldrin the Wise', title: 'Grand Wizard of the Quill', image: './wizard-guide.png', role: 'Guide & Mentor', style: 'Structure, world-building, narrative flow', color: 'text-purple-400' },
  { id: 'lyra', name: 'Lyra Stormblade', title: 'Champion of the Written Word', image: './warrior-praise.png', role: 'Motivator & Editor', style: 'Action, pacing, character strength', color: 'text-red-400' },
  { id: 'shadow', name: 'Shadow Whisper', title: 'Keeper of Secrets', image: './rogue-mystery.png', role: 'Mystery & Suspense', style: 'Tension, plot twists, unreliable narrators', color: 'text-emerald-400' },
  { id: 'melody', name: 'Melody Quickstring', title: 'Bard of the Eternal Song', image: './bard-audio.png', role: 'Voice & Dialogue', style: 'Dialogue, voice, rhythm, emotion', color: 'text-amber-400' },
]

export default function Settings() {
  const navigate = useNavigate()
  const [openaiKey, setOpenaiKey] = useState('')
  const [claudeKey, setClaudeKey] = useState('')
  const [showOpenai, setShowOpenai] = useState(false)
  const [showClaude, setShowClaude] = useState(false)
  const [saved, setSaved] = useState(false)
  const [companionId, setCompanionId] = useState(() => localStorage.getItem('storyrealm_companion') || 'eldrin')
  const [companionSaved, setCompanionSaved] = useState(false)
  const [hasPremium, setHasPremium] = useState(false)
  const [activeProvider, setActiveProvider] = useState('Pollinations AI (Free)')

  useEffect(() => {
    setHasPremium(hasPremiumKeys())
    setActiveProvider(getPreferredProviderName())
  }, [saved])

  const handleSave = () => {
    if (openaiKey) localStorage.setItem('sr_openai_key', openaiKey)
    if (claudeKey) localStorage.setItem('sr_claude_key', claudeKey)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setHasPremium(hasPremiumKeys())
      setActiveProvider(getPreferredProviderName())
    }, 3000)
  }

  const clearKeys = () => {
    setOpenaiKey('')
    setClaudeKey('')
    localStorage.removeItem('sr_openai_key')
    localStorage.removeItem('sr_claude_key')
    setHasPremium(hasPremiumKeys())
    setActiveProvider('Pollinations AI (Free)')
  }

  const selectCompanion = (id: string) => {
    setCompanionId(id)
    localStorage.setItem('storyrealm_companion', id)
    setCompanionSaved(true)
    setTimeout(() => setCompanionSaved(false), 3000)
  }

  const features = [
    { icon: BookOpen, name: 'Story Editor', desc: 'NovelAI-style writing with Do/Say/Story modes', free: true },
    { icon: Wand2, name: 'Grammar Check', desc: 'AI-powered grammar fixing with explanations', free: true },
    { icon: Sparkles, name: 'AI Generation', desc: 'Multi-AI engine with auto-switching fallback', free: true, premium: 'Premium quality with your API key' },
    { icon: BookOpen, name: 'Manhua Studio', desc: 'Convert stories to comic panels with real AI images', free: true },
    { icon: Music, name: 'Audiobook Lab', desc: 'Text-to-speech with ambience', free: false, premium: 'Requires your API key' },
    { icon: Scroll, name: 'KDP Formatter', desc: 'Amazon book formatting', free: true },
    { icon: Users, name: 'Character Companions', desc: 'Choose your AI writing guide', free: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h1 className="font-bold text-lg">Settings</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* PROMINENT: Go to Integrations Hub CTA */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-amber-900/20 border-purple-500/30 mb-6 cursor-pointer hover:border-purple-400/50 transition-all" onClick={() => navigate('/integrations')}>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  Integrations Hub
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </h2>
                <p className="text-sm text-slate-400">
                  Configure all AI providers, image/audio services, and see what's available. 
                  Step-by-step instructions for each integration.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {hasPremium ? (
                    <Badge className="bg-emerald-600 text-[10px]">
                      <Check className="w-3 h-3 mr-0.5" /> {activeProvider} Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-purple-600 text-purple-400 text-[10px]">
                      Free Tier — Click to upgrade
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-amber-600 text-amber-400 text-[10px]">
                    {AI_PROVIDERS.length} AI Providers
                  </Badge>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 shrink-0 hidden sm:flex">
              <ExternalLink className="w-4 h-4 mr-1" /> Open
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="companion" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-purple-800/20">
            <TabsTrigger value="companion" className="data-[state=active]:bg-purple-600">
              <Crown className="w-4 h-4 mr-1" /> Companion
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-600">
              <Key className="w-4 h-4 mr-1" /> Quick Keys
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-1" /> Features
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-1" /> About
            </TabsTrigger>
          </TabsList>

          {/* Companion Tab */}
          <TabsContent value="companion" className="space-y-6">
            <Card className="bg-slate-900/60 border-purple-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" /> Choose Your Writing Companion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">
                  Your companion appears in the Story Editor to guide, encourage, and inspire you. 
                  Each companion has a unique personality and specializes in different aspects of writing. 
                  When you use a premium AI API, your companion's personality influences the AI's writing style!
                </p>

                <div className="grid gap-3">
                  {COMPANIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => selectCompanion(c.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                        companionId === c.id
                          ? 'border-amber-500 bg-amber-900/20 shadow-lg shadow-amber-900/10'
                          : 'border-purple-800/20 bg-slate-800/30 hover:border-purple-500/40'
                      }`}
                    >
                      <img src={c.image} alt={c.name} className="w-16 h-16 rounded-full object-cover border-2 border-purple-800/30 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-bold ${c.color}`}>{c.name}</p>
                          {companionId === c.id && (
                            <Badge className="bg-amber-600 text-white text-[10px]">Selected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{c.title} &middot; {c.role}</p>
                        <p className="text-xs text-purple-400 mt-1">Specializes in: {c.style}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {companionSaved && (
                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-emerald-400 font-semibold">Companion updated!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab — Enhanced */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-slate-900/60 border-purple-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" /> Quick API Key Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Banner */}
                <div className={`rounded-lg p-4 border ${hasPremium ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-amber-900/20 border-amber-800/20'}`}>
                  <div className="flex items-center gap-2">
                    {hasPremium ? <Check className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                    <div>
                      <p className={`text-sm font-semibold ${hasPremium ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {hasPremium ? `Premium Active: ${activeProvider}` : 'Free Tier: Pollinations AI'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {hasPremium 
                          ? 'Your premium AI key is being used for story generation, grammar, suggestions, translation, and more.'
                          : 'StoryRealm works without API keys. Add keys below for premium quality AI across all features.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Add Keys */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">OpenAI API Key</label>
                  <div className="relative">
                    <input type={showOpenai ? 'text' : 'password'} value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-..."
                      className="w-full bg-slate-800/50 border border-purple-800/20 rounded-lg px-3 py-2 pr-10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
                    <button onClick={() => setShowOpenai(!showOpenai)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Enables: GPT-4o story generation, grammar, suggestions, translation, Story Mixer, AI Developer</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Claude API Key (Optional)</label>
                  <div className="relative">
                    <input type={showClaude ? 'text' : 'password'} value={claudeKey} onChange={(e) => setClaudeKey(e.target.value)} placeholder="sk-ant-..."
                      className="w-full bg-slate-800/50 border border-purple-800/20 rounded-lg px-3 py-2 pr-10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
                    <button onClick={() => setShowClaude(!showClaude)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      {showClaude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Enables: Anthropic Claude for alternative AI responses with different writing style</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-amber-600">
                    {saved ? <><Sparkles className="w-4 h-4 mr-2" /> Saved!</> : <><Key className="w-4 h-4 mr-2" /> Save Keys</>}
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-400" onClick={clearKeys}>Clear</Button>
                </div>

                <Separator className="bg-purple-800/20" />

                {/* Enhanced How-To */}
                <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" /> How to get API keys (step-by-step)
                  </h3>
                  <ol className="text-sm text-slate-400 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                      <span>Click one of these links to open the provider's website:
                        <button onClick={() => window.open('https://platform.openai.com/signup', '_blank')} className="text-blue-400 hover:underline ml-1">OpenAI Signup</button> or
                        <button onClick={() => window.open('https://console.anthropic.com/', '_blank')} className="text-blue-400 hover:underline ml-1">Claude Signup</button>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                      <span>Create a free account with your email. Most providers give you free trial credits just for signing up.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                      <span>Navigate to the API Keys section (usually in Settings or Dashboard).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                      <span>Click "Create new secret key", give it a name like "StoryRealm", and copy the key.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">5</span>
                      <span>Paste the key in the field above and click Save. Done!</span>
                    </li>
                  </ol>
                </div>

                {/* Privacy Note */}
                <div className="bg-amber-900/20 border border-amber-800/20 rounded-lg p-3 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-300">
                    <strong>Your keys are safe:</strong> API keys are stored only in your browser's localStorage. 
                    They are never sent to our servers. API calls go directly from your browser to the AI provider. 
                    You can clear keys anytime by clicking "Clear" or visiting Integrations Hub.
                  </p>
                </div>

                {/* Link to full Integrations Hub */}
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-400 hover:bg-purple-900/20" 
                  onClick={() => navigate('/integrations')}
                >
                  <Zap className="w-4 h-4 mr-2" /> View All {AI_PROVIDERS.length} Providers in Integrations Hub
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card className="bg-slate-900/60 border-purple-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Feature Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start justify-between p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <feature.icon className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{feature.name}</p>
                          <p className="text-xs text-slate-400">{feature.desc}</p>
                          {feature.premium && <p className="text-xs text-amber-400 mt-1"><Zap className="w-3 h-3 inline mr-1" />{feature.premium}</p>}
                        </div>
                      </div>
                      <Badge variant={feature.free ? 'default' : 'outline'} className={feature.free ? 'bg-emerald-600' : 'border-amber-600 text-amber-400'}>
                        {feature.free ? 'Free' : 'Premium'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="bg-slate-900/60 border-purple-800/20">
              <CardContent className="p-8 text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">StoryRealm AI</h2>
                </div>
                <p className="text-slate-300 max-w-md mx-auto">
                  A free AI-powered storytelling platform for aspiring authors. Write novels, create manhua, 
                  generate audiobooks, and publish to Amazon KDP — all in one magical realm.
                </p>
                <div className="flex justify-center gap-6 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Story Editor</span>
                  <span className="flex items-center gap-1"><Wand2 className="w-4 h-4" /> Manhua Studio</span>
                  <span className="flex items-center gap-1"><Music className="w-4 h-4" /> Audiobook Lab</span>
                </div>
                <Separator className="bg-purple-800/20 max-w-xs mx-auto" />
                <div>
                  <p className="text-sm text-slate-400 mb-4">Support the development of StoryRealm AI</p>
                  <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
                    <Heart className="w-4 h-4 mr-2" /> Support on Ko-fi
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
                  <button onClick={() => navigate('/terms')} className="hover:text-slate-400">Terms of Service</button>
                  <span>&middot;</span>
                  <button onClick={() => navigate('/privacy')} className="hover:text-slate-400">Privacy Policy</button>
                  <span>&middot;</span>
                  <button onClick={() => navigate('/dmca')} className="hover:text-slate-400">DMCA</button>
                </div>
                <p className="text-xs text-slate-600"> Crafted with magic for storytellers everywhere</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
