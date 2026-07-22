import { createFileRoute } from '@tanstack/react-router'
import { Award, Download, Printer, Lock } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { sectionOrder, sectionMeta } from '@/lib/curriculum'

export const Route = createFileRoute('/certificate')({
  component: CertificatePage,
})

function CertificatePage() {
  const { allComplete, completedCount, totalCount } = useOnboarding()
  const unlocked = allComplete()

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="rounded-lg border border-border bg-card p-12 text-center max-w-md space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Certificate locked</h1>
          <p className="text-muted-foreground">
            Complete all {totalCount()} modules — pass each knowledge check and finish each activity list — to unlock your
            completion certificate.
          </p>
          <p className="text-sm font-mono text-primary">
            {completedCount()}/{totalCount()} modules complete
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
            <h1 className="text-3xl font-bold mt-2 text-gradient-teal print:text-black">Netlify Platform Onboarding</h1>
          </div>

          <div className="border-t border-border pt-4 space-y-1 print:border-gray-300">
            <p className="text-muted-foreground text-sm print:text-gray-600">
              This certifies successful completion of all {totalCount()} modules across the
            </p>
            <p className="text-muted-foreground text-sm print:text-gray-600">
              Create, Ship, Scale, and Secure sections of the Netlify platform.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium print:text-black flex-wrap">
            {sectionOrder.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground">•</span>}
                {sectionMeta[s].label}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground print:text-gray-500">
            Issued {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
