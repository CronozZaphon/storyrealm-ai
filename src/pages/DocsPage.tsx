import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, BookOpen, Sparkles, Zap, Heart, Globe, Download, Shield, Users, Wand2, Music, Scroll, Key, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react'
import { useState } from 'react'

const sections = [
  { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
  { id: 'story-editor', title: 'Story Editor', icon: Sparkles },
  { id: 'ai-features', title: 'AI Features', icon: Zap },
  { id: 'companions', title: 'Character Companions', icon: Users },
  { id: 'manhua', title: 'Manhua Studio', icon: Wand2 },
  { id: 'audiobook', title: 'Audiobook Lab', icon: Music },
  { id: 'kdp', title: 'KDP Formatter', icon: Scroll },
  { id: 'api-keys', title: 'API Keys & AI Providers', icon: Key },
  { id: 'translation', title: 'Translation', icon: Globe },
  { id: 'export', title: 'Export & Backup', icon: Download },
  { id: 'legal', title: 'Legal & Copyright', icon: Shield },
  { id: 'upgrading', title: 'Future Upgrades', icon: ArrowRight },
];

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: typeof BookOpen; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <Card className="bg-slate-900/60 border-purple-800/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Icon className="w-5 h-5" /> {title}
          </h2>
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export default function DocsPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('getting-started')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-lg">StoryRealm AI — Documentation</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20 space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Guide Sections</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                    activeSection === s.id ? 'bg-purple-900/40 text-amber-400 border border-purple-800/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <s.icon className="w-4 h-4 shrink-0" /> {s.title}
                </button>
              ))}
              <div className="pt-4 border-t border-purple-800/20 mt-4">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-amber-500" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
                  <Heart className="w-4 h-4 mr-2" /> Support Us
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">StoryRealm AI Documentation</h2>
              <p className="text-slate-400">Everything you need to forge your legends</p>
            </div>

            <Section id="getting-started" title="Getting Started" icon={BookOpen}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Welcome to <strong className="text-amber-400">StoryRealm AI</strong> — your free, AI-powered storytelling companion. No signup required. No credit card. Just open the app and start writing.</p>
                <h4 className="font-bold text-white mt-4">Quick Start (30 seconds)</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click <strong>"Begin Your Quest"</strong> on the home page</li>
                  <li>Click <strong>"New Story"</strong> and give it a title</li>
                  <li>Open the Story Editor and start typing</li>
                  <li>Type an instruction in the AI box and hit Enter — watch AI continue your story!</li>
                </ol>
                <h4 className="font-bold text-white mt-4">Your Data</h4>
                <p>All stories are saved automatically in your browser using <strong>IndexedDB</strong>. They persist even if you close the tab or restart your browser. You can also export your stories as JSON files for backup.</p>
              </div>
            </Section>

            <Section id="story-editor" title="Story Editor" icon={Sparkles}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>The Story Editor is your creative forge. It features three writing modes inspired by NovelAI:</p>
                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-800/20">
                    <p className="font-bold text-purple-400 mb-1">Story Mode</p>
                    <p className="text-xs">AI writes rich narrative with description, dialogue, and pacing. Best for general storytelling.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-800/20">
                    <p className="font-bold text-amber-400 mb-1">Do Mode</p>
                    <p className="text-xs">AI focuses on actions and events. Best for fight scenes, travel, and plot advancement.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-emerald-800/20">
                    <p className="font-bold text-emerald-400 mb-1">Say Mode</p>
                    <p className="text-xs">AI writes dialogue with tags and actions. Best for conversations and character moments.</p>
                  </div>
                </div>
                <h4 className="font-bold text-white mt-4">Keyboard Shortcuts</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">Enter</kbd> in AI box — Generate</li>
                  <li><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">Shift+Enter</kbd> — New line in AI box</li>
                </ul>
              </div>
            </Section>

            <Section id="ai-features" title="AI Features" icon={Zap}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>StoryRealm AI includes multiple AI-powered tools:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-emerald-400">Grammar Check</strong> — Fixes grammar, punctuation, and spacing with explanations</li>
                  <li><strong className="text-amber-400">Suggestions</strong> — Gets 3 actionable writing tips (style, description, dialogue)</li>
                  <li><strong className="text-purple-400">AI Generation</strong> — Continues your story in Do/Say/Story modes</li>
                  <li><strong className="text-cyan-400">Translation</strong> — Translate your story into 20+ languages</li>
                  <li><strong className="text-rose-400">Templates</strong> — Choose from 10 writing prompts (Hero's Journey, Meet Cute, Plot Twist, etc.)</li>
                </ul>
                <div className="bg-amber-900/20 border border-amber-800/20 rounded-lg p-3 mt-3">
                  <p className="text-xs text-amber-300"><AlertTriangle className="w-3 h-3 inline mr-1" />Without an API key, AI uses free providers (Pollinations AI). Quality may vary. Add your own key for premium results.</p>
                </div>
              </div>
            </Section>

            <Section id="companions" title="Character Companions" icon={Users}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Choose a companion to guide your writing journey. Each has a unique personality and gives different advice:</p>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                    <img src="/wizard-guide.png" alt="Eldrin" className="w-12 h-12 rounded-full object-cover border border-purple-800/30 shrink-0" />
                    <div><p className="font-bold text-amber-400 text-sm">Eldrin the Wise</p><p className="text-xs text-slate-400">Structure, world-building, narrative flow. Patient and thoughtful.</p></div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                    <img src="/warrior-praise.png" alt="Lyra" className="w-12 h-12 rounded-full object-cover border border-purple-800/30 shrink-0" />
                    <div><p className="font-bold text-red-400 text-sm">Lyra Stormblade</p><p className="text-xs text-slate-400">Action, pacing, character strength. Fierce and motivating.</p></div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                    <img src="/rogue-mystery.png" alt="Shadow" className="w-12 h-12 rounded-full object-cover border border-purple-800/30 shrink-0" />
                    <div><p className="font-bold text-emerald-400 text-sm">Shadow Whisper</p><p className="text-xs text-slate-400">Mystery, tension, plot twists. Enigmatic and clever.</p></div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                    <img src="/bard-audio.png" alt="Melody" className="w-12 h-12 rounded-full object-cover border border-purple-800/30 shrink-0" />
                    <div><p className="font-bold text-amber-400 text-sm">Melody Quickstring</p><p className="text-xs text-slate-400">Dialogue, voice, rhythm, emotion. Cheerful and lyrical.</p></div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Change your companion in Settings or click "Change" on their card in the Story Editor.</p>
              </div>
            </Section>

            <Section id="manhua" title="Manhua Studio" icon={Wand2}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Convert your story chapters into visual manhua (Chinese comic) panels:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Manhua Studio</strong> from the Dashboard</li>
                  <li>Paste your story text (or it loads from your current chapter)</li>
                  <li>List your characters (comma-separated)</li>
                  <li>Click <strong>Generate Manhua Panels</strong></li>
                  <li>AI creates visual panels with dialogue bubbles and narration boxes</li>
                </ol>
                <p className="text-xs text-slate-500">Images are generated via Pollinations AI (free). Include dialogue in quotes for speech bubbles.</p>
              </div>
            </Section>

            <Section id="audiobook" title="Audiobook Lab" icon={Music}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Create audiobooks from your stories with ambient atmosphere:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Audiobook Lab</strong> from the Dashboard</li>
                  <li>Paste your story text</li>
                  <li>Choose a voice (Alloy, Echo, Fable, Onyx, Nova, Shimmer)</li>
                  <li>Select ambient atmosphere (Fantasy, Battle, Forest, Ocean, Mystery, Romance)</li>
                  <li>Adjust narration speed</li>
                </ol>
                <div className="bg-amber-900/20 border border-amber-800/20 rounded-lg p-3">
                  <p className="text-xs text-amber-300"><Key className="w-3 h-3 inline mr-1" />Audio generation requires an OpenAI API key. Without it, the app prepares text segments and music suggestions for manual creation.</p>
                </div>
              </div>
            </Section>

            <Section id="kdp" title="KDP Formatter" icon={Scroll}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Format your book for Amazon Kindle Direct Publishing:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choose format: <strong>eBook, Paperback, or Hardcover</strong></li>
                  <li>Select book size (6x9, 5x8, 8.5x11, A4)</li>
                  <li>Customize font family, size, and line spacing</li>
                  <li>Preview your formatted book in real-time</li>
                  <li>Export formatted data for upload to Amazon KDP</li>
                </ul>
              </div>
            </Section>

            <Section id="api-keys" title="API Keys & AI Providers" icon={Key}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>StoryRealm AI works <strong>without any API key</strong> using free providers. Adding your own keys unlocks premium quality.</p>
                <h4 className="font-bold text-white mt-3">Free AI Providers (No Key Needed)</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Pollinations AI</strong> — Text + Images, always free</li>
                </ul>
                <h4 className="font-bold text-white mt-3">Optional API Keys (Free Tiers Available)</h4>
                <table className="w-full text-xs mt-2">
                  <thead><tr className="text-slate-400 border-b border-purple-800/20"><th className="text-left py-1">Provider</th><th className="text-left py-1">Model</th><th className="text-left py-1">Free Tier</th></tr></thead>
                  <tbody className="text-slate-300">
                    <tr><td className="py-1">OpenAI</td><td>GPT-4o Mini</td><td>$5 credit</td></tr>
                    <tr><td className="py-1">Groq</td><td>Llama 3.1 70B</td><td>Generous daily</td></tr>
                    <tr><td className="py-1">Together</td><td>Llama 3.3 70B</td><td>$1 credit</td></tr>
                    <tr><td className="py-1">Google</td><td>Gemini Flash 2.0</td><td>1,500 req/day</td></tr>
                    <tr><td className="py-1">OpenRouter</td><td>Multiple</td><td>20 req/min</td></tr>
                    <tr><td className="py-1">Cohere</td><td>Command R+</td><td>Trial credits</td></tr>
                    <tr><td className="py-1">DeepL</td><td>Translation</td><td>500k chars/mo</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 mt-2">All keys are stored <strong>only in your browser</strong> (localStorage). We never see or store your keys on our servers.</p>
              </div>
            </Section>

            <Section id="translation" title="Translation" icon={Globe}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Translate your stories into 20+ languages to reach global audiences:</p>
                <p className="text-xs">Available: English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Russian, Japanese, Chinese, Korean, Arabic, Hindi, Turkish, Vietnamese, Thai, Indonesian, Swedish, Czech</p>
                <p className="text-xs text-slate-500">Uses DeepL (with key), LibreTranslate, or Pollinations AI as fallback. Perfect for publishing on Amazon KDP in multiple markets!</p>
              </div>
            </Section>

            <Section id="export" title="Export & Backup" icon={Download}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>Your stories belong to you. Export anytime:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JSON Export</strong> — Full backup of all stories and chapters</li>
                  <li><strong>Markdown Export</strong> — Clean text for editing in other tools</li>
                  <li><strong>Import</strong> — Restore from a previous JSON backup</li>
                </ul>
                <p className="text-xs text-slate-500">Stories are also auto-saved to your browser's IndexedDB every 30 seconds while you write.</p>
              </div>
            </Section>

            <Section id="legal" title="Legal & Copyright" icon={Shield}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p><strong>You own everything you create.</strong> StoryRealm AI claims no rights to your stories, characters, or creative work.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All content is stored locally in your browser</li>
                  <li>AI-generated suggestions are starting points — edit and make them your own</li>
                  <li>Review our <button onClick={() => navigate('/terms')} className="text-amber-400 hover:underline">Terms of Service</button>, <button onClick={() => navigate('/privacy')} className="text-amber-400 hover:underline">Privacy Policy</button>, and <button onClick={() => navigate('/dmca')} className="text-amber-400 hover:underline">DMCA Policy</button></li>
                </ul>
              </div>
            </Section>

            <Section id="upgrading" title="Future Upgrades & Plugin System" icon={ArrowRight}>
              <div className="text-slate-300 space-y-3 text-sm leading-relaxed">
                <p>StoryRealm AI is built with a <strong>modular architecture</strong> designed for easy upgrades. The plugin system allows new features to be added without rewriting the core app.</p>
                <h4 className="font-bold text-white mt-3">Planned Features</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Collaborative writing (real-time multi-author editing)</li>
                  <li>AI cover art generation with DALL-E / Stable Diffusion</li>
                  <li>Chapter outlines and beat sheet generation</li>
                  <li>Character relationship mapping visualizer</li>
                  <li>Writing sprints with timed challenges</li>
                  <li>Community story sharing and feedback</li>
                  <li>Integration with Scrivener, Google Docs</li>
                  <li>Mobile app (React Native)</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">Support development via <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="text-amber-400 hover:underline">Ko-fi</button> to help us build these faster!</p>
              </div>
            </Section>

            {/* Support CTA */}
            <div className="text-center py-8">
              <Card className="bg-gradient-to-r from-purple-900/40 to-amber-900/20 border-purple-800/20">
                <CardContent className="p-8 text-center">
                  <Heart className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Love StoryRealm AI?</h3>
                  <p className="text-slate-400 text-sm mb-4">Your support helps us keep the platform free and build new features.</p>
                  <Button className="bg-gradient-to-r from-rose-500 to-amber-500" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
                    <Heart className="w-4 h-4 mr-2" /> Support on Ko-fi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
