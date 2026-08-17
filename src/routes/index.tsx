import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Clock, ArrowRight, CircleCheck, LoaderCircle, BookOpen, MessageSquare, Bot } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { useDocsAssistant } from '@/components/DocsAssistant'
import {
  modules,
  roles,
  sectionOrder,
  sectionMeta,
  priorityLabel,
  priorityRank,
  type Role,
} from '@/lib/curriculum'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function RoleSelector({ role, onSelect }: { role: Role | null; onSelect: (r: Role) => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Choose your role</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Every module is available to everyone. Your role highlights what is core, recommended, or optional for you.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {roles.map((r) => {
          const active = role === r.id
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`group relative rounded-lg border p-5 text-left transition-all hover:shadow-md ${
                active ? 'border-primary bg-accent/60 ring-2 ring-primary/30' : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <h3 className="font-semibold">{r.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.blurb}</p>
              <span className="inline-block text-[11px] text-primary mt-2 font-medium">{r.est}</span>
              {active && <CircleCheck className="absolute top-3 right-3 h-5 w-5 text-primary" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PriorityBadge({ role, moduleId }: { role: Role; moduleId: string }) {
  const mod = modules.find((m) => m.id === moduleId)!
  const p = mod.priority[role]
  const styles: Record<string, string> = {
    core: 'bg-primary/15 text-primary border-primary/20',
    recommended: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    optional: 'bg-secondary text-muted-foreground border-border',
  }
  return (
    <span className={`text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded border ${styles[p]}`}>
      {priorityLabel[p]}
    </span>
  )
}

function Dashboard() {
  const { role, setRole, isModuleComplete, moduleState, getProgress, completedCount, totalCount } = useOnboarding()
  const navigate = useNavigate()
  const { openAssistant } = useDocsAssistant()
  const progress = getProgress()

  const status = (id: string) => {
    if (isModuleComplete(id)) return 'complete'
    const s = moduleState[id]
    if (s && (s.quizPassed || s.checklistCompleted)) return 'in-progress'
    return 'not-started'
  }

  // Order modules so the selected role's core items come first within each section.
  const orderedFor = (list: typeof modules) =>
    role ? [...list].sort((a, b) => priorityRank[a.priority[role]] - priorityRank[b.priority[role]]) : list

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient-teal">Netlify Platform Onboarding</h1>
        <p className="text-muted-foreground mt-1">
          A guided path through the Netlify platform — Create, Ship, Scale, and Secure — with best practices for admins,
          developers, and internal builders.
        </p>
      </div>

      <RoleSelector role={role} onSelect={setRole} />

      <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Overall progress</span>
            <span className="font-mono text-primary font-semibold">
              {completedCount()}/{totalCount()} modules
            </span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-teal rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Complete a module by passing its check and finishing its activities.</span>
      </div>

      {sectionOrder.map((section) => {
        const list = orderedFor(modules.filter((m) => m.section === section))
        return (
          <section key={section} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{sectionMeta[section].label}</h2>
              <p className="text-sm text-muted-foreground">{sectionMeta[section].blurb}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((m) => {
                const st = status(m.id)
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => navigate({ to: '/module/$moduleId', params: { moduleId: m.id } })}
                    className={`group relative rounded-lg border p-5 text-left transition-all hover:shadow-md ${
                      st === 'complete'
                        ? 'border-primary/40 bg-accent/60'
                        : st === 'in-progress'
                          ? 'border-primary/20 bg-card hover:border-primary/40'
                          : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${
                          st === 'complete' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{m.title}</h3>
                          {st === 'complete' && <CircleCheck className="h-3.5 w-3.5 text-primary" />}
                          {st === 'in-progress' && <LoaderCircle className="h-3.5 w-3.5 text-primary" />}
                          {role && <PriorityBadge role={role} moduleId={m.id} />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.tagline}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {m.time}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Keep learning</h2>
        <p className="text-sm text-muted-foreground">Official Netlify resources to go deeper as you build.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/docs"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Docs library</p>
              <p className="text-xs text-muted-foreground">Every doc this onboarding links to</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => openAssistant()}
            className="flex items-center gap-3 rounded-lg border border-border p-4 text-left hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Docs assistant</p>
              <p className="text-xs text-muted-foreground">Ask a question, get sourced answers</p>
            </div>
          </button>
          <a
            href="https://docs.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary text-muted-foreground shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Netlify Docs</p>
              <p className="text-xs text-muted-foreground">Full documentation</p>
            </div>
          </a>
          <a
            href="https://answers.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary text-muted-foreground shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Support Forums</p>
              <p className="text-xs text-muted-foreground">Ask the community</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
