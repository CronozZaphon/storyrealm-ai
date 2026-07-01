import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, BookOpen, Download, FileText, Sparkles, Check, Scroll, Heart, Printer, Type, Layout } from 'lucide-react'

type BookSize = '6x9' | '5x8' | '8.5x11' | 'a4'
type BookType = 'ebook' | 'paperback' | 'hardcover'

const bookSizes: Record<BookSize, { label: string; desc: string }> = {
  '6x9': { label: '6" x 9"', desc: 'Standard fiction' },
  '5x8': { label: '5" x 8"', desc: 'Compact fiction' },
  '8.5x11': { label: '8.5" x 11"', desc: 'Large format' },
  'a4': { label: 'A4', desc: 'International standard' },
}

const formatTypes: BookType[] = ['ebook', 'paperback', 'hardcover']

export default function BookFormatter() {
  const navigate = useNavigate()
  const [bookSize, setBookSize] = useState<BookSize>('6x9')
  const [bookType, setBookType] = useState<BookType>('ebook')
  const [fontFamily, setFontFamily] = useState('Georgia')
  const [fontSize, setFontSize] = useState(12)
  const [lineSpacing, setLineSpacing] = useState(1.5)
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatted, setFormatted] = useState(false)

  const handleFormat = () => {
    setIsFormatting(true)
    setTimeout(() => {
      setFormatted(true)
      setIsFormatting(false)
    }, 2000)
  }

  const exportBook = () => {
    const bookData = {
      title: "The Dragon's Oath",
      author: "StoryRealm Author",
      size: bookSize,
      type: bookType,
      fontFamily,
      fontSize,
      lineSpacing,
      chapters: [
        { title: 'Prologue', content: 'The ancient library...' },
        { title: 'Chapter 1: The Beginning', content: 'Elara stepped forward...' },
      ],
    }
    const blob = new Blob([JSON.stringify(bookData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `book-export-${bookType}-${bookSize}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const previewText = `The ancient library of Valdris stretched endlessly in all directions, its shelves reaching toward a ceiling lost in shadow and starlight. Dust motes danced in beams of golden light that pierced through stained glass windows depicting scenes from forgotten legends.

Elara ran her fingers along the spines of leather-bound tomes, each one humming with residual magic. She had searched for three days, following clues left by her mentor before his disappearance.

"You're not the only one hunting for the Codex, little scholar," a voice purred from the darkness between shelves.

Elara froze, her hand still resting on a volume titled 'The Nature of True Words.' Slowly, she turned to face the stranger.`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-blue-400" />
              <h1 className="font-bold text-lg">KDP Formatter</h1>
            </div>
          </div>
          {formatted && (
            <Button size="sm" variant="outline" className="border-blue-800/30 text-blue-400" onClick={exportBook}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => window.open('https://ko-fi.com/silvercro', '_blank')}>
            <Heart className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" /> Format Settings
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Configure your book for Amazon KDP publishing
              </p>
            </div>

            {/* Book Type */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Book Type</label>
              <div className="grid grid-cols-3 gap-2">
                {formatTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setBookType(type)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      bookType === type
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-slate-700 bg-slate-800/30 hover:border-blue-800/30'
                    }`}
                  >
                    {type === 'ebook' && <FileText className="w-4 h-4 mx-auto mb-1 text-blue-400" />}
                    {type === 'paperback' && <BookOpen className="w-4 h-4 mx-auto mb-1 text-blue-400" />}
                    {type === 'hardcover' && <Scroll className="w-4 h-4 mx-auto mb-1 text-blue-400" />}
                    <p className="text-xs font-medium capitalize">{type}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Book Size */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Book Size</label>
              <Select value={bookSize} onValueChange={(v) => setBookSize(v as BookSize)}>
                <SelectTrigger className="bg-slate-800/50 border-blue-800/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-blue-800/20">
                  {(Object.keys(bookSizes) as BookSize[]).map((size) => (
                    <SelectItem key={size} value={size}>
                      <div>
                        <div className="font-medium">{bookSizes[size].label}</div>
                        <div className="text-xs text-slate-500">{bookSizes[size].desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Settings */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-400" /> Font
              </label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="bg-slate-800/50 border-blue-800/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-blue-800/20">
                  <SelectItem value="Georgia">Georgia (Serif)</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Garamond">Garamond</SelectItem>
                  <SelectItem value="Arial">Arial (Sans-serif)</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Palatino">Palatino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Font Size: {fontSize}pt</label>
              <input
                type="range"
                min={10}
                max={16}
                step={0.5}
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>10pt</span>
                <span>16pt</span>
              </div>
            </div>

            {/* Line Spacing */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Line Spacing: {lineSpacing}x</label>
              <input
                type="range"
                min={1.0}
                max={2.5}
                step={0.1}
                value={lineSpacing}
                onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1.0</span>
                <span>1.5</span>
                <span>2.5</span>
              </div>
            </div>

            <Button
              onClick={handleFormat}
              disabled={isFormatting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isFormatting ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Formatting...
                </>
              ) : (
                <>
                  <Layout className="w-4 h-4 mr-2" /> Format for KDP
                </>
              )}
            </Button>

            {/* Guidelines */}
            <div className="bg-slate-900/50 border border-blue-800/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-blue-400 mb-2">KDP Guidelines</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Ebooks: Use reflowable layout</li>
                <li>• Paperbacks: Add bleed for images</li>
                <li>• Include front matter (title, copyright)</li>
                <li>• Add back matter (author bio, links)</li>
                <li>• Embed fonts for consistency</li>
              </ul>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" /> Book Preview
            </h2>

            {!formatted && !isFormatting && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-dashed border-blue-800/20 rounded-2xl">
                <BookOpen className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400">Your formatted book will appear here</p>
                <p className="text-slate-500 text-sm">Configure settings and click Format</p>
              </div>
            )}

            {isFormatting && (
              <div className="flex flex-col items-center justify-center h-96 bg-slate-900/30 border border-blue-800/20 rounded-2xl">
                <Sparkles className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-blue-400 font-semibold">Formatting your book...</p>
                <p className="text-slate-500 text-sm mt-2">Applying KDP specifications</p>
              </div>
            )}

            {formatted && (
              <div className="space-y-6">
                {/* Book Info */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-blue-800/30 text-blue-400">
                    {bookType.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-blue-800/30 text-blue-400">
                    {bookSizes[bookSize].label}
                  </Badge>
                  <Badge variant="outline" className="border-blue-800/30 text-blue-400">
                    {fontFamily} {fontSize}pt
                  </Badge>
                </div>

                {/* Book Pages */}
                <Card className="bg-white text-black border-0 shadow-2xl max-w-lg mx-auto">
                  {/* Title Page */}
                  <CardContent className="p-12 min-h-[600px] flex flex-col items-center justify-center text-center border-b border-gray-200">
                    <h1 className="text-3xl font-bold mb-4" style={{ fontFamily }}>The Dragon's Oath</h1>
                    <p className="text-lg text-gray-600 mb-8">A Tale of Magic and Courage</p>
                    <Separator className="w-24 my-4 bg-gray-300" />
                    <p className="text-gray-600">by</p>
                    <p className="text-xl mt-2" style={{ fontFamily }}>StoryRealm Author</p>
                  </CardContent>
                </Card>

                <Card className="bg-white text-black border-0 shadow-2xl max-w-lg mx-auto">
                  {/* Content Page */}
                  <CardContent className="p-12 min-h-[600px]">
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily }}>Chapter 1</h2>
                    <div
                      className="text-gray-800 leading-relaxed"
                      style={{
                        fontFamily,
                        fontSize: `${fontSize}pt`,
                        lineHeight: lineSpacing,
                      }}
                    >
                      {previewText.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-1">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Status */}
                <div className="bg-slate-900/50 border border-emerald-800/20 rounded-xl p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Ready for Amazon KDP</p>
                    <p className="text-xs text-slate-400">Your book is formatted and ready to upload</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
