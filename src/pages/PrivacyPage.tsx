import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Shield, Eye, Database, Lock, Cookie, Share2, UserX, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Shield className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-lg">Privacy Policy</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Eye className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Privacy Policy</h2>
          <p className="text-slate-400">Last updated: July 1, 2026</p>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Our Commitment to Privacy
              </h3>
              <p className="text-slate-300 leading-relaxed">
                At StoryRealm AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, 
                and protect your information when you use our Service. We believe your creative work and personal data 
                belong to you alone. We minimize data collection and never sell your information to third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" /> Information We Collect
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p><strong>Stories and Content:</strong> We store the stories, chapters, and characters you create to provide the core Service functionality. Your creative content is yours—we claim no ownership.</p>
                <p><strong>API Keys (Optional):</strong> If you choose to add your own OpenAI or Claude API keys in Settings, these are stored locally in your browser (localStorage) and sent directly to the respective AI providers. We do not store your API keys on our servers.</p>
                <p><strong>Usage Data:</strong> We collect anonymous usage statistics such as page views and feature usage to improve the Service. This data cannot be used to identify you personally.</p>
                <p><strong>Technical Data:</strong> We may collect browser type, device information, and IP address for security purposes and to prevent abuse of the Service.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" /> How We Use Your Information
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>We use collected information to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide and maintain the Service</li>
                  <li>Save your stories and creative work</li>
                  <li>Process AI generation requests through third-party providers</li>
                  <li>Improve and optimize the Service</li>
                  <li>Detect and prevent fraud, abuse, or security threats</li>
                  <li>Communicate with you about the Service (if you contact us)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Third-Party AI Providers
              </h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                When you use AI features, your text may be sent to third-party AI providers:
              </p>
              <div className="text-slate-300 space-y-2">
                <p><strong>Free AI Providers:</strong> Pollinations AI, Together AI, Google Gemini, Cloudflare Workers AI, OpenRouter. These services may process your text according to their own privacy policies.</p>
                <p><strong>User-Provided API Keys:</strong> When you add your own OpenAI or Claude API key, your requests go directly to those services using your account. We do not intercept or store this traffic.</p>
                <p><strong>Image Generation:</strong> Manhua panel images are generated through Pollinations AI. Your text descriptions are sent to their service to create images.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Cookie className="w-5 h-5" /> Cookies & Local Storage
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>We use minimal cookies and localStorage for:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Theme preferences (dark/light mode)</li>
                  <li>Your optional API keys (stored only in your browser)</li>
                  <li>Session state and UI preferences</li>
                </ul>
                <p>We do not use tracking cookies or third-party analytics cookies.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" /> Data Security
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS) 
                and secure database storage. However, no method of transmission over the Internet is 100% secure. 
                We cannot guarantee absolute security but work continuously to protect your information.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <UserX className="w-5 h-5" /> Your Rights
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Export your stories and content at any time</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Request restriction of processing</li>
                </ul>
                <p>To exercise these rights, contact us through our Ko-fi page.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Contact Us
              </h3>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through{' '}
                <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="text-amber-400 hover:underline">
                  our Ko-fi page
                </button>.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-purple-800/20" />

        <div className="text-center pb-8">
          <Button variant="outline" className="border-purple-800/30 text-purple-300" onClick={() => navigate('/')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
