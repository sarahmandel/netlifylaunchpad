import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Play,
  RotateCcw,
  Target,
  Users,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { PathGraph } from '@/components/PathGraph'
import {
  corePath,
  getModule,
  getRoleMeta,
  isRole,
  modulesByPriority,
  rolePaths,
  type Role,
} from '@/lib/curriculum'

export const Route = createFileRoute('/path/$roleId')({
  component: PathOverview,
})

function PathOverview() {
  const { roleId } = useParams({ from: '/path/$roleId' })
  const navigate = useNavigate()
  const { role, setRole, isModuleComplete } = useOnboarding()

  const valid = isRole(roleId)
  const pathRole = (valid ? roleId : null) as Role | null

  // The URL is the source of truth for which path is being viewed, so keep the
  // stored role (which drives the sidebar) in step with it.
  useEffect(() => {
    if (pathRole && role !== pathRole) setRole(pathRole)
  }, [pathRole, role, setRole])

  const steps = pathRole ? corePath(pathRole) : []
  const [selectedId, setSelectedId] = useState<string | null>(steps[0]?.id ?? null)

  useEffect(() => {
    setSelectedId(steps[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId])

  if (!pathRole) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 animate-fade-in">
        <h1 className="text-2xl font-bold">Unknown role</h1>
        <p className="text-muted-foreground">Choose a role to see its onboarding path.</p>
        <Link to="/" className="rounded-lg gradient-teal px-4 py-2 font-semibold text-primary-foreground">
          Choose your role
        </Link>
      </div>
    )
  }

  const path = rolePaths[pathRole]
  const meta = getRoleMeta(pathRole)
  const selected = selectedId ? getModule(selectedId) : null
  const first = steps[0]
  const resumeAt = steps.find((m) => !isModuleComplete(m.id))
  const done = steps.filter((m) => isModuleComplete(m.id)).length
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0
  const recommended = modulesByPriority(pathRole, 'recommended')

  const open = (moduleId: string) => navigate({ to: '/module/$moduleId', params: { moduleId } })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <Users className="h-3 w-3 shrink-0" /> {meta.label}
          </span>
          <Link to="/" className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground">
            Change role
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gradient-teal">{path.headline}</h1>
        <p className="mt-2 text-muted-foreground">{path.summary}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Your path</span>
            <span className="font-mono font-semibold text-primary">
              {done}/{steps.length} concepts
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full gradient-teal rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {resumeAt && done > 0 && (
            <button
              type="button"
              onClick={() => open(resumeAt.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> Resume
            </button>
          )}
          {first && (
            <button
              type="button"
              onClick={() => open(first.id)}
              className="inline-flex items-center gap-2 rounded-lg gradient-teal px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Start
            </button>
          )}
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5 shrink-0 text-primary" /> What you'll be able to do
        </h2>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {path.outcomes.map((o) => (
            <li key={o} className="flex gap-2">
              <span className="shrink-0 text-primary">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Key concepts for your role</h2>
            <p className="text-sm text-muted-foreground">
              Every concept on your path, in the order to take them — grouped by the platform stage it belongs to.
              Select a node to see its best practices.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> Done
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border border-border bg-secondary" /> Not started
            </span>
          </div>
        </div>

        <div className="pt-2">
          <PathGraph
            role={pathRole}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isComplete={isModuleComplete}
          />
        </div>

        {first && (
          <div className="flex justify-center border-t border-border pt-6">
            <button
              type="button"
              onClick={() => open(first.id)}
              className="inline-flex items-center gap-2 rounded-lg gradient-teal px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Start
              <span className="text-primary-foreground/80">· {first.title}</span>
            </button>
          </div>
        )}
      </section>

      {selected && (
        <section className="space-y-5 rounded-lg border border-primary/20 bg-accent/40 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-teal text-primary-foreground">
                <selected.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {selected.section} · Concept {steps.findIndex((s) => s.id === selected.id) + 1} of {steps.length}
                </p>
                <h2 className="text-lg font-semibold">{selected.title}</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => open(selected.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/20"
            >
              Open concept <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">{selected.roleFocus[pathRole]}</p>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 shrink-0 text-primary" /> Key concepts
              </h3>
              <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                {selected.concepts.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="shrink-0 text-primary">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Best practices
              </h3>
              <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                {selected.bestPractices.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="shrink-0 text-primary">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="space-y-3 rounded-lg border border-border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Recommended after your path</h2>
            <p className="text-sm text-muted-foreground">
              Not required for your role, but the natural next step. These live under Recommended in the sidebar.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommended.map((m) => (
              <Link
                key={m.id}
                to="/module/$moduleId"
                params={{ moduleId: m.id }}
                className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <m.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Everything else lives in Resources</p>
              <p className="text-xs text-muted-foreground">
                Optional courses for your role, the docs library, checklists, and the prompt library.
              </p>
            </div>
          </div>
          <Link
            to="/docs"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Open Resources <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
