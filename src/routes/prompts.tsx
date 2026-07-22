import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BookOpen, Copy, Check, Search, Code, Users, Zap, MessageSquare, FileText, Lightbulb, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/prompts')({
  component: PromptLibrary,
})

type Track = 'admin' | 'developer' | 'builder' | 'all'

type Prompt = {
  title: string
  description: string
  prompt: string
  category: string
  track: Track
}

const prompts: Prompt[] = [
  {
    title: 'Deploy Troubleshooting',
    description: 'Diagnose and fix a failed deploy.',
    prompt:
      'I have a Netlify deploy that failed with the following error: [paste error]. Help me diagnose the issue, explain what caused it, and give step-by-step instructions to fix it.',
    category: 'Debugging',
    track: 'developer',
  },
  {
    title: 'Netlify Functions Setup',
    description: 'Create a serverless function from scratch.',
    prompt:
      'Help me create a Netlify serverless Function that [describe purpose]. It should handle [HTTP method] requests, validate the input, and return a proper JSON response. Include error handling and TypeScript types.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Edge Function Guide',
    description: 'Build a performant edge function.',
    prompt:
      'I need a Netlify Edge Function that [describe use case — e.g., geolocation redirect, A/B test, request rewrite]. Show the code with TypeScript types, explain how it differs from a serverless function, and how to test it locally with netlify dev.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Choose a Storage Primitive',
    description: 'Decide between Netlify Database and Blobs.',
    prompt:
      'My feature needs to store [describe data]. Help me decide between Netlify Database (Postgres) and Netlify Blobs, explain the trade-offs, and outline how I would read and write the data from a serverless function.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Redirect & Rewrite Rules',
    description: 'Configure redirects and rewrites.',
    prompt:
      'Help me set up Netlify redirect rules for these scenarios: [list scenarios]. Explain the difference between redirects and rewrites, when to use a _redirects file vs netlify.toml, and how to handle trailing slashes and query parameters.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Environment Variables Strategy',
    description: 'Organize variables across deploy contexts.',
    prompt:
      'Help me organize Netlify environment variables for a project with [describe environments]. Cover deploy contexts, scoping variables to specific contexts, and best practices for keeping secrets out of the repository.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Branch Deploy Strategy',
    description: 'Set up contexts and preview workflow.',
    prompt:
      'Help me design a branch and deploy-context strategy: production from main, a staging branch deploy, and Deploy Previews for pull requests. Explain deploy contexts, branch subdomains, and how to share preview URLs with reviewers.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Form Handling Setup',
    description: 'Set up Netlify Forms with spam filtering.',
    prompt:
      'Help me set up a Netlify [contact/signup/feedback] form. Include the HTML markup with the right attributes, honeypot plus an additional spam filter, email/Slack notifications, and how to view submissions.',
    category: 'Development',
    track: 'builder',
  },
  {
    title: 'Performance Optimization',
    description: 'Tune caching, images, and Core Web Vitals.',
    prompt:
      'Review my Netlify site performance. Help me optimize build time, Cache-Control headers and cache key variations, image delivery with Netlify Image CDN, and Core Web Vitals. My framework is [describe framework].',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Access Control & Security Audit',
    description: 'Review site and team access controls.',
    prompt:
      'Perform a security review for our Netlify setup. Cover: HTTPS/HSTS, security headers and Content Security Policy, password protection / basic auth for non-production deploys, role-based access control, environment variable and secret hygiene, and secret scanning.',
    category: 'Security',
    track: 'admin',
  },
  {
    title: 'SSO & Team Governance Plan',
    description: 'Plan SSO, roles, and provisioning.',
    prompt:
      'Help me plan team governance for Netlify. Cover SAML single sign-on, enforced two-factor authentication, Directory Sync (SCIM) for provisioning, least-privilege role assignment, keeping a backup Team Owner, and reviewing the team audit log.',
    category: 'Team Management',
    track: 'admin',
  },
  {
    title: 'Secret Rotation Runbook',
    description: 'Define a process to rotate compromised secrets.',
    prompt:
      'Write a runbook for rotating a compromised secret on Netlify. Include using the Secrets Controller, generating unique secrets per site, updating environment variables via UI/CLI/API, triggering a redeploy, and confirming secret scanning is clean.',
    category: 'Security',
    track: 'admin',
  },
  {
    title: 'Team Onboarding Checklist',
    description: 'Onboard a new team member.',
    prompt:
      'Create an onboarding checklist for a new member of our Netlify team. Include account setup, 2FA, role/permission assignment, key docs to read, dashboard familiarization, and first-week tasks. Our project uses [describe stack].',
    category: 'Team Management',
    track: 'builder',
  },
  {
    title: 'Analytics & Performance Review',
    description: 'Interpret analytics and RUM data.',
    prompt:
      'Help me read our Netlify Web Analytics and Real User Monitoring data. Explain the key metrics, how to spot performance and traffic trends, and what actions to take from common patterns.',
    category: 'Analytics',
    track: 'builder',
  },
  {
    title: 'Migration Planning',
    description: 'Plan a migration to Netlify.',
    prompt:
      'We are migrating from [current platform] to Netlify. Our setup includes [describe infrastructure]. Create a migration plan covering DNS, build configuration, environment variables, redirects from old URLs, HTTPS certificates, and a rollback strategy.',
    category: 'Planning',
    track: 'all',
  },
]

const categories = Array.from(new Set(prompts.map((p) => p.category)))

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

const trackLabels: Record<Track, string> = {
  admin: 'Admin',
  developer: 'Developer',
  builder: 'Internal Builder',
  all: 'All Roles',
}

function PromptLibrary() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null)

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
            <div key={i} className="rounded-lg border border-border bg-card overflow-hidden transition-all">
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
