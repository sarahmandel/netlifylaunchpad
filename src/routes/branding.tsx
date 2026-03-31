import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Paintbrush, Save, RotateCcw, Eye } from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'

export const Route = createFileRoute('/branding')({
  component: BrandingPage,
})

function BrandingPage() {
  const { branding, setBranding } = useOnboarding()
  const [form, setForm] = useState(branding)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setBranding(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const defaults = { companyName: 'Netlify', logoUrl: '', primaryColor: '', accentColor: '' }
    setForm(defaults)
    setBranding(defaults)
  }

  const previewColor = form.primaryColor || '#00ad9c'
  const previewAccent = form.accentColor || '#17cfbc'

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Paintbrush className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Branding</h1>
        </div>
        <p className="text-muted-foreground">Customize the onboarding experience with your organization's branding.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-lg font-semibold">Company Information</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={e => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Netlify"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Displayed throughout the onboarding experience.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Logo URL</label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={e => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.svg"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Your company logo. Recommended: SVG or PNG with transparent background.</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-lg font-semibold">Brand Colors</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor || '#00ad9c'}
                    onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="h-9 w-9 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#00ad9c"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor || '#17cfbc'}
                    onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="h-9 w-9 rounded-md border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.accentColor}
                    onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                    placeholder="#17cfbc"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Leave blank to use default Netlify teal.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-teal text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" />
              {saved ? 'Saved!' : 'Save Branding'}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Preview</h2>
            </div>
            <div className="rounded-lg border border-border bg-background p-6 space-y-4">
              <div className="flex items-center gap-3">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
                ) : (
                  <div className="h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${previewColor}, ${previewAccent})` }}>
                    {(form.companyName || 'N')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold" style={{ background: `linear-gradient(135deg, ${previewColor}, ${previewAccent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {form.companyName || 'Netlify'}
                  </h3>
                  <p className="text-xs text-muted-foreground">Engineering Onboarding</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-2">
                <div className="h-2.5 rounded-full overflow-hidden bg-secondary">
                  <div className="h-full w-3/4 rounded-full" style={{ background: `linear-gradient(135deg, ${previewColor}, ${previewAccent})` }} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg border border-border p-3">
                    <div className="h-2 w-16 rounded bg-muted mb-2" />
                    <div className="h-2 w-24 rounded bg-muted/60" />
                  </div>
                  <div className="flex-1 rounded-lg border border-border p-3">
                    <div className="h-2 w-16 rounded bg-muted mb-2" />
                    <div className="h-2 w-24 rounded bg-muted/60" />
                  </div>
                </div>
                <button className="w-full py-2 rounded-lg text-white text-xs font-semibold" style={{ background: `linear-gradient(135deg, ${previewColor}, ${previewAccent})` }}>
                  Sample Button
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="text-sm font-semibold">How Branding Works</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">1.</span>
                Set your company name and it will appear throughout headers, sidebar, and certificates.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                Add a logo URL to replace the default icon in the sidebar and certificate.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                Choose brand colors to customize buttons, progress bars, and accent elements.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">4.</span>
                All branding settings are stored locally and persist across sessions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
