import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, CircleCheck, Layers, ShieldCheck, Rocket } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { corePath, roles, sectionOrder, type Role } from '@/lib/curriculum'

export const Route = createFileRoute('/roles')({
  component: RoleGate,
})

const roleIcon: Record<Role, typeof Layers> = {
  admin: ShieldCheck,
  developer: Layers,
  builder: Rocket,
}

/**
 * The role gate is a single decision: which role are you? Everything else in the
 * app — the sidebar, the concept path, the progress bar — is scoped to that
 * answer, so nothing else is shown until it is made.
 */
function RoleGate() {
  const { role, setRole, isModuleComplete } = useOnboarding()
  const navigate = useNavigate()

  const choose = (next: Role) => {
    setRole(next)
    navigate({ to: '/path/$roleId', params: { roleId: next } })
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col justify-center space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-teal sm:text-4xl">Netlify Platform Onboarding</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Choose your role to get a guided path through the concepts, best practices, and trainings that matter for the
          work you actually do.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((r) => {
          const Icon = roleIcon[r.id]
          const steps = corePath(r.id)
          const done = steps.filter((m) => isModuleComplete(m.id)).length
          const active = role === r.id
          const sections = sectionOrder.filter((s) => steps.some((m) => m.section === s))
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => choose(r.id)}
              className={`group relative flex flex-col rounded-xl border p-6 text-left transition-all hover:shadow-lg ${
                active
                  ? 'border-primary bg-accent/60 ring-2 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {active && <CircleCheck className="absolute right-4 top-4 h-5 w-5 text-primary" />}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg gradient-teal text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{r.label}</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{r.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {sections.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">
                  {steps.length} core concepts{done > 0 && ` · ${done} done`}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  {active ? 'Continue' : 'Choose'} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You can switch roles at any time — your progress on each concept is kept.
      </p>
    </div>
  )
}
