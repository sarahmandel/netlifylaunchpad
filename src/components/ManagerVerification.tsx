import { CircleCheck, Lock } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

export function ManagerVerification({ stage }: { stage: number }) {
  const { stages, toggleManagerVerification } = useOnboarding()
  const s = stages[stage]
  const unlocked = s.quizPassed && s.activityCompleted
  const verified = s.managerVerified

  return (
    <div className={`rounded-lg border p-5 transition-all ${
      verified ? 'border-primary bg-accent glow-teal'
      : unlocked ? 'border-border bg-card hover:border-primary/50'
      : 'border-border bg-muted/30 opacity-60'
    }`}>
      <button
        onClick={() => unlocked && toggleManagerVerification(stage)}
        disabled={!unlocked}
        className="w-full flex items-center gap-3 text-left"
      >
        {verified
          ? <CircleCheck className="h-5 w-5 text-primary shrink-0" />
          : unlocked
            ? <div className="h-5 w-5 rounded border-2 border-primary shrink-0" />
            : <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
        }
        <div>
          <p className="font-semibold text-sm">Manager Verification</p>
          <p className="text-xs text-muted-foreground">
            {verified
              ? 'Stage verified by manager'
              : unlocked
                ? 'Click to verify completion of this stage'
                : 'Complete the quiz and activity to unlock'
            }
          </p>
        </div>
      </button>
    </div>
  )
}
