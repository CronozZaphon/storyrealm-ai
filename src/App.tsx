import { Routes, Route } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from '@/pages/LandingPage'
import Dashboard from '@/pages/Dashboard'
import StoryEditor from '@/pages/StoryEditor'
import ManhuaGenerator from '@/pages/ManhuaGenerator'
import AudiobookCreator from '@/pages/AudiobookCreator'
import BookFormatter from '@/pages/BookFormatter'
import Settings from '@/pages/Settings'
import TermsPage from '@/pages/TermsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import DMCAPage from '@/pages/DMCAPage'
import DocsPage from '@/pages/DocsPage'
import StoryMixer from '@/pages/StoryMixer'
import AIStoryDeveloper from '@/pages/AIStoryDeveloper'
import IntegrationsHub from '@/pages/IntegrationsHub'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="storyrealm-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:storyId?" element={<StoryEditor />} />
        <Route path="/manhua/:storyId?" element={<ManhuaGenerator />} />
        <Route path="/audiobook/:storyId?" element={<AudiobookCreator />} />
        <Route path="/formatter/:storyId?" element={<BookFormatter />} />
        <Route path="/mixer" element={<StoryMixer />} />
        <Route path="/developer" element={<AIStoryDeveloper />} />
        <Route path="/integrations" element={<IntegrationsHub />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dmca" element={<DMCAPage />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
