import { createFileRoute, useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Bot,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Clock,
  CreditCard,
  Layers,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { KnowledgeCheck } from '@/components/KnowledgeCheck'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { useDocsAssistant } from '@/components/DocsAssistant'
import { getLesson, getModule, lessonKey } from '@/lib/curriculum'

// The trailing underscore on `$moduleId_` opts this route out of nesting under
// the module route, so the module landing page does not need an <Outlet />: a
// subsection is a sibling page with its own full layout.
export const Route = createFileRoute('/module/$moduleId_/$lessonId')({
  component: LessonPage,
})

function LessonPage() {
  const { moduleId, lessonId } = useParams({ from: '/module/$moduleId_/$lessonId' })
  const mod = getModule(moduleId)
  const lesson = getLesson(moduleId, lessonId)
  const { moduleState, passQuiz, completeChecklist } = useOnboarding()
  const { openAssistant } = useDocsAssistant()
  const navigate = useNavigate()

  if (!mod || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center">
        <h1 className="text-2xl font-bold mb-2">Subsection not found</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This subsection does not exist{mod ? ` in ${mod.title}` : ''}.
        </p>
        {mod ? (
          <Link
            to="/module/$moduleId"
            params={{ moduleId: mod.id }}
            className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold"
          >
            Back to {mod.title}
          </Link>
        ) : (
          <Link to="/" className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold">
            Back to home
          </Link>
        )}
      </div>
    )
  }

  const Icon = lesson.icon
  // Lesson progress shares the module progress record, keyed `moduleId/lessonId`.
  const key = lessonKey(mod.id, lesson.id)
  const state = moduleState[key]
  const complete = !!state?.quizPassed && !!state?.checklistCompleted

  const siblings = mod.lessons ?? []
  const idx = siblings.findIndex((l) => l.id === lesson.id)
  const prev = idx > 0 ? siblings[idx - 1] : undefined
  const next = idx !== -1 ? siblings[idx + 1] : undefined

  return (
    <div className="space-y-8 animate-fade-in">
      <Link
        to="/module/$moduleId"
        params={{ moduleId: mod.id }}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        Back to {mod.title}
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {mod.title}
              {idx !== -1 && ` · Subsection ${idx + 1} of ${siblings.length}`}
            </span>
            {lesson.addOn && (
              <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/15 text-amber-400">
                {lesson.addOn.label}
              </span>
            )}
            {complete && (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Complete
              </span>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <p className="text-sm text-primary/90 mt-0.5">{lesson.tagline}</p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" /> {lesson.time}
          </span>
          {lesson.group && (
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3 w-3 shrink-0" /> {lesson.group}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-3">{lesson.overview}</p>
      </div>

      {lesson.addOn && (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
            <h2 className="text-sm font-semibold">{lesson.addOn.label} — not included on every plan</h2>
          </div>
          <p className="text-sm text-muted-foreground">{lesson.addOn.note}</p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary shrink-0" /> Key concepts
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {lesson.concepts.map((c, i) => (
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
          {lesson.bestPractices.map((b, i) => (
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
            onClick={() => openAssistant({ moduleId: key })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-primary" /> Ask about these docs
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Read these official Netlify docs before completing the activities.
        </p>
        <ul className="space-y-2 text-sm">
          {lesson.docs.map((d, i) => (
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

      <KnowledgeCheck questions={lesson.quiz} onPass={() => passQuiz(key)} passed={!!state?.quizPassed} />

      <ActivityChecklist
        title="Hands-on activities"
        description="Work through these steps in your own Netlify project to put this subsection into practice."
        steps={lesson.checklist.map((label) => ({ label }))}
        onComplete={() => completeChecklist(key)}
        completed={!!state?.checklistCompleted}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <button
            onClick={() =>
              navigate({ to: '/module/$moduleId/$lessonId', params: { moduleId: mod.id, lessonId: prev.id } })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {prev.title}
          </button>
        ) : (
          <Link
            to="/module/$moduleId"
            params={{ moduleId: mod.id }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Layers className="h-4 w-4" /> Section overview
          </Link>
        )}
        {next ? (
          <button
            onClick={() =>
              navigate({ to: '/module/$moduleId/$lessonId', params: { moduleId: mod.id, lessonId: next.id } })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {next.title} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to="/module/$moduleId"
            params={{ moduleId: mod.id }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Finish {mod.title} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
