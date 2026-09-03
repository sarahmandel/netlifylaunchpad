import { createFileRoute, useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Bot,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Flag,
  Network,
  Target,
  CreditCard,
  Circle,
  Clock,
  Compass,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { KnowledgeCheck } from '@/components/KnowledgeCheck'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { useDocsAssistant } from '@/components/DocsAssistant'
import { corePath, getModule, groupedLessons, roles, priorityLabel, type Role } from '@/lib/curriculum'

export const Route = createFileRoute('/module/$moduleId')({
  component: ModulePage,
})

/**
 * Where "back" goes depends on whether a role has been chosen. A module can be
 * opened directly — from the command palette, from a citation on the home page,
 * or from a shared link — and in that state there is no path to return to yet,
 * so the link offers to pick one instead of going nowhere.
 */
function PathLink({
  role,
  className,
  children,
}: {
  role: Role | null
  className: string
  children: React.ReactNode
}) {
  if (!role) {
    return (
      <Link to="/roles" className={className}>
        {children}
      </Link>
    )
  }
  return (
    <Link to="/path/$roleId" params={{ roleId: role }} className={className}>
      {children}
    </Link>
  )
}

function ModulePage() {
  const { moduleId } = useParams({ from: '/module/$moduleId' })
  const mod = getModule(moduleId)
  const { role, moduleState, passQuiz, completeChecklist, isModuleComplete, isLessonComplete, lessonProgress } =
    useOnboarding()
  const { openAssistant } = useDocsAssistant()
  const navigate = useNavigate()

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Module not found</h1>
        <Link to="/" className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold">
          Back to home
        </Link>
      </div>
    )
  }

  const Icon = mod.icon
  const state = moduleState[mod.id]
  const complete = isModuleComplete(mod.id)

  // Navigation follows the selected role's path, not the raw curriculum order,
  // so "next" is always the next concept in this trainee's guided sequence.
  const steps = role ? corePath(role) : []
  const idx = steps.findIndex((m) => m.id === mod.id)
  const onPath = idx !== -1
  const next = onPath ? steps[idx + 1] : undefined
  const prev = onPath ? steps[idx - 1] : undefined

  const roleFocus = role ? mod.roleFocus[role] : null
  const rolePriority = role ? mod.priority[role] : null
  const roleLabel = role ? roles.find((r) => r.id === role)?.label : null

  // A module with subsections does not teach the material itself — this page
  // becomes a landing page that frames the section and routes into it, and the
  // knowledge check and activities live on the individual lesson pages.
  const lessons = mod.lessons ?? []
  const hasLessons = lessons.length > 0
  const groups = groupedLessons(mod)
  const lessonsDone = lessonProgress(mod.id)
  const nextLesson = lessons.find((l) => !isLessonComplete(mod.id, l.id)) ?? lessons[0]
  let lessonNumber = 0

  return (
    <div className="space-y-8 animate-fade-in">
      <PathLink
        role={role}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        {role ? 'Back to your path' : 'Choose your role to get a path'}
      </PathLink>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {mod.section}
              {onPath && ` · Concept ${idx + 1} of ${steps.length}`}
            </span>
            {mod.addOn && (
              <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/15 text-amber-400">
                {mod.addOn.label}
              </span>
            )}
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

      {mod.addOn && (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
            <h2 className="text-sm font-semibold">{mod.addOn.label} feature — not included on every plan</h2>
          </div>
          <p className="text-sm text-muted-foreground">{mod.addOn.note}</p>
        </div>
      )}

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

      {hasLessons && (
        <section className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-accent/50 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary shrink-0" /> In this section
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {lessons.length} subsections, each with its own knowledge check and activities —{' '}
                  <span className="text-foreground font-medium">
                    {lessonsDone.done} of {lessonsDone.total} complete
                  </span>
                  . Work through them in any order.
                </p>
              </div>
              {nextLesson && (
                <Link
                  to="/module/$moduleId/$lessonId"
                  params={{ moduleId: mod.id, lessonId: nextLesson.id }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
                >
                  {lessonsDone.done === 0
                    ? 'Start first subsection'
                    : lessonsDone.done === lessonsDone.total
                      ? 'Review subsections'
                      : 'Continue'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {groups.map((group, gi) => (
            <div key={group.label ?? `group-${gi}`} className="space-y-3">
              {group.label && (
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pt-2">
                  {group.label}
                </p>
              )}
              {group.lessons.map((lesson) => {
                const LessonIcon = lesson.icon
                const done = isLessonComplete(mod.id, lesson.id)
                lessonNumber += 1
                return (
                  <Link
                    key={lesson.id}
                    to="/module/$moduleId/$lessonId"
                    params={{ moduleId: mod.id, lessonId: lesson.id }}
                    className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0">
                        <LessonIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {lessonNumber} / {lessons.length}
                          </span>
                          <h3 className="text-sm font-semibold truncate">{lesson.title}</h3>
                          {lesson.addOn && (
                            <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/15 text-amber-400">
                              {lesson.addOn.label}
                            </span>
                          )}
                          {done ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium ml-auto shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                            </span>
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground/50 ml-auto shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.summary}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" /> {lesson.time}
                          </span>
                          <span>{lesson.concepts.length} concepts</span>
                          <span>{lesson.docs.length} docs</span>
                          <span className="ml-auto inline-flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Open <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </section>
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

      {mod.furtherTopics && mod.furtherTopics.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary shrink-0" /> Also worth knowing
          </h2>
          <p className="text-sm text-muted-foreground">
            Adjacent to this section rather than part of it — read these when they apply to you.
          </p>
          <ul className="space-y-3">
            {mod.furtherTopics.map((topic) => {
              const TopicIcon = topic.icon
              return (
                <li key={topic.url} className="flex gap-3">
                  <div className="flex items-center justify-center h-7 w-7 rounded-md bg-secondary text-muted-foreground shrink-0 mt-0.5">
                    <TopicIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <a
                      href={topic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {topic.title}
                      <ArrowUpRight className="h-3 w-3 shrink-0" />
                    </a>
                    <p className="text-sm text-muted-foreground mt-0.5">{topic.note}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

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
        <p className="text-sm text-muted-foreground">
          {hasLessons
            ? 'Section-level reading. Each subsection lists its own documentation as well.'
            : 'Read these official Netlify docs before completing the activities.'}
        </p>
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

      {mod.quiz && mod.quiz.length > 0 && (
        <KnowledgeCheck questions={mod.quiz} onPass={() => passQuiz(mod.id)} passed={!!state?.quizPassed} />
      )}

      {mod.checklist && mod.checklist.length > 0 && (
        <ActivityChecklist
          title="Hands-on activities"
          description="Work through these steps in your own Netlify project to put the module into practice."
          steps={mod.checklist.map((label) => ({ label }))}
          onComplete={() => completeChecklist(mod.id)}
          completed={!!state?.checklistCompleted}
        />
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <button
            onClick={() => navigate({ to: '/module/$moduleId', params: { moduleId: prev.id } })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {prev.title}
          </button>
        ) : (
          <PathLink
            role={role}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Network className="h-4 w-4" /> {role ? 'Path overview' : 'Choose your role'}
          </PathLink>
        )}
        {next ? (
          <button
            onClick={() => navigate({ to: '/module/$moduleId', params: { moduleId: next.id } })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {next.title} <ArrowRight className="h-4 w-4" />
          </button>
        ) : onPath ? (
          <PathLink
            role={role}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Flag className="h-4 w-4" /> Finish path
          </PathLink>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
