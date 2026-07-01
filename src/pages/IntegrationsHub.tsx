import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft, Key, Sparkles, Zap, Eye, EyeOff, ExternalLink,
  Brain, Globe, Users, Command, Route, Check, ArrowRight,
  Heart, BookOpen, Lightbulb, X, CheckCircle2, Info
} from 'lucide-react'
import {
  AI_PROVIDERS, saveUserKey, removeUserKey, loadUserKey,
  hasPremiumKeys, getProviderStatus,
} from '@/lib/ai-engine'

// Additional integrations beyond AI providers
const ADDITIONAL_INTEGRATIONS = [
  {
    id: 'pollinations',
    name: 'Pollinations AI',
    category: 'image',
    description: 'Free AI image generation for Manhua Studio comic panels. No API key needed — always free.',
    freeTier: true,
    alwaysFree: true,
    setupSteps: [
      'Already enabled! No setup required.',
      'Use Manhua Studio to generate comic panels from your story.',
      'Images are generated on-demand via Pollinations AI servers.',
    ],
    pricing: '100% Free — unlimited image generation',
    url: 'https://pollinations.ai',
  },
  {
    id: 'browser-tts',
    name: 'Browser Text-to-Speech',
    category: 'audio',
    description: 'Free built-in text-to-speech using your browser\'s voice engine. Works offline, no key needed.',
    freeTier: true,
    alwaysFree: true,
    setupSteps: [
      'Already enabled! No setup required.',
      'Go to Audiobook Lab to convert stories to speech.',
      'Choose from your system\'s available voices.',
    ],
    pricing: '100% Free — works offline',
    url: '',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs (Premium TTS)',
    category: 'audio',
    description: 'Ultra-realistic AI voices for professional audiobook creation. Best quality TTS available.',
    freeTier: true,
    alwaysFree: false,
    setupSteps: [
      'Visit https://elevenlabs.io and create a free account',
      'Go to your Profile settings and copy your API Key',
      'Enter the key below and click "Save Key"',
      'Go to Audiobook Lab to use premium voices',
    ],
    pricing: 'Free tier: 10,000 characters/month. Paid: $5/month for 30,000 chars.',
    url: 'https://elevenlabs.io/app/sign-up',
  },
  {
    id: 'deepl',
    name: 'DeepL Translator',
    category: 'translation',
    description: 'Professional-grade translation with natural-sounding results. Better than free alternatives.',
    freeTier: true,
    alwaysFree: false,
    setupSteps: [
      'Visit https://www.deepl.com/pro-api and sign up for a free account',
      'Go to Account → API Keys and create a new key',
      'Copy your Authentication Key',
      'Enter it below and click "Save Key"',
    ],
    pricing: 'Free tier: 500,000 characters/month. Pro: 6.99 EUR/month.',
    url: 'https://www.deepl.com/pro-api',
  },
  {
    id: 'kofi',
    name: 'Ko-fi Donations',
    category: 'support',
    description: 'Support StoryRealm AI development with one-time or recurring donations.',
    freeTier: true,
    alwaysFree: true,
    setupSteps: [
      'Click "Support on Ko-fi" button anywhere in the app',
      'Choose a one-time donation or monthly membership',
      'Your support helps keep StoryRealm AI free for everyone!',
    ],
    pricing: '100% Optional — donate what you can',
    url: 'https://ko-fi.com/silvercro',
  },
];

const PROVIDER_ICON: Record<string, React.ReactNode> = {
  brain: <Brain className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  route: <Route className="w-5 h-5" />,
  command: <Command className="w-5 h-5" />,
};

