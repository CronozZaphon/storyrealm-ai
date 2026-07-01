import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Plus, Wand2, Music, Scroll, Settings, Sparkles, Trash2, Edit3, Heart, HelpCircle, Download, Upload, FileText, Zap, TrendingUp, Feather, Target, GitMerge, Brain, ArrowRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { storyDB } from '@/lib/db-client'
import { WRITING_TEMPLATES } from '@/lib/ai-engine'

type Story = { id: number; title: string; genre: string; status: string; updatedAt: string };

const praiseMessages = [
  { character: 'Eldrin', image: '/wizard-guide.png', message: 'Your creativity knows no bounds, author!' },
  { character: 'Lyra', image: '/warrior-praise.png', message: 'Every story you write makes you stronger!' },
  { character: 'Melody', image: '/bard-audio.png', message: 'The realms await your next masterpiece!' },
  { character: 'Shadow', image: '/rogue-mystery.png', message: 'The shadows whisper of your growing power...' },
];

const statusColors: Record<string, string> = {
  draft: 'bg-slate-600', 'in-progress': 'bg-amber-600', completed: 'bg-emerald-600',
};

export default function Dashboard() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [newStoryOpen, setNewStoryOpen] = useState(false)
  const [newStory, setNewStory] = useState({ title: '', genre: 'Fantasy', description: '' })
  const [praiseIdx, setPraiseIdx] = useState(0)
  const [stats, setStats] = useState({ totalStories: 0, totalWords: 0, totalChapters: 0, writingStreak: 0 })
  const [showTemplates, setShowTemplates] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')

  const loadStories = useCallback(async () => {
    const list = await storyDB.list()
    setStories(list as Story[])
    const s = await storyDB.getStats()
    setStats(s)
  }, [])

  useEffect(() => { loadStories() }, [loadStories])

  const handleCreateStory = async () => {
    if (!newStory.title) return
    await storyDB.create({
      title: newStory.title, description: newStory.description || '',
      genre: newStory.genre, status: 'draft',
    })
    setNewStoryOpen(false)
    setNewStory({ title: '', genre: 'Fantasy', description: '' })
    setPraiseIdx((prev) => (prev + 1) % praiseMessages.length)
    await loadStories()
  }

  const deleteStory = async (id: number) => {
    await storyDB.delete(id)
    await loadStories()
  }

  const handleExport = async () => {
    const data = await storyDB.exportAll()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `storyrealm-backup-${new Date().toISOString().split('T')[0]}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    if (!importText.trim()) return
    try {
      await storyDB.importAll(importText)
      setShowImport(false)
      setImportText('')
      await loadStories()
    } catch (e) {
      alert('Invalid import file. Please check the JSON format.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">StoryRealm AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hidden sm:flex" onClick={() => navigate('/docs')}>
              <HelpCircle className="w-4 h-4 mr-1" /> Help
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => setShowImport(true)}>
              <Upload className="w-4 h-4 mr-1" /> Import
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
              <Heart className="w-4 h-4 mr-1 text-rose-400" /> Support
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Story Library</h1>
            <p className="text-slate-400">Manage your tales, forge new worlds</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 border border-purple-800/20 rounded-xl p-3">
            <img src={praiseMessages[praiseIdx].image} alt="" className="w-12 h-12 rounded-full object-cover border border-amber-400/30" />
            <div>
              <p className="text-xs text-amber-400 font-bold">{praiseMessages[praiseIdx].character} says:</p>
              <p className="text-sm text-slate-300 italic">"{praiseMessages[praiseIdx].message}"</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BookOpen, label: 'Stories', value: stats.totalStories, color: 'text-purple-400' },
            { icon: Feather, label: 'Words Written', value: stats.totalWords.toLocaleString(), color: 'text-amber-400' },
            { icon: FileText, label: 'Chapters', value: stats.totalChapters, color: 'text-emerald-400' },
            { icon: TrendingUp, label: 'Day Streak', value: stats.writingStreak, color: 'text-rose-400' },
          ].map((s, i) => (
            <Card key={i} className="bg-slate-900/40 border-purple-800/20">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={`w-8 h-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { icon: Plus, label: 'New Story', color: 'from-purple-600 to-purple-700', action: () => setNewStoryOpen(true) },
            { icon: GitMerge, label: 'Story Mixer', color: 'from-indigo-600 to-violet-700', action: () => navigate('/mixer') },
            { icon: Brain, label: 'AI Developer', color: 'from-violet-600 to-fuchsia-700', action: () => navigate('/developer') },
            { icon: Wand2, label: 'Manhua Studio', color: 'from-emerald-600 to-emerald-700', action: () => navigate('/manhua') },
            { icon: Music, label: 'Audiobook Lab', color: 'from-rose-600 to-rose-700', action: () => navigate('/audiobook') },
            { icon: Scroll, label: 'KDP Formatter', color: 'from-blue-600 to-blue-700', action: () => navigate('/formatter') },
          ].map((a, i) => (
            <button key={i} onClick={a.action} className={`bg-gradient-to-br ${a.color} rounded-xl p-4 text-left hover:shadow-lg transition-all hover:scale-[1.02]`}>
              <a.icon className="w-6 h-6 mb-2 text-white/80" />
              <span className="font-semibold text-sm">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Integrations Hub Banner */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/integrations')}
            className="w-full bg-gradient-to-r from-purple-900/30 to-amber-900/20 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between hover:border-purple-400/40 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-200">Integrations Hub</p>
                <p className="text-xs text-slate-400">Add API keys for premium AI, discover free tools, and more</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {/* Writing Templates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-amber-400" /> Writing Templates</h2>
            <Button variant="ghost" size="sm" className="text-purple-400" onClick={() => setShowTemplates(!showTemplates)}>
              {showTemplates ? 'Hide' : 'Show All'}
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(showTemplates ? WRITING_TEMPLATES : WRITING_TEMPLATES.slice(0, 3)).map((t) => (
              <Card key={t.id} className="bg-slate-900/40 border-purple-800/20 hover:border-purple-500/40 transition-all cursor-pointer group" onClick={() => navigate('/editor')}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-amber-400 transition-colors">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Story Dialog */}
        <Dialog open={newStoryOpen} onOpenChange={setNewStoryOpen}>
          <DialogContent className="bg-slate-900 border-purple-800/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /> Begin a New Quest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-semibold text-slate-300">Story Title</label>
                <Input placeholder="Enter your epic title..." value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} className="bg-slate-800 border-purple-800/30 mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Genre</label>
                <Select value={newStory.genre} onValueChange={(v) => setNewStory({ ...newStory, genre: v })}>
                  <SelectTrigger className="bg-slate-800 border-purple-800/30 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-800/30">
                    {['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Cyberpunk', 'Historical', 'Thriller', 'Adventure', 'Other'].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Description (optional)</label>
                <Input placeholder="A brief description..." value={newStory.description} onChange={(e) => setNewStory({ ...newStory, description: e.target.value })} className="bg-slate-800 border-purple-800/30 mt-1" />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-amber-600" onClick={handleCreateStory}>
                <BookOpen className="w-4 h-4 mr-2" /> Create Story
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent className="bg-slate-900 border-purple-800/30 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Upload className="w-5 h-5 text-amber-400" /> Import Stories</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-400 mb-2">Paste your StoryRealm JSON backup file contents:</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste JSON here..."
              className="w-full h-40 bg-slate-800 border border-purple-800/30 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 resize-none font-mono" />
            <Button className="bg-gradient-to-r from-purple-600 to-amber-600" onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
          </DialogContent>
        </Dialog>

        {/* Stories Grid */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400" /> Your Stories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="bg-slate-900/60 border-purple-800/20 hover:border-purple-500/40 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate(`/editor/${story.id}`)}>{story.title}</CardTitle>
                    <p className="text-sm text-slate-400 mt-1">{story.genre}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[story.status] || statusColors.draft} text-white capitalize`}>{story.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mb-3">Updated {new Date(story.updatedAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-purple-800/30 hover:bg-purple-900/30" onClick={() => navigate(`/editor/${story.id}`)}>
                    <Edit3 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-800/30 hover:bg-red-900/30 hover:text-red-400" onClick={() => deleteStory(story.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No stories yet</h3>
            <p className="text-slate-500 mb-4">Begin your first adventure!</p>
            <Button onClick={() => setNewStoryOpen(true)} className="bg-gradient-to-r from-purple-600 to-amber-600">
              <Plus className="w-4 h-4 mr-2" /> Create Your First Story
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-purple-800/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/terms')} className="hover:text-slate-400">Terms</button>
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-400">Privacy</button>
            <button onClick={() => navigate('/dmca')} className="hover:text-slate-400">DMCA</button>
            <button onClick={() => navigate('/docs')} className="hover:text-slate-400">Documentation</button>
          </div>
          <p>StoryRealm AI &middot; Free forever &middot; <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="text-amber-500 hover:text-amber-400">Support on Ko-fi</button></p>
        </div>
      </div>
    </div>
  )
}
