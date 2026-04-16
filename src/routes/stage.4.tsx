import { createFileRoute } from '@tanstack/react-router'
import { Clock, MonitorPlay, BookOpen, FileText, Hammer } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { VideoEmbed } from '@/components/VideoEmbed'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { ManagerVerification } from '@/components/ManagerVerification'

export const Route = createFileRoute('/stage/4')({
  component: Stage4,
})

function Stage4() {
  const { stages, passQuiz, completeActivity } = useOnboarding()
  const stage = stages[4]

  const handleComplete = () => {
    if (!stage.quizPassed) passQuiz(4)
    completeActivity(4)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full gradient-teal text-primary-foreground text-sm font-bold">4</span>
          <h1 className="text-2xl font-bold">Advanced Features</h1>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full ml-auto">
            <Clock className="h-3 w-3" /> ~5–7 hours
          </span>
        </div>
        <p className="text-muted-foreground">Add dynamic features with Netlify Forms, edge functions, and complete a cumulative capstone project.</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><MonitorPlay className="h-5 w-5 text-primary shrink-0" /> Watch: AI + Netlify Forms</h2>
        <VideoEmbed videoId="B4PfKu-e3Uk" title="Add forms to your project with AI + Netlify" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary shrink-0" /> Required Reading</h2>
        <p className="text-sm text-muted-foreground">Study these advanced platform features before starting the capstone project.</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read <a href="https://docs.netlify.com/forms/setup/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Forms Setup</a> — HTML forms, AJAX submissions, and spam filtering</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read <a href="https://docs.netlify.com/edge-functions/overview/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Edge Functions Overview</a></span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Study <a href="https://docs.netlify.com/monitor-sites/analytics/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Analytics</a> — server-side analytics vs. client-side</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read about <a href="https://docs.netlify.com/integrations/frameworks/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Framework Integrations</a> — Next.js, Astro, Remix on Netlify</span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-primary/20 bg-accent/50 p-5 space-y-3">
        <h3 className="font-semibold text-accent-foreground flex items-center gap-2"><Hammer className="h-5 w-5 text-primary shrink-0" /> The Full Build — Cumulative Capstone Project</h3>
        <p className="text-sm text-muted-foreground">
          Take the site you deployed in Stage 2. Use the CLI skills from Stage 3 to create a new branch called{' '}
          <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">feature-form</code>. Add a{' '}
          <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">{'<form netlify>'}</code>{' '}
          tag to your contact page. Push to GitHub. Check the "Forms" tab in your Netlify dashboard to see your test submission.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Bonus challenge:</strong> Add form notification emails, a custom success page, and implement basic spam filtering using Netlify's built-in honeypot field.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary shrink-0" /> Architecture Write-Up</h2>
        <p className="text-sm text-muted-foreground">
          Write a technical summary (500–800 words) of your completed project. Include: architecture decisions, the deployment pipeline you set up, how environment variables are managed, how the form submissions flow works, and what you would change if building for production at scale. Share this with your manager.
        </p>
      </div>

      <ActivityChecklist
        title="The Full Build — Capstone"
        description="Combine everything you've learned into a complete feature workflow. This is your final deliverable."
        steps={[
          { label: 'Create a new branch: git checkout -b feature-form' },
          { label: 'Add a contact form with the netlify attribute to your HTML' },
          { label: 'Add a custom form success/thank-you page' },
          { label: 'Implement a honeypot field for spam filtering' },
          { label: 'Test locally with netlify dev' },
          { label: 'Push the branch to GitHub and create a deploy preview' },
          { label: 'Submit a test entry through the deployed form' },
          { label: 'Check the Forms tab in your Netlify dashboard for the submission' },
          { label: 'Set up form notification emails in the Netlify dashboard' },
          { label: 'Submit your architecture write-up to your manager' },
        ]}
        onComplete={handleComplete}
        completed={stage.activityCompleted}
      />

      <ManagerVerification stage={4} />
    </div>
  )
}
