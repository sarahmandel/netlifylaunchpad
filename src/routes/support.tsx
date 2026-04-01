import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { LifeBuoy, Send, AlertCircle, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/support')({
  component: SupportPage,
})

type TicketForm = {
  name: string
  email: string
  category: string
  subject: string
  description: string
  priority: string
}

const categories = [
  'Account & Billing',
  'Build & Deploy Issues',
  'DNS & Domain Configuration',
  'Functions & Edge Functions',
  'Performance & CDN',
  'Identity & Authentication',
  'Onboarding Help',
  'Other',
]

function SupportPage() {
  const [form, setForm] = useState<TicketForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: '',
    priority: 'normal',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.category || !form.subject || !form.description) {
      setError('Please fill in all required fields.')
      return
    }

    // Open Netlify support with pre-filled context
    const supportUrl = `https://www.netlify.com/support/?subject=${encodeURIComponent(form.subject)}&email=${encodeURIComponent(form.email)}`
    window.open(supportUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  const update = (field: keyof TicketForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  if (submitted) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full gradient-teal text-primary-foreground mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Support Request Submitted</h1>
          <p className="text-muted-foreground max-w-md">
            You've been redirected to Netlify Support. A team member will respond to your request shortly. You can also reach out through the community channels below.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="https://answers.netlify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">
              Netlify Forum
            </a>
            <a href="https://discord.gg/netlify" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">
              Discord Community
            </a>
            <button onClick={() => setSubmitted(false)} className="px-4 py-2 rounded-lg gradient-teal text-primary-foreground text-sm font-medium transition-colors">
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LifeBuoy className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Support</h1>
        </div>
        <p className="text-muted-foreground">Create a support ticket with the Netlify team. We're here to help.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <h2 className="text-lg font-semibold">Ticket Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={form.priority}
                onChange={e => update('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Subject <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={form.subject}
              onChange={e => update('subject', e.target.value)}
              placeholder="Brief summary of your issue"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe your issue in detail. Include error messages, steps to reproduce, and any relevant context."
              rows={6}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-teal text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
            Submit Support Ticket
          </button>
        </div>
      </form>
    </div>
  )
}
