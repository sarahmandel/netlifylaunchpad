import { createFileRoute } from '@tanstack/react-router'
import { Clock, MonitorPlay, BookOpen, FileText } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { VideoEmbed } from '@/components/VideoEmbed'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { ManagerVerification } from '@/components/ManagerVerification'

export const Route = createFileRoute('/stage/3')({
  component: Stage3,
})

function Stage3() {
  const { stages, passQuiz, completeActivity } = useOnboarding()
  const stage = stages[3]

  const handleComplete = () => {
    if (!stage.quizPassed) passQuiz(3)
    completeActivity(3)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full gradient-teal text-primary-foreground text-sm font-bold">3</span>
          <h1 className="text-2xl font-bold">The CLI</h1>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full ml-auto">
            <Clock className="h-3 w-3" /> ~4–5 hours
          </span>
        </div>
        <p className="text-muted-foreground">Master the Netlify CLI for local development, testing, and manual deploys.</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><MonitorPlay className="h-5 w-5 text-primary shrink-0" /> Watch: Netlify CLI Quickstart</h2>
        <VideoEmbed videoId="t3kCm0kruDc" title="Netlify Quickstart: CLI" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary shrink-0" /> Required Reading</h2>
        <p className="text-sm text-muted-foreground">Deep-dive into the CLI documentation before starting the hands-on activities.</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read the <a href="https://docs.netlify.com/cli/get-started/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">CLI Get Started Guide</a></span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Study <a href="https://docs.netlify.com/cli/local-development/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Local Development with Netlify Dev</a></span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read about <a href="https://docs.netlify.com/functions/overview/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Functions</a> — understand serverless functions basics</span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary shrink-0" /> CLI Exploration Exercise</h2>
        <p className="text-sm text-muted-foreground">After installing the CLI, run the following commands and document their output in a text file. Share this file with your manager as part of your verification.</p>
        <div className="space-y-1.5 text-sm font-mono">
          <p className="text-primary bg-primary/10 px-3 py-1.5 rounded">$ netlify status</p>
          <p className="text-primary bg-primary/10 px-3 py-1.5 rounded">$ netlify sites:list</p>
          <p className="text-primary bg-primary/10 px-3 py-1.5 rounded">$ netlify env:list</p>
          <p className="text-primary bg-primary/10 px-3 py-1.5 rounded">$ netlify dev (run locally and test)</p>
          <p className="text-primary bg-primary/10 px-3 py-1.5 rounded">$ netlify functions:create hello-world</p>
        </div>
      </div>

      <ActivityChecklist
        title="Local to Live"
        description="Use the CLI to develop locally, test serverless functions, and deploy directly from your terminal."
        steps={[
          { label: 'Install the Netlify CLI: npm install -g netlify-cli' },
          { label: 'Run netlify login to authenticate' },
          { label: 'Navigate to your Stage 2 project directory' },
          { label: 'Run netlify link to connect to your site' },
          { label: 'Run netlify dev and test your site locally on localhost' },
          { label: 'Create a basic serverless function using netlify functions:create' },
          { label: 'Test the function locally via netlify dev' },
          { label: 'Run netlify deploy to perform a draft deploy' },
          { label: 'Verify the draft URL works in your browser' },
          { label: 'Document CLI command outputs and share with your manager' },
        ]}
        onComplete={handleComplete}
        completed={stage.activityCompleted}
      />

      <ManagerVerification stage={3} />
    </div>
  )
}
