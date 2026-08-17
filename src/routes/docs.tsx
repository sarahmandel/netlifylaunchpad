import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, ExternalLink, Search, Bot } from 'lucide-react'
import { useDocsAssistant } from '@/components/DocsAssistant'
import { allDocs, filterDocs } from '@/lib/docs-library'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

function DocsPage() {
  const [query, setQuery] = useState('')
  const { openAssistant } = useDocsAssistant()
  const groups = useMemo(() => filterDocs(query), [query])
  const matches = groups.reduce((n, g) => n + g.entries.length, 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Resources</span>
        </div>
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Every official Netlify doc this onboarding references, in one place — and an assistant that answers questions
          from them.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">Ask the docs assistant</h2>
            <p className="text-sm text-muted-foreground mt-1">
              The chat bubble in the bottom-right corner answers from the {allDocs.length} pages below and cites its
              sources. It follows you across every page of the onboarding.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAssistant()}
            className="inline-flex items-center gap-2 rounded-lg gradient-teal text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <Bot className="h-4 w-4" /> Open the assistant
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-semibold">Docs library</h2>
          <span className="text-xs text-muted-foreground">
            {matches} of {allDocs.length} pages
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documentation…"
            aria-label="Filter documentation"
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No documentation matches “{query}”. Try asking the assistant instead.
          </p>
        )}

        {groups.map((group) => (
          <div key={group.section} className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="font-semibold">{group.label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{group.blurb}</p>
            </div>
            <ul className="space-y-3">
              {group.entries.map((entry) => (
                <li key={entry.url} className="flex flex-col gap-1">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    {entry.label}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground">
                    <span>Covered in</span>
                    {entry.modules.map((m) => (
                      <Link
                        key={m.id}
                        to="/module/$moduleId"
                        params={{ moduleId: m.id }}
                        className="rounded bg-secondary px-1.5 py-0.5 hover:text-foreground transition-colors"
                      >
                        {m.title}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
