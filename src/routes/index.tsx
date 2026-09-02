import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  Network,
  Search,
  Sparkles,
} from 'lucide-react'
import { AskAnything } from '@/components/AskAnything'
import { useOnboarding } from '@/context/OnboardingContext'
import { roles } from '@/lib/curriculum'
import { searchRecords } from '@/lib/search-index'

export const Route = createFileRoute('/')({
  component: Home,
})

/**
 * The home page is the app's front door — reached from anywhere by clicking the
 * Netlify mark in the top left. It leads with a question box rather than a
 * navigation tree: the onboarding already indexes every module, doc link,
 * prompt, and checklist item for the command palette, so asking is a faster way
 * in than browsing. The guided role path is one click away underneath.
 */
function Home() {
  const { role, getProgress } = useOnboarding()
  const chosenRole = roles.find((r) => r.id === role)
  const progress = role ? getProgress() : 0

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Netlify Platform Onboarding
        </span>
        <h1 className="text-3xl font-bold text-gradient-teal sm:text-4xl">Ask this onboarding anything</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Every concept, best practice, documentation link, prompt, and checklist item in this app is indexed —{' '}
          {searchRecords.length} records in all. Ask a question and the index finds the relevant ones, then answers from
          them and shows you exactly what it used.
        </p>
      </header>

      <AskAnything />

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Or take the guided route
        </h2>

        {chosenRole ? (
          <Link
            to="/path/$roleId"
            params={{ roleId: chosenRole.id }}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg gradient-teal text-primary-foreground">
              <Network className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Continue the {chosenRole.label} path</p>
              <p className="text-sm text-muted-foreground">
                {progress}% complete · {chosenRole.est}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ) : (
          <Link
            to="/roles"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg gradient-teal text-primary-foreground">
              <Network className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Choose your role</p>
              <p className="text-sm text-muted-foreground">
                Get a sequenced path through the concepts that matter for admins, developers, or internal builders.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink to="/docs" icon={BookOpen} label="Documentation" note="Every doc this onboarding links to" />
          <QuickLink to="/checklist" icon={ClipboardCheck} label="Checklists" note="Production launch and security" />
          <QuickLink to="/prompts" icon={MessageSquare} label="Prompt Library" note="Prompts for Netlify and agents" />
        </div>
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Search className="h-3 w-3" /> Looking for a specific page? Press{' '}
        <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd> to jump straight to it.
      </p>
    </div>
  )
}

function QuickLink({
  to,
  icon: Icon,
  label,
  note,
}: {
  to: '/docs' | '/checklist' | '/prompts'
  icon: typeof BookOpen
  label: string
  note: string
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
    </Link>
  )
}
