import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BookOpen, Copy, Check, Search, Code, Users, Zap, MessageSquare, FileText, Lightbulb, ShieldCheck } from 'lucide-react'
import { prompts, promptCategories as categories, trackLabels, type Track } from '@/lib/prompts'
import { slug, flashElement } from '@/lib/search-index'

export const Route = createFileRoute('/prompts')({
  component: PromptLibrary,
})

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-secondary hover:bg-secondary/80 transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Debugging: Zap,
  Development: Code,
  Configuration: FileText,
  'Team Management': Users,
  Analytics: Lightbulb,
  Planning: FileText,
  Security: ShieldCheck,
}

function PromptLibrary() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null)
  const hash = useRouterState({ select: (s) => s.location.hash })

  const filtered = prompts.filter((p) => {
    if (
      search &&
      !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase())
    )
      return false
    if (selectedCategory && p.category !== selectedCategory) return false
    if (selectedTrack && p.track !== selectedTrack && p.track !== 'all') return false
    return true
  })

  // When arrived at via the global search (e.g. #prompt-deploy-troubleshooting),
  // clear any filters, expand the matching prompt, and flash it into view.
  useEffect(() => {
    if (!hash || !hash.startsWith('prompt-')) return
    const targetSlug = hash.slice('prompt-'.length)
    const idx = prompts.findIndex((p) => slug(p.title) === targetSlug)
    if (idx === -1) return
    setSearch('')
    setSelectedCategory(null)
    setSelectedTrack(null)
    setExpandedPrompt(idx)
    flashElement(`prompt-${targetSlug}`)
  }, [hash])

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Prompt Library</h1>
        </div>
        <p className="text-muted-foreground">
          Ready-to-use prompts for working with Netlify and AI agents. Copy one and replace the [bracketed] details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTrack(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedTrack ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Roles
          </button>
          {(['admin', 'developer', 'builder'] as Track[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTrack === t ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {trackLabels[t]}
            </button>
          ))}
          <span className="w-px bg-border mx-1" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No prompts match your filters.</p>
          </div>
        )}
        {filtered.map((prompt, i) => {
          const Icon = categoryIcons[prompt.category] || FileText
          const isExpanded = expandedPrompt === i
          return (
            <div key={i} id={`prompt-${slug(prompt.title)}`} className="rounded-lg border border-border bg-card overflow-hidden transition-all">
              <button
                onClick={() => setExpandedPrompt(isExpanded ? null : i)}
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary text-muted-foreground shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{prompt.title}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                      {trackLabels[prompt.track]}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">
                      {prompt.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
                </div>
                <svg
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                  <pre className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed">
                    {prompt.prompt}
                  </pre>
                  <div className="flex justify-end">
                    <CopyButton text={prompt.prompt} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {filtered.length} prompt{filtered.length !== 1 ? 's' : ''} available. Replace [bracketed text] with your details.
      </p>
    </div>
  )
}