export default function IntegrationsHub() {
  const navigate = useNavigate();
  const [providerStatuses, setProviderStatuses] = useState(getProviderStatus());
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const [justCleared, setJustCleared] = useState<string | null>(null);
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);
  const hasPremium = hasPremiumKeys();

  const refreshStatuses = () => {
    setProviderStatuses(getProviderStatus());
  };

  const handleSaveKey = (providerName: string) => {
    const key = keyInputs[providerName];
    if (key && key.length > 10) {
      saveUserKey(providerName, key);
      setJustSaved(providerName);
      setKeyInputs((prev) => ({ ...prev, [providerName]: '' }));
      refreshStatuses();
      setTimeout(() => setJustSaved(null), 3000);
    }
  };

  const handleClearKey = (providerName: string) => {
    removeUserKey(providerName);
    setJustCleared(providerName);
    refreshStatuses();
    setTimeout(() => setJustCleared(null), 3000);
  };

  const handleSaveExtraKey = (id: string) => {
    const key = keyInputs[id];
    if (key && key.length > 5) {
      saveUserKey(id, key);
      setJustSaved(id);
      setKeyInputs((prev) => ({ ...prev, [id]: '' }));
      refreshStatuses();
      setTimeout(() => setJustSaved(null), 3000);
    }
  };

  const handleClearExtraKey = (id: string) => {
    removeUserKey(id);
    setJustCleared(id);
    refreshStatuses();
    setTimeout(() => setJustCleared(null), 3000);
  };

  // Keyboard shortcut: Escape goes back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/dashboard');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const aiProviderCount = providerStatuses.filter((p) => p.hasKey).length;
  const extraKeyCount = ['elevenlabs', 'deepl'].filter((id) => {
    const k = loadUserKey(id);
    return k && k.length > 5;
  }).length;
  const totalActive = aiProviderCount + extraKeyCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h1 className="font-bold text-lg">Integrations Hub</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalActive > 0 && (
              <Badge className="bg-emerald-600 text-white">
                <Check className="w-3 h-3 mr-1" /> {totalActive} Active
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
              <Heart className="w-4 h-4 text-rose-400" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Hero Section — How to Add API Keys */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-amber-900/20 border-purple-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl shrink-0">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">How to Add API Keys — Quick Guide</h2>
                <p className="text-slate-400 text-sm">
                  Adding your own API keys unlocks premium AI quality across all StoryRealm tools.
                  Your keys are stored only in your browser and are never sent to our servers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { step: '1', title: 'Choose a Provider', desc: 'Pick any AI service below. All offer free tiers to start.' },
                { step: '2', title: 'Get Your Key', desc: 'Click the signup link, create an account, and copy your API key.' },
                { step: '3', title: 'Paste & Save', desc: 'Paste the key in the input field below and click Save. Done!' },
              ].map((s) => (
                <div key={s.step} className="bg-slate-900/50 border border-purple-800/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">{s.step}</span>
                    <p className="font-semibold text-sm">{s.title}</p>
                  </div>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-900/20 border border-amber-800/20 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300">
                <strong>Privacy Note:</strong> All API keys are stored in your browser's localStorage only.
                They are sent directly from your browser to the AI provider's servers. StoryRealm never sees or stores your keys on any server.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Banner */}
        {hasPremium ? (
          <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-emerald-300">Premium AI Active</p>
                <p className="text-xs text-emerald-400/70">{aiProviderCount} AI provider{aiProviderCount > 1 ? 's' : ''} configured. All features using premium quality.</p>
              </div>
            </div>
            <Badge className="bg-emerald-600">Active</Badge>
          </div>
        ) : (
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-purple-300">Free Tier Active</p>
                <p className="text-xs text-purple-400/70">StoryRealm works without any API keys. Add keys for premium AI quality.</p>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-600 text-purple-400">Free</Badge>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-purple-800/20 w-full justify-start">
            <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-1" /> AI Providers ({aiProviderCount}/{AI_PROVIDERS.length})
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-1" /> Tools & Services ({extraKeyCount + 3} available)
            </TabsTrigger>
          </TabsList>

          {/* AI Providers Tab */}
          <TabsContent value="ai" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Configure AI providers for story generation, grammar, suggestions, translation, and more.
                When you add keys, premium AI replaces free functions automatically.
              </p>
            </div>

            <div className="grid gap-4">
              {providerStatuses.map((provider) => (
                <Card key={provider.name} className={`border transition-all ${provider.hasKey ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-slate-900/60 border-purple-800/20'}`}>
                  <CardContent className="p-5 space-y-4">
                    {/* Provider Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${provider.hasKey ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {PROVIDER_ICON[provider.icon] || <Sparkles className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{provider.label}</h3>
                            {provider.hasKey ? (
                              <Badge className="bg-emerald-600 text-[10px]">
                                <Check className="w-3 h-3 mr-0.5" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-purple-600 text-purple-400 text-[10px]">
                                Not configured
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{provider.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white h-8"
                          onClick={() => setExpandedHelp(expandedHelp === provider.name ? null : provider.name)}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-700 text-slate-300 hover:bg-purple-900/20 h-8"
                          onClick={() => window.open(provider.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" /> Get Key
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Help */}
                    {expandedHelp === provider.name && (
                      <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 text-sm">
                        <div>
                          <p className="font-semibold text-slate-300 mb-1">Free Tier</p>
                          <p className="text-xs text-slate-400">{provider.freeTierDetails}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-300 mb-1">Paid Tier</p>
                          <p className="text-xs text-slate-400">{provider.paidTierDetails}</p>
                        </div>
                        <Separator className="bg-purple-800/20" />
                        <div>
                          <p className="font-semibold text-slate-300 mb-1">Setup Instructions</p>
                          <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                            <li>Click "Get Key" to open {provider.label}'s website</li>
                            <li>Create a free account (if you don't have one)</li>
                            <li>Navigate to API Keys section</li>
                            <li>Generate a new key and copy it</li>
                            <li>Paste it below and click Save</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* Key Input Area */}
                    <div className="flex items-end gap-2">
                      {provider.hasKey ? (
                        <div className="flex-1 flex items-center gap-2 bg-emerald-900/20 border border-emerald-800/30 rounded-lg px-3 py-2">
                          <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-sm text-emerald-300 font-mono">{provider.keyMasked}</span>
                          <Check className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                        </div>
                      ) : (
                        <div className="flex-1 relative">
                          <input
                            type={showKey[provider.name] ? 'text' : 'password'}
                            value={keyInputs[provider.name] || ''}
                            onChange={(e) => setKeyInputs((prev) => ({ ...prev, [provider.name]: e.target.value }))}
                            placeholder={`Paste your ${provider.label} API key...`}
                            className="w-full bg-slate-800/50 border border-purple-800/20 rounded-lg px-3 py-2 pr-10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                          />
                          <button
                            onClick={() => setShowKey((prev) => ({ ...prev, [provider.name]: !prev[provider.name] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                          >
                            {showKey[provider.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      )}

                      {provider.hasKey ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-800 text-red-400 hover:bg-red-900/20 shrink-0"
                          onClick={() => handleClearKey(provider.name)}
                        >
                          {justCleared === provider.name ? <><Check className="w-4 h-4 mr-1" /> Cleared</> : <><X className="w-4 h-4 mr-1" /> Remove</>}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 shrink-0"
                          onClick={() => handleSaveKey(provider.name)}
                          disabled={!keyInputs[provider.name] || keyInputs[provider.name].length < 10}
                        >
                          {justSaved === provider.name ? <><Check className="w-4 h-4 mr-1" /> Saved</> : <><Key className="w-4 h-4 mr-1" /> Save</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tools & Services Tab */}
          <TabsContent value="tools" className="space-y-4">
            <p className="text-sm text-slate-400">
              Additional integrations for images, audio, translation, and more. Some require API keys, others work for free.
            </p>

            <div className="grid gap-4">
              {ADDITIONAL_INTEGRATIONS.map((integration) => {
                const hasKey = integration.alwaysFree || !!(loadUserKey(integration.id) && loadUserKey(integration.id)!.length > 5);
                return (
                  <Card key={integration.id} className={`border transition-all ${hasKey ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-slate-900/60 border-purple-800/20'}`}>
                    <CardContent className="p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${hasKey ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {integration.category === 'image' && <BookOpen className="w-5 h-5" />}
                            {integration.category === 'audio' && <Zap className="w-5 h-5" />}
                            {integration.category === 'translation' && <Globe className="w-5 h-5" />}
                            {integration.category === 'support' && <Heart className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{integration.name}</h3>
                              {integration.alwaysFree ? (
                                <Badge className="bg-emerald-600 text-[10px]">
                                  <Check className="w-3 h-3 mr-0.5" /> Always Free
                                </Badge>
                              ) : hasKey ? (
                                <Badge className="bg-emerald-600 text-[10px]">
                                  <Check className="w-3 h-3 mr-0.5" /> Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-purple-600 text-purple-400 text-[10px]">
                                  Optional Key
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{integration.description}</p>
                          </div>
                        </div>
                        {integration.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-700 text-slate-300 hover:bg-purple-900/20 h-8"
                            onClick={() => window.open(integration.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> {integration.category === 'support' ? 'Donate' : 'Sign Up'}
                          </Button>
                        )}
                      </div>

                      {/* Setup Steps */}
                      <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-slate-300">Setup Steps:</p>
                        {integration.setupSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <ArrowRight className="w-3 h-3 mt-0.5 text-purple-400 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-amber-600/50 text-amber-400 text-[10px]">
                          {integration.pricing}
                        </Badge>
                      </div>

                      {/* Key Input for non-free integrations */}
                      {!integration.alwaysFree && (
                        <div className="flex items-end gap-2">
                          {hasKey ? (
                            <div className="flex-1 flex items-center gap-2 bg-emerald-900/20 border border-emerald-800/30 rounded-lg px-3 py-2">
                              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="text-sm text-emerald-300 font-mono">{(loadUserKey(integration.id) || '').slice(0, 8)}...{(loadUserKey(integration.id) || '').slice(-4)}</span>
                              <Check className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                            </div>
                          ) : (
                            <div className="flex-1 relative">
                              <input
                                type={showKey[integration.id] ? 'text' : 'password'}
                                value={keyInputs[integration.id] || ''}
                                onChange={(e) => setKeyInputs((prev) => ({ ...prev, [integration.id]: e.target.value }))}
                                placeholder={`Paste your ${integration.name} API key...`}
                                className="w-full bg-slate-800/50 border border-purple-800/20 rounded-lg px-3 py-2 pr-10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                              />
                              <button
                                onClick={() => setShowKey((prev) => ({ ...prev, [integration.id]: !prev[integration.id] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                              >
                                {showKey[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          )}

                          {hasKey ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-800 text-red-400 hover:bg-red-900/20 shrink-0"
                              onClick={() => handleClearExtraKey(integration.id)}
                            >
                              {justCleared === integration.id ? <><Check className="w-4 h-4 mr-1" /> Cleared</> : <><X className="w-4 h-4 mr-1" /> Remove</>}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 shrink-0"
                              onClick={() => handleSaveExtraKey(integration.id)}
                              disabled={!keyInputs[integration.id] || keyInputs[integration.id].length < 5}
                            >
                              {justSaved === integration.id ? <><Check className="w-4 h-4 mr-1" /> Saved</> : <><Key className="w-4 h-4 mr-1" /> Save</>}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Premium Benefits */}
        <Card className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 border-amber-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Crown className="w-5 h-5" /> What You Get With Premium Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { feature: 'Story Generation', free: 'Pollinations AI (good)', premium: 'GPT-4o, Claude, Llama 3.3 (excellent)', icon: BookOpen },
                { feature: 'Grammar Check', free: 'Pollinations AI (basic)', premium: 'GPT-4o, Claude (professional editor quality)', icon: CheckCircle2 },
                { feature: 'Suggestions', free: 'Pollinations AI (generic)', premium: 'Premium AI (detailed, actionable)', icon: Lightbulb },
                { feature: 'Translation', free: 'LibreTranslate (basic)', premium: 'DeepL + Premium AI (natural, nuanced)', icon: Globe },
                { feature: 'Story Mixer', free: 'Pollinations AI', premium: 'Premium AI (better blending, more creative)', icon: Sparkles },
                { feature: 'AI Developer', free: 'Pollinations AI', premium: 'Premium AI (richer outlines, deeper characters)', icon: Brain },
                { feature: 'Audiobook TTS', free: 'Browser voices (robotic)', premium: 'ElevenLabs (human-like quality)', icon: Zap },
                { feature: 'Character Influence', free: 'Basic companion flavor', premium: 'Full companion personality injection into premium AI', icon: Users },
              ].map((item) => (
                <div key={item.feature} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <item.icon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-200">{item.feature}</p>
                    <p className="text-xs text-slate-400">Free: {item.free}</p>
                    <p className="text-xs text-amber-400">Premium: {item.premium}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-slate-900/60 border-purple-800/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" /> Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { q: 'Is StoryRealm free to use?', a: 'Yes! StoryRealm AI is completely free to use. All core features work without any API keys. Adding your own keys simply improves AI quality.' },
              { q: 'Are my API keys safe?', a: 'Absolutely. Your keys are stored only in your browser\'s localStorage. They are never sent to our servers. API calls go directly from your browser to the AI provider.' },
              { q: 'Do I need a credit card for free tiers?', a: 'Most providers offer free tiers without a credit card. Some may require one for verification but won\'t charge you until you exceed free limits.' },
              { q: 'Can I use multiple providers at once?', a: 'Yes! StoryRealm will automatically try all configured providers in priority order until one succeeds. More providers = better reliability.' },
              { q: 'What if I run out of free credits?', a: 'StoryRealm automatically falls back to Pollinations AI (unlimited free) and then to the local engine. You\'ll never be stuck without AI.' },
              { q: 'How do I know which provider is being used?', a: 'After each AI generation, a small badge shows which provider was used. You\'ll always know if premium or free AI generated your content.' },
            ].map((faq, i) => (
              <div key={i}>
                <p className="font-semibold text-sm text-slate-200 mb-1">{faq.q}</p>
                <p className="text-xs text-slate-400">{faq.a}</p>
                {i < 5 && <Separator className="mt-3 bg-purple-800/10" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 py-4">
          <p className="text-sm text-slate-400">Ready to start writing?</p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-amber-600" onClick={() => navigate('/dashboard')}>
              <BookOpen className="w-4 h-4 mr-2" /> Go to Dashboard
            </Button>
            <Button variant="outline" className="border-purple-700 text-slate-300" onClick={() => navigate('/docs')}>
              <Info className="w-4 h-4 mr-2" /> Read Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Crown icon component for the premium benefits section
function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
