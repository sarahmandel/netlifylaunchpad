import { createFileRoute } from '@tanstack/react-router'
import { Clock, MonitorPlay, BookOpen, FileText } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { VideoEmbed } from '@/components/VideoEmbed'
import { KnowledgeCheck } from '@/components/KnowledgeCheck'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { ManagerVerification } from '@/components/ManagerVerification'

export const Route = createFileRoute('/stage/2')({
  component: Stage2,
})

const quizQuestions = [
  {
    question: 'What happens when you push code to a connected GitHub branch?',
    options: [
      'Nothing — you must manually trigger deploys',
      'Netlify automatically detects the change, triggers a new build, and updates the live site',
      'The code is saved but not deployed until approved',
      'Only the README is updated on the dashboard',
    ],
    correctIndex: 1,
    explanation: "Netlify's continuous deployment automatically builds and deploys on every push to the connected branch.",
  },
  {
    question: 'Where do you configure build settings like the build command and publish directory?',
    options: [
      "In the GitHub repository's package.json only",
      'In the Netlify dashboard under Site Settings → Build & Deploy',
      'In a special .netlify-config file',
      'Build settings cannot be changed after initial setup',
    ],
    correctIndex: 1,
    explanation: 'Build settings are configured in the Netlify dashboard under Site Settings → Build & Deploy, or via netlify.toml.',
  },
  {
    question: 'How should you handle sensitive values like API keys in Netlify?',
    options: [
      'Hardcode them in your JavaScript source files',
      'Store them in environment variables via the Netlify dashboard',
      'Add them to a public .env file in your repository',
      'Email them to your team for manual configuration',
    ],
    correctIndex: 1,
    explanation: 'Environment variables in the Netlify dashboard keep secrets secure and out of your source code.',
  },
]

function Stage2() {
  const { stages, passQuiz, completeActivity } = useOnboarding()
  const stage = stages[2]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full gradient-teal text-primary-foreground text-sm font-bold">2</span>
          <h1 className="text-2xl font-bold">Getting Live</h1>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full ml-auto">
            <Clock className="h-3 w-3" /> ~4–5 hours
          </span>
        </div>
        <p className="text-muted-foreground">Deploy your first site from a Git repository and master the deployment workflow.</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><MonitorPlay className="h-5 w-5 text-primary shrink-0" /> Watch: Deploying from Git</h2>
        <VideoEmbed videoId="4h8B080Mv4U" title="Netlify Tutorial – Deploying from Git" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary shrink-0" /> Required Reading</h2>
        <p className="text-sm text-muted-foreground">Study these docs to understand build configuration, deploy previews, and environment management.</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read <a href="https://docs.netlify.com/site-deploys/create-deploys/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Creating Deploys</a> documentation</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read <a href="https://docs.netlify.com/site-deploys/deploy-previews/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Deploy Previews</a> — understand branch deploys vs. deploy previews</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Study <a href="https://docs.netlify.com/environment-variables/overview/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Environment Variables</a> — scopes, contexts, and sensitive variables</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read about <a href="https://docs.netlify.com/configure-builds/file-based-configuration/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">netlify.toml</a> file-based configuration</span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary shrink-0" /> Configuration Exercise</h2>
        <p className="text-sm text-muted-foreground">
          Create a <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">netlify.toml</code> file in your project root that defines: build command, publish directory, a redirect rule (e.g., <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">/old-page → /new-page</code>), and at least one environment variable context (production vs. staging). Document each line with comments explaining its purpose.
        </p>
      </div>

      <KnowledgeCheck questions={quizQuestions} onPass={() => passQuiz(2)} passed={stage.quizPassed} />

      <ActivityChecklist
        title="First Deploy & Iteration"
        description="Get a site live on the internet and practice the full deployment lifecycle."
        steps={[
          { label: 'Fork a basic HTML template on GitHub (or create a simple index.html)' },
          { label: 'Connect the repo to Netlify and deploy it' },
          { label: 'Add a netlify.toml file with build settings and a redirect rule' },
          { label: 'Set up an environment variable in the Netlify dashboard' },
          { label: 'Update the index.html file in your GitHub repo' },
          { label: 'Verify the Deploy Log shows a new automatic build' },
          { label: 'Create a branch, push changes, and review the Deploy Preview URL' },
          { label: 'Share the Deploy Preview URL with your manager' },
        ]}
        onComplete={() => completeActivity(2)}
        completed={stage.activityCompleted}
      />

      <ManagerVerification stage={2} />
    </div>
  )
}
