import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BookOpen, Copy, Check, Search, Code, Users, Zap, MessageSquare, FileText, Lightbulb } from 'lucide-react'

export const Route = createFileRoute('/prompts')({
  component: PromptLibrary,
})

type Prompt = {
  title: string
  description: string
  prompt: string
  category: string
  track: 'developer' | 'non-developer' | 'both'
}

const prompts: Prompt[] = [
  {
    title: 'Deploy Troubleshooting',
    description: 'Diagnose and fix common deployment failures.',
    prompt: 'I have a Netlify deployment that failed with the following error: [paste error]. Help me diagnose the issue, explain what caused it, and provide step-by-step instructions to fix it.',
    category: 'Debugging',
    track: 'developer',
  },
  {
    title: 'Netlify Functions Setup',
    description: 'Create serverless functions from scratch.',
    prompt: 'Help me create a Netlify Function that [describe purpose]. It should handle [HTTP method] requests, validate the input, and return a proper JSON response. Include error handling and TypeScript types.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Edge Functions Guide',
    description: 'Build performant edge functions.',
    prompt: 'I need to create a Netlify Edge Function that [describe use case - e.g., geolocation-based redirect, A/B testing, auth check]. Show me the code with proper TypeScript types, explain how it differs from regular serverless functions, and how to test it locally.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Build Plugin Creation',
    description: 'Create custom Netlify build plugins.',
    prompt: 'Guide me through creating a custom Netlify Build Plugin that [describe what it should do]. Include the plugin structure, event handlers, error handling, and how to test it locally before publishing.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Redirect Rules',
    description: 'Configure redirects and rewrites.',
    prompt: 'Help me set up Netlify redirect rules for the following scenarios: [list scenarios]. Explain the difference between redirects and rewrites, when to use _redirects file vs netlify.toml, and how to handle edge cases like trailing slashes and query parameters.',
    category: 'Configuration',
    track: 'both',
  },
  {
    title: 'Environment Variables Strategy',
    description: 'Organize environment variables across contexts.',
    prompt: 'Help me organize my Netlify environment variables for a project with [describe environments]. I need to understand deploy contexts, scoping variables to specific branches, and best practices for managing secrets across production, staging, and development.',
    category: 'Configuration',
    track: 'both',
  },
  {
    title: 'Team Onboarding Checklist',
    description: 'Create a checklist for new team members.',
    prompt: 'Create a comprehensive onboarding checklist for a new team member joining our Netlify-hosted project. Include account setup, permissions, key documentation to read, dashboard familiarization, and first-week tasks. Our project uses [describe stack].',
    category: 'Team Management',
    track: 'non-developer',
  },
  {
    title: 'Site Analytics Review',
    description: 'Interpret Netlify Analytics data.',
    prompt: 'Help me understand our Netlify Analytics dashboard. Explain what each metric means (page views, unique visitors, bandwidth, top sources), how to identify performance trends, and what actions to take based on common patterns.',
    category: 'Analytics',
    track: 'non-developer',
  },
  {
    title: 'Migration Planning',
    description: 'Plan a migration to Netlify.',
    prompt: 'We are migrating from [current platform] to Netlify. Our current setup includes [describe infrastructure]. Create a migration plan that covers: DNS transfer, build configuration, environment variables, redirects from old URLs, SSL certificates, and a rollback strategy.',
    category: 'Planning',
    track: 'both',
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize site performance on Netlify.',
    prompt: 'Review the performance of my Netlify-hosted site. Help me optimize: build times, asset caching headers, image optimization with Netlify Image CDN, code splitting strategy, and Core Web Vitals. My framework is [describe framework].',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Form Handling Setup',
    description: 'Set up Netlify Forms with notifications.',
    prompt: 'Help me set up Netlify Forms for a [contact/signup/feedback] form. Include the HTML markup with proper attributes, spam filtering with honeypot fields, form submission notifications (email and Slack), and how to access submissions via the Netlify API.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Branch Deploy Strategy',
    description: 'Set up branch-based deploy previews.',
    prompt: 'Help me set up a branch deploy strategy for our team. We need: production deploys from main, staging from a develop branch, and deploy previews for pull requests. Explain deploy contexts, branch subdomain configuration, and how to share preview URLs with stakeholders.',
    category: 'Configuration',
    track: 'both',
  },
  {
    title: 'Stakeholder Report',
    description: 'Create a platform status report.',
    prompt: 'Help me create a monthly stakeholder report for our Netlify-hosted projects. Include sections for: deployment frequency, build success rate, bandwidth usage, top pages, performance metrics, and upcoming changes. Format it as an executive summary.',
    category: 'Reporting',
    track: 'non-developer',
  },
  {
    title: 'Security Audit',
    description: 'Review security configuration.',
    prompt: 'Perform a security audit checklist for our Netlify site. Cover: HTTPS enforcement, security headers (CSP, HSTS, X-Frame-Options), environment variable hygiene, access control for deploy previews, API key management, and Netlify Identity configuration.',
    category: 'Security',
    track: 'both',
  },
]

const categories = Array.from(new Set(prompts.map(p => p.category)))

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
  Reporting: FileText,
  Security: Zap,
}

function PromptLibrary() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null)

  const filtered = prompts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCategory && p.category !== selectedCategory) return false
    if (selectedTrack && p.track !== selectedTrack && p.track !== 'both') return false
    return true
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Prompt Library</h1>
        </div>
        <p className="text-muted-foreground">Ready-to-use prompts for working with Netlify. Copy and customize for your needs.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
            All Tracks
          </button>
          <button
            onClick={() => setSelectedTrack('developer')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedTrack === 'developer' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Developer
          </button>
          <button
            onClick={() => setSelectedTrack('non-developer')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedTrack === 'non-developer' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Non-Developer
          </button>
          <span className="w-px bg-border mx-1" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
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
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
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
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      prompt.track === 'developer' ? 'bg-accent text-accent-foreground'
                      : prompt.track === 'non-developer' ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary/10 text-primary'
                    }`}>
                      {prompt.track === 'both' ? 'All Tracks' : prompt.track === 'developer' ? 'Developer' : 'Non-Developer'}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">
                      {prompt.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
                </div>
                <svg className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
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
        {filtered.length} prompt{filtered.length !== 1 ? 's' : ''} available. Replace [bracketed text] with your specific details.
      </p>
    </div>
  )
}
