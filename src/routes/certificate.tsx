import { createFileRoute } from '@tanstack/react-router'
import { Award, Download, Printer, Lock, Check } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

export const Route = createFileRoute('/certificate')({
  component: CertificatePage,
})

function CertificatePage() {
  const { allVerified } = useOnboarding()
  const unlocked = allVerified()

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="rounded-lg border border-border bg-card p-12 text-center max-w-md space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Certificate Locked</h1>
          <p className="text-muted-foreground">
            Complete all 4 stages (~16–24 hours) and have your manager verify each one to unlock your completion certificate.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in space-y-6">
      <div className="flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-teal text-primary-foreground font-semibold"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <div
        id="certificate"
        className="rounded-lg border-2 border-primary bg-card p-12 text-center max-w-lg space-y-6 glow-teal relative overflow-hidden print:border-black print:shadow-none print:max-w-full print:rounded-none"
      >
        <div className="absolute inset-0 gradient-teal opacity-5 print:hidden" />
        <div className="relative z-10 space-y-6">
          <Award className="h-20 w-20 text-primary mx-auto animate-pulse-glow rounded-full p-3 print:animate-none print:text-black" />

          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium print:text-gray-500">
              Certificate of Completion
            </p>
            <h1 className="text-3xl font-bold mt-2 text-gradient-teal print:text-black">
              Netlify Engineering Onboarding
            </h1>
          </div>

          <div className="border-t border-border pt-4 space-y-1 print:border-gray-300">
            <p className="text-muted-foreground text-sm print:text-gray-600">
              This certifies that the engineer has successfully completed
            </p>
            <p className="text-muted-foreground text-sm print:text-gray-600">
              all 4 stages (~16–24 hours) of the Netlify Engineering Onboarding Program.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium print:text-black">
            <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> Foundation</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> Deployment</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> CLI</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> Advanced</span>
          </div>

          <p className="text-xs text-muted-foreground print:text-gray-500">
            Issued {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
