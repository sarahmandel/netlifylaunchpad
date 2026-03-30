import { useState } from 'react'
import { ListChecks, Square, SquareCheckBig } from 'lucide-react'

type Step = { label: string }

export function ActivityChecklist({ title, description, steps, onComplete, completed }: {
  title: string
  description: string
  steps: Step[]
  onComplete: () => void
  completed: boolean
}) {
  const [checked, setChecked] = useState(steps.map(() => false))

  const toggle = (i: number) => {
    if (completed) return
    const next = [...checked]
    next[i] = !next[i]
    setChecked(next)
    if (next.every(Boolean)) onComplete()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-all text-left ${
              checked[i] || completed
                ? 'bg-accent border border-primary/30 text-accent-foreground'
                : 'bg-secondary/50 border border-border hover:bg-secondary text-secondary-foreground'
            }`}
          >
            {checked[i] || completed
              ? <SquareCheckBig className="h-4 w-4 text-primary shrink-0" />
              : <Square className="h-4 w-4 text-muted-foreground shrink-0" />
            }
            <span className={completed || checked[i] ? 'line-through opacity-70' : ''}>{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
