import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Scroll, Scale, BookOpen, Users, Globe, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Scale className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-lg">Terms of Service</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Scroll className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Terms of Service</h2>
          <p className="text-slate-400">Last updated: July 1, 2026</p>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> 1. Acceptance of Terms
              </h3>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using StoryRealm AI ("the Service"), you accept and agree to be bound by these Terms of Service. 
                The Service is provided by Silvercro ("we", "us", "our") as a free platform for creative writing and storytelling. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> 2. User Accounts & Eligibility
              </h3>
              <p className="text-slate-300 leading-relaxed">
                You must be at least 13 years old to use the Service. By using StoryRealm AI, you represent that you meet this age requirement. 
                You are responsible for maintaining the confidentiality of any API keys or credentials you add to your account. 
                You may use the Service without creating an account for basic features.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" /> 3. AI-Generated Content
              </h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                StoryRealm AI uses multiple AI providers to generate content, including but not limited to:
              </p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside mb-3">
                <li>Pollinations AI (free text and image generation)</li>
                <li>Together AI (free tier language models)</li>
                <li>Google Gemini (free tier)</li>
                <li>Cloudflare Workers AI (free tier)</li>
                <li>OpenRouter (free tier access to multiple models)</li>
                <li>OpenAI GPT (when user provides their own API key)</li>
                <li>Anthropic Claude (when user provides their own API key)</li>
              </ul>
              <p className="text-slate-300 leading-relaxed">
                AI-generated content is provided "as is" and we make no guarantees about accuracy, originality, or appropriateness. 
                You are solely responsible for reviewing and editing any AI-generated content before publishing or distributing it.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Scroll className="w-5 h-5" /> 4. User Content & Intellectual Property
              </h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                <strong>You retain full ownership</strong> of all content you create using StoryRealm AI. 
                We claim no rights to your stories, characters, or any original work you produce. 
                You may use content generated through the Service for personal or commercial purposes, including publishing on Amazon KDP, 
                YouTube, Facebook, or any other platform.
              </p>
              <p className="text-slate-300 leading-relaxed">
                You are responsible for ensuring that your content does not infringe on the intellectual property rights of others. 
                We reserve the right to remove content that violates copyright or other applicable laws.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" /> 5. Acceptable Use
              </h3>
              <p className="text-slate-300 leading-relaxed mb-3">You agree not to use the Service to:</p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside">
                <li>Generate or distribute illegal, harmful, threatening, abusive, harassing, defamatory, or obscene content</li>
                <li>Create content that promotes violence, discrimination, or hatred against individuals or groups</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Use the Service to generate spam, malware, or other malicious content</li>
                <li>Interfere with or disrupt the Service or servers connected to it</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">6. Disclaimer of Warranties</h3>
              <p className="text-slate-300 leading-relaxed">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. 
                We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. 
                We do not warrant that AI-generated content will be accurate, original, or suitable for any particular purpose. 
                You use the Service at your own risk.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">7. Limitation of Liability</h3>
              <p className="text-slate-300 leading-relaxed">
                To the maximum extent permitted by law, Silvercro shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising from your use of the Service. 
                This includes but is not limited to damages for loss of profits, goodwill, data, or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">8. Changes to Terms</h3>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                by posting an updated version on this page with a revised "Last updated" date. 
                Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">9. Termination</h3>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to suspend or terminate access to the Service for any user who violates these Terms. 
                You may stop using the Service at any time. Upon termination, all provisions of these Terms that by their 
                nature should survive termination shall survive.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">10. Contact</h3>
              <p className="text-slate-300 leading-relaxed">
                For questions about these Terms, please contact us through our{' '}
                <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="text-amber-400 hover:underline">
                  Ko-fi page
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
