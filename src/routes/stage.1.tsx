import { createFileRoute } from '@tanstack/react-router'
import { Clock, MonitorPlay, BookOpen, Globe, FileText } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { VideoEmbed } from '@/components/VideoEmbed'
import { KnowledgeCheck } from '@/components/KnowledgeCheck'
import { ActivityChecklist } from '@/components/ActivityChecklist'
import { ManagerVerification } from '@/components/ManagerVerification'

export const Route = createFileRoute('/stage/1')({
  component: Stage1,
})

const quizQuestions = [
  {
    question: 'What is the primary benefit of Netlify\'s "Atomic Deploys"?',
    options: [
      'They reduce build times by 50%',
      'You can roll back to any previous version of the site instantly if a bug is found',
      'They automatically minify all JavaScript files',
      'They enable server-side rendering by default',
    ],
    correctIndex: 1,
    explanation: 'Atomic deploys ensure every deploy is a complete, immutable snapshot — making instant rollbacks possible.',
  },
  {
    question: 'What architecture does Netlify primarily support?',
    options: [
      'Monolithic server-rendered applications',
      'Pre-built markup served from a CDN with dynamic APIs and serverless functions',
      'Traditional LAMP stack hosting',
      'Container-based microservices only',
    ],
    correctIndex: 1,
    explanation: 'Netlify serves pre-rendered static assets on a global CDN, enhanced with APIs and serverless functions.',
  },
  {
    question: 'How does Netlify differ from traditional web hosting?',
    options: [
      'It requires manual FTP uploads for every change',
      'Sites are served from a single data center',
      'It deploys pre-built files to a global CDN with automatic HTTPS',
      'It only supports WordPress sites',
    ],
    correctIndex: 2,
    explanation: 'Unlike traditional hosting, Netlify serves pre-built files from a global CDN with automatic SSL/TLS certificates.',
  },
]

function Stage1() {
  const { stages, passQuiz, completeActivity } = useOnboarding()
  const stage = stages[1]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full gradient-teal text-primary-foreground text-sm font-bold">1</span>
          <h1 className="text-2xl font-bold">The Foundation</h1>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full ml-auto">
            <Clock className="h-3 w-3" /> ~4–5 hours
          </span>
        </div>
        <p className="text-muted-foreground">Understand the Netlify platform, modern web architecture, and core concepts.</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><MonitorPlay className="h-5 w-5 text-primary shrink-0" /> Watch: Platform Overview</h2>
        <VideoEmbed videoId="XG8nJDWu3a0" title="Everything you need to know about the Netlify platform" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary shrink-0" /> Required Reading</h2>
        <p className="text-sm text-muted-foreground">Complete these readings before taking the quiz. Take notes for your manager review.</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read the <a href="https://docs.netlify.com/get-started/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Get Started Guide</a> (all sections)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read the <a href="https://docs.netlify.com/platform/primitives/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Platform Overview</a></span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Explore the <a href="https://docs.netlify.com/platform/primitives/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">Netlify Platform Primitives</a> documentation</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">→</span>
            <span>Read about <a href="https://docs.netlify.com/domains-https/https-ssl/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">HTTPS and SSL on Netlify</a></span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Globe className="h-5 w-5 text-primary shrink-0" /> DNS Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Use this quick guide when connecting domains to Netlify, whether the domain is brand new or currently managed by another DNS provider.
        </p>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">New DNS on Netlify</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">1.</span>
              <span>Add your custom domain in Netlify under Domain Management.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">2.</span>
              <span>Create or delegate a DNS zone to Netlify DNS.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">3.</span>
              <span>Set your registrar nameservers to the Netlify-provided nameservers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">4.</span>
              <span>Verify apex and <code>www</code> records, then set your primary domain in Netlify.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">DNS Repoint from Common Providers</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              <span><strong>Cloudflare:</strong> Export records first, reduce TTL before migration, switch nameservers at registrar, then recreate/validate records in Netlify DNS.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              <span><strong>GoDaddy / Namecheap / Route 53:</strong> Copy existing records, lower TTL for faster cutover, update nameservers to Netlify, and confirm mail/auth records (MX, SPF, DKIM, DMARC) after propagation.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">→</span>
              <span><strong>Cutover checklist:</strong> Keep old zone available until propagation completes, test both apex and <code>www</code>, and verify HTTPS issuance in Netlify after DNS settles.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Netlify DNS vs Cloudflare DNS</h3>
          <p className="text-sm text-muted-foreground">
            Cloudflare DNS is strong for advanced traffic controls and edge security overlays. Netlify DNS is strongest when the site, deploys, certificates, and domain management live in one control plane.
            Using only Netlify reduces operational split-brain, shortens incident triage, keeps domain and SSL workflows aligned with deploys, and lowers onboarding complexity for teams that want a single owner for delivery and DNS.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary shrink-0" /> Written Exercise</h2>
        <p className="text-sm text-muted-foreground">
          Write a 1-page summary (300–500 words) comparing modern web architecture with traditional server-rendered architectures. Cover: deployment flow, performance characteristics, scalability, and developer experience. Share this document with your manager before requesting verification.
        </p>
      </div>

      <KnowledgeCheck questions={quizQuestions} onPass={() => passQuiz(1)} passed={stage.quizPassed} />

      <ActivityChecklist
        title="Account Setup & Exploration"
        description="Create your Netlify team, explore the dashboard, and familiarize yourself with the platform."
        steps={[
          { label: 'Create a Netlify account at netlify.com' },
          { label: 'Link your personal GitHub account' },
          { label: 'Create your Netlify Team and invite your manager' },
          { label: 'Explore the Netlify dashboard: review the Team Overview, Members, and Audit Log sections' },
          { label: 'Review the Netlify documentation site structure — bookmark key pages for future reference' },
          { label: 'Submit your written architecture comparison exercise to your manager' },
        ]}
        onComplete={() => completeActivity(1)}
        completed={stage.activityCompleted}
      />

      <ManagerVerification stage={1} />
    </div>
  )
}
