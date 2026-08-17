import { createFileRoute, useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Bot,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Target,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { KnowledgeCheck } from '@/components/KnowledgeCheck'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { useDocsAssistant } from '@/components/DocsAssistant'
import { getModule, modules, roles, priorityLabel } from '@/lib/curriculum'

export const Route = createFileRoute('/module/$moduleId')({
  component: ModulePage,
})

function ModulePage() {
  const { moduleId } = useParams({ from: '/module/$moduleId' })
  const mod = getModule(moduleId)
  const { role, moduleState, passQuiz, completeChecklist, isModuleComplete } = useOnboarding()
  const { openAssistant } = useDocsAssistant()
  const navigate = useNavigate()

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Module not found</h1>
        <Link to="/" className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const Icon = mod.icon
  const state = moduleState[mod.id]
  const complete = isModuleComplete(mod.id)

  const idx = modules.findIndex((m) => m.id === mod.id)
  const next = modules[idx + 1]
  const prev = modules[idx - 1]

  const roleFocus = role ? mod.roleFocus[role] : null
  const rolePriority = role ? mod.priority[role] : null
  const roleLabel = role ? roles.find((r) => r.id === role)?.label : null

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{mod.section}</span>
            {complete && (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Complete
              </span>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold">{mod.title}</h1>
        <p className="text-muted-foreground mt-1">{mod.overview}</p>
      </div>

      {roleFocus && (
        <div className="rounded-lg border border-primary/20 bg-accent/50 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-sm font-semibold">
              For your role: {roleLabel}
              {rolePriority && (
                <span className="ml-2 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                  {priorityLabel[rolePriority]}
                </span>
              )}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">{roleFocus}</p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary shrink-0" /> Key concepts
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {mod.concepts.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary shrink-0">→</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> Best practices
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {mod.bestPractices.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary shrink-0">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary shrink-0" /> Documentation
          </h2>
          <button
            type="button"
            onClick={() => openAssistant({ moduleId: mod.id })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-primary" /> Ask about these docs
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Read these official Netlify docs before completing the activities.</p>
        <ul className="space-y-2 text-sm">
          {mod.docs.map((d, i) => (
            <li key={i}>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {d.label}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <KnowledgeCheck questions={mod.quiz} onPass={() => passQuiz(mod.id)} passed={!!state?.quizPassed} />

      <ActivityChecklist
        title="Hands-on activities"
        description="Work through these steps in your own Netlify project to put the module into practice."
        steps={mod.checklist.map((label) => ({ label }))}
        onComplete={() => completeChecklist(mod.id)}
        completed={!!state?.checklistCompleted}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <button
            onClick={() => navigate({ to: '/module/$moduleId', params: { moduleId: prev.id } })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {prev.title}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            onClick={() => navigate({ to: '/module/$moduleId', params: { moduleId: next.id } })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {next.title} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
