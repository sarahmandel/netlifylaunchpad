import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Clock, BookOpen, Rocket, Terminal, Award, ArrowRight, CircleCheck, LoaderCircle, Code, Users, Calendar, MessageCircle, Hash } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import type { Track } from '@/context/OnboardingContext'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

const developerStages = [
  { num: 1, title: 'The Foundation', desc: 'Understand the Netlify platform, modern web architecture, and core concepts.', time: '4-5 hours', icon: BookOpen, url: '/stage/1' },
  { num: 2, title: 'Getting Live', desc: 'Deploy your first site from Git and master the deployment lifecycle.', time: '4-5 hours', icon: Rocket, url: '/stage/2' },
  { num: 3, title: 'The CLI', desc: 'Master the Netlify CLI for local development, testing, and deploys.', time: '4-5 hours', icon: Terminal, url: '/stage/3' },
  { num: 4, title: 'Advanced Features', desc: 'Build a capstone project with Forms, edge functions, and more.', time: '5-7 hours', icon: Award, url: '/stage/4' },
]

const nonDeveloperStages = [
  { num: 1, title: 'The Foundation', desc: 'Understand the Netlify platform, key concepts, and how teams use it.', time: '3-4 hours', icon: BookOpen, url: '/stage/1' },
  { num: 2, title: 'Getting Live', desc: 'Learn the deployment workflow from a team collaboration perspective.', time: '3-4 hours', icon: Rocket, url: '/stage/2' },
  { num: 3, title: 'Platform Navigation', desc: 'Navigate the dashboard, analytics, and team management features.', time: '2-3 hours', icon: Terminal, url: '/stage/3' },
  { num: 4, title: 'Integrations & Workflows', desc: 'Explore integrations, plugins, and cross-team workflows.', time: '3-4 hours', icon: Award, url: '/stage/4' },
]

function TrackSelector({ track, onSelect }: { track: Track; onSelect: (t: Track) => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Choose Your Track</h2>
        <p className="text-sm text-muted-foreground mt-1">Select the onboarding path that best fits your role.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onSelect('developer')}
          className={`group relative rounded-lg border p-5 text-left transition-all hover:shadow-md ${
            track === 'developer' ? 'border-primary bg-accent/60 ring-2 ring-primary/30' : 'border-border bg-card hover:border-primary/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${
              track === 'developer' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Developer Track</h3>
              <p className="text-xs text-muted-foreground mt-1">Hands-on coding, CLI, deployments, and building with Netlify platform features.</p>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3" /> ~16-24 hours
              </span>
            </div>
          </div>
          {track === 'developer' && <CircleCheck className="absolute top-3 right-3 h-5 w-5 text-primary" />}
        </button>
        <button
          onClick={() => onSelect('non-developer')}
          className={`group relative rounded-lg border p-5 text-left transition-all hover:shadow-md ${
            track === 'non-developer' ? 'border-primary bg-accent/60 ring-2 ring-primary/30' : 'border-border bg-card hover:border-primary/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${
              track === 'non-developer' ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Non-Developer Track</h3>
              <p className="text-xs text-muted-foreground mt-1">Platform navigation, team workflows, integrations, and collaboration tools.</p>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3" /> ~12-16 hours
              </span>
            </div>
          </div>
          {track === 'non-developer' && <CircleCheck className="absolute top-3 right-3 h-5 w-5 text-primary" />}
        </button>
      </div>
    </div>
  )
}

function CalendarCheckins() {
  const googleCalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Netlify+Onboarding+Check-in&details=Scheduled+onboarding+check-in+to+review+progress+and+discuss+any+questions.&recur=RRULE:FREQ=WEEKLY;COUNT=4'
  const outlookUrl = 'https://outlook.office.com/calendar/0/deeplink/compose?subject=Netlify+Onboarding+Check-in&body=Scheduled+onboarding+check-in+to+review+progress+and+discuss+any+questions.'

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Schedule Check-ins</h2>
      </div>
      <p className="text-sm text-muted-foreground">Set up recurring check-in meetings with your manager or onboarding buddy to track progress and get help.</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={googleCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15c0 .825.675 1.5 1.5 1.5h15c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-15V8.25h15V19.5z"/></svg>
          Google Calendar
        </a>
        <a
          href={outlookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V8h18v10zM7 10h2v2H7v-2zm0 4h2v2H7v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/></svg>
          Outlook Calendar
        </a>
      </div>
      <p className="text-xs text-muted-foreground">Recommended: Weekly 30-minute check-ins for the duration of onboarding.</p>
    </div>
  )
}

function CommunityLinks() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Community & Support</h2>
      </div>
      <p className="text-sm text-muted-foreground">Connect with the team and community for help and collaboration.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <a
          href="https://netlify.slack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#4A154B] text-white shrink-0">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Slack Channel</p>
            <p className="text-xs text-muted-foreground">Join the team</p>
          </div>
        </a>
        <a
          href="https://answers.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground shrink-0">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Netlify Forum</p>
            <p className="text-xs text-muted-foreground">Community support</p>
          </div>
        </a>
        <a
          href="https://discord.gg/netlify"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#5865F2] text-white shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          </div>
          <div>
            <p className="text-sm font-medium">Discord</p>
            <p className="text-xs text-muted-foreground">Chat with community</p>
          </div>
        </a>
      </div>
    </div>
  )
}

function Dashboard() {
  const { stages, track, setTrack, getProgress, branding } = useOnboarding()
  const navigate = useNavigate()
  const progress = getProgress()
  const verified = Object.values(stages).filter(s => s.managerVerified).length
  const stageCards = track === 'non-developer' ? nonDeveloperStages : developerStages
  const companyName = branding.companyName || 'Netlify'

  const getStatus = (num: number) => {
    const s = stages[num]
    if (s.managerVerified) return 'verified'
    if (s.activityCompleted || s.quizPassed) return 'in-progress'
    return 'not-started'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient-teal">Welcome to {companyName} Onboarding</h1>
        <p className="text-muted-foreground mt-1">Complete all 4 stages to earn your {companyName} Engineering certificate.</p>
      </div>

      <TrackSelector track={track} onSelect={setTrack} />

      {track && (
        <>
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
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
              <span>{track === 'non-developer' ? '~12-16 hours total' : '~16-24 hours total'}</span>
            </div>
          </div>

          {track && (
            <div className="flex items-center gap-2 px-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                track === 'developer' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {track === 'developer' ? <Code className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                {track === 'developer' ? 'Developer Track' : 'Non-Developer Track'}
              </span>
              <button onClick={() => setTrack(null)} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                Change track
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {stageCards.map(card => {
              const status = getStatus(card.num)
              const Icon = card.icon
              return (
                <button
                  key={card.num}
                  onClick={() => navigate({ to: card.url })}
                  className={`group relative rounded-lg border p-6 text-left transition-all hover:shadow-md ${
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
        </>
      )}

      <CalendarCheckins />
      <CommunityLinks />
    </div>
  )
}
