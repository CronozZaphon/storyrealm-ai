import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Copyright, AlertTriangle, FileText, Mail, Scale } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DMCAPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Copyright className="w-5 h-5 text-amber-400" />
          <h1 className="font-bold text-lg">DMCA & Copyright Policy</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Scale className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">DMCA & Copyright Policy</h2>
          <p className="text-slate-400">Last updated: July 1, 2026</p>
        </div>

        <div className="space-y-8">
          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Copyright className="w-5 h-5" /> Copyright Ownership
              </h3>
              <p className="text-slate-300 leading-relaxed">
                <strong>You retain full ownership</strong> of all content you create using StoryRealm AI. 
                We claim no copyright, license, or intellectual property rights over your stories, characters, 
                or any original creative work you produce using the Service. Your content belongs to you alone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> AI-Generated Content Notice
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  StoryRealm AI uses artificial intelligence to assist with creative writing. AI-generated content may:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Resemble existing works unintentionally due to training data patterns</li>
                  <li>Not be eligible for copyright protection in some jurisdictions</li>
                  <li>Require human authorship for copyright registration in some countries</li>
                </ul>
                <p>
                  We strongly recommend that you review, edit, and substantially modify any AI-generated content 
                  before publishing. Adding your own creative input, voice, and originality strengthens your 
                  copyright claim over the final work.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> DMCA Takedown Procedure
              </h3>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p>
                  If you believe that content on StoryRealm AI infringes your copyright, you may submit a DMCA 
                  takedown notice. To be effective, your notice must include:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the infringing material and its location on the Service</li>
                  <li>Your contact information (address, phone number, email)</li>
                  <li>A statement that you have a good faith belief the use is not authorized</li>
                  <li>A statement that the information in the notice is accurate, under penalty of perjury</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Submit a Takedown Notice
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                To submit a DMCA takedown notice, please contact us through our{' '}
                <button onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')} className="text-amber-400 hover:underline">
                  Ko-fi page
                </button>{' '}
                with the subject line "DMCA Takedown Request."
              </p>
              <p className="text-slate-300 leading-relaxed">
                We will respond to all legitimate DMCA notices promptly. Upon receipt of a valid notice, 
                we will remove or disable access to the allegedly infringing material and notify the user 
                who posted it.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Counter-Notification</h3>
              <p className="text-slate-300 leading-relaxed">
                If you believe your content was removed in error, you may submit a counter-notification. 
                Your counter-notification must include your contact information, identification of the removed material, 
                a statement under penalty of perjury that you believe the removal was a mistake, and your consent 
                to jurisdiction in the appropriate court. Submit counter-notifications through our Ko-fi page.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-purple-800/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Repeat Infringers</h3>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to terminate accounts of users who are determined to be repeat infringers 
                of copyright. We will make reasonable efforts to investigate and take appropriate action.
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
