import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clock, BookOpen, Rocket, Terminal, Award, ArrowRight, CircleCheck, LoaderCircle } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

const stageCards = [
  { num: 1, title: 'The Foundation', desc: 'Understand the Netlify platform, modern web architecture, and core concepts.', time: '4–5 hours', icon: BookOpen, url: '/stage/1' },
  { num: 2, title: 'Getting Live', desc: 'Deploy your first site from Git and master the deployment lifecycle.', time: '4–5 hours', icon: Rocket, url: '/stage/2' },
  { num: 3, title: 'The CLI', desc: 'Master the Netlify CLI for local development, testing, and deploys.', time: '4–5 hours', icon: Terminal, url: '/stage/3' },
  { num: 4, title: 'Advanced Features', desc: 'Build a capstone project with Forms, edge functions, and more.', time: '5–7 hours', icon: Award, url: '/stage/4' },
]

function Dashboard() {
  const { stages, getProgress } = useOnboarding()
  const navigate = useNavigate()
  const progress = getProgress()
  const verified = Object.values(stages).filter(s => s.managerVerified).length

  const getStatus = (num: number) => {
    const s = stages[num]
    if (s.managerVerified) return 'verified'
    if (s.activityCompleted || s.quizPassed) return 'in-progress'
    return 'not-started'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient-teal">Welcome to Onboarding</h1>
        <p className="text-muted-foreground mt-1">Complete all 4 stages to earn your Netlify Engineering certificate.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Overall Progress</span>
            <span className="font-mono text-primary font-semibold">{verified}/4 verified</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-teal rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>~16–24 hours total</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stageCards.map(card => {
          const status = getStatus(card.num)
          const Icon = card.icon
          return (
            <button
              key={card.num}
              onClick={() => navigate({ to: card.url })}
              className={`group relative rounded-xl border p-6 text-left transition-all hover:shadow-md ${
                status === 'verified' ? 'border-primary/40 bg-accent/60'
                : status === 'in-progress' ? 'border-primary/20 bg-card hover:border-primary/40'
                : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${
                  status === 'verified' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">Stage {card.num}</span>
                    {status === 'verified' && <CircleCheck className="h-3.5 w-3.5 text-primary" />}
                    {status === 'in-progress' && <LoaderCircle className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <h3 className="font-semibold mt-0.5">{card.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {card.time}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
