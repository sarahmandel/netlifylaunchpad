import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, Shield, Rocket, Square, SquareCheckBig } from 'lucide-react'

export const Route = createFileRoute('/checklist')({
  component: ChecklistPage,
})

type ChecklistItem = {
  label: string
  tier?: 'all' | 'pro' | 'enterprise'
}

type ChecklistSection = {
  title: string
  items: ChecklistItem[]
}

type ChecklistCategory = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  sections: ChecklistSection[]
}

const productionChecklist: ChecklistCategory = {
  title: 'Production Launch Checklist',
  icon: Rocket,
  sections: [
    {
      title: '1. Finalize Names',
      items: [
        { label: 'Edit team name and site name before configuring anything else', tier: 'all' },
      ],
    },
    {
      title: '2. Collaborate Securely and Efficiently',
      items: [
        { label: 'Configure automatic deploy subdomains for unified branded URLs', tier: 'all' },
        { label: 'Use custom headers to prevent branch deploys from being indexed by search engines', tier: 'all' },
        { label: 'Invite reviewers to get stakeholder sign-offs using collaborative Deploy Previews', tier: 'all' },
        { label: 'Set up Slack notifications for team awareness of deploy activity', tier: 'pro' },
        { label: 'Protect non-production deploys from unauthorized access (password protection)', tier: 'pro' },
        { label: 'Add team members with the minimum level of permissions required', tier: 'pro' },
        { label: 'Add at least one other Team Owner for backup access', tier: 'pro' },
        { label: 'Enable and enforce SAML single sign-on for your team', tier: 'enterprise' },
      ],
    },
    {
      title: '3. Optimize Performance and Ensure Quality',
      items: [
        { label: 'Optimize your build performance and build time', tier: 'all' },
        { label: 'Optimize image size and format with Netlify Image CDN', tier: 'all' },
        { label: 'Optimize the number of files updated for deploys to reduce deploy times', tier: 'all' },
        { label: 'Create cache key variations to optimize cache performance', tier: 'all' },
        { label: 'Opt out of automatic cache invalidation for proxied responses', tier: 'all' },
        { label: 'Add durable cache for serverless function responses', tier: 'all' },
        { label: 'Cache edge function responses for faster response times', tier: 'all' },
        { label: 'Customize edge function error handling (fail closed or open)', tier: 'all' },
        { label: 'Configure serverless functions region closest to data sources', tier: 'all' },
        { label: 'Add unit testing and integration testing to site builds', tier: 'all' },
        { label: 'Plan synthetic performance testing before initial launch', tier: 'all' },
        { label: 'Enable Web Analytics to monitor trends in site activity', tier: 'all' },
        { label: 'Enable Real User Monitoring for usability and performance', tier: 'pro' },
        { label: 'Configure Log Drains to pipe data to third-party monitoring services', tier: 'enterprise' },
      ],
    },
    {
      title: '4. Secure Your Information',
      items: [
        { label: 'Review sensitive variable policy (if public repository)', tier: 'all' },
        { label: 'Review deploy log visibility (if public repository)', tier: 'all' },
        { label: 'Flag sensitive values with Secrets Controller for secret scanning', tier: 'all' },
        { label: 'Import .env file variables for security and consistency', tier: 'all' },
        { label: 'Confirm no sensitive environment variables are committed to your repository', tier: 'all' },
        { label: 'Make variables available only to scopes that need them', tier: 'pro' },
        { label: 'Use shared environment variables for non-sensitive values across sites', tier: 'pro' },
        { label: 'Configure Private Connectivity to reduce risk to backend environment', tier: 'enterprise' },
      ],
    },
    {
      title: '5. Prepare for Production Traffic',
      items: [
        { label: 'Configure your site for HSTS preload', tier: 'all' },
        { label: 'Check for consistent trailing slashes and enable pretty URLs if needed', tier: 'all' },
        { label: 'Set up a custom 404 page in line with your branding', tier: 'all' },
        { label: 'Use country-based redirects for privacy regulation disclosures', tier: 'all' },
        { label: 'Add a custom domain and configure DNS', tier: 'all' },
        { label: 'Confirm primary domain is www or subdomain (if using external DNS)', tier: 'all' },
        { label: 'Manage HTTPS certificates to avoid rate limiting (if >5 domain aliases)', tier: 'all' },
        { label: 'Set up Firewall Traffic Rules to permit or block access by IP/geo', tier: 'enterprise' },
        { label: 'Set up rate limiting rules to protect against API abuse', tier: 'enterprise' },
        { label: 'Contact dedicated account support if migrating an existing domain', tier: 'enterprise' },
        { label: 'Configure domains for High-Performance Edge (if using external DNS)', tier: 'enterprise' },
        { label: 'Visit Trust Center for HIPAA reference architecture (if applicable)', tier: 'enterprise' },
      ],
    },
    {
      title: '6. Communicate with Customers',
      items: [
        { label: 'Set up Netlify Email Integration for version-controlled email templates', tier: 'all' },
        { label: 'Set up your domain to receive emails', tier: 'all' },
        { label: 'Add extra spam prevention for Netlify Forms', tier: 'all' },
        { label: 'Add email input field to forms for easy reply to submitters', tier: 'all' },
        { label: 'Create a custom success page for form submissions', tier: 'all' },
        { label: 'Create a process for managing sensitive form data', tier: 'all' },
      ],
    },
    {
      title: '7. Expect the Unexpected',
      items: [
        { label: 'Plan a maintenance page process', tier: 'all' },
        { label: 'Familiarize team with rollbacks for quick site reverts', tier: 'all' },
        { label: 'Familiarize team with manual deploy deletion for sensitive info', tier: 'all' },
        { label: 'Learn to fix failed deploys with AI-enabled suggested solutions', tier: 'all' },
        { label: 'Familiarize team with tips for requesting support by email', tier: 'pro' },
        { label: 'Learn about build prioritization for important builds', tier: 'enterprise' },
        { label: 'Set up Premium Support dedicated Slack channel and phone number', tier: 'enterprise' },
      ],
    },
  ],
}

const securityChecklist: ChecklistCategory = {
  title: 'Security Checklist',
  icon: Shield,
  sections: [
    {
      title: '1. Manage and Monitor Access',
      items: [
        { label: 'Configure SAML Single Sign-On (SSO) with your identity provider', tier: 'enterprise' },
        { label: 'Enforce SSO login for all team members', tier: 'enterprise' },
        { label: 'Set up Directory Sync (SCIM) for automatic user provisioning', tier: 'enterprise' },
        { label: 'Enable Two-Factor Authentication (2FA)', tier: 'all' },
        { label: 'Monitor team activity using the team audit log', tier: 'all' },
      ],
    },
    {
      title: '2. Build Securely',
      items: [
        { label: 'Set up Snyk integration to find security issues before deploying', tier: 'all' },
        { label: 'Detect security concerns in production dependencies', tier: 'all' },
        { label: 'Detect security issues in serverless functions', tier: 'all' },
        { label: 'Build software bill of materials (SBOM)', tier: 'all' },
        { label: 'Set up Very Good Security integration for PII tokenization', tier: 'all' },
      ],
    },
    {
      title: '3. Keep Secrets Safe',
      items: [
        { label: 'Use Secrets Controller for stricter security on sensitive values', tier: 'all' },
        { label: 'Perform secret scanning of code and build output files', tier: 'all' },
        { label: 'Use team-level environment variables only for non-sensitive config', tier: 'all' },
        { label: 'Generate unique secrets for each site', tier: 'all' },
        { label: 'Avoid storing sensitive values in netlify.toml, .env files, or repositories', tier: 'all' },
        { label: 'Create and store environment variables via Netlify UI, CLI, or API', tier: 'all' },
        { label: 'Use scopes to limit environment variable access', tier: 'all' },
        { label: 'Set up a process to rotate compromised secrets', tier: 'all' },
        { label: 'Configure sensitive variable policy for public repositories', tier: 'all' },
      ],
    },
    {
      title: '4. Protect Your Sites',
      items: [
        { label: 'Set up rate limiting for your sites', tier: 'enterprise' },
        { label: 'Configure Firewall Traffic Rules to block by IP or geo', tier: 'enterprise' },
        { label: 'Set up password protection for non-production deploys', tier: 'pro' },
        { label: 'Implement Role-Based Access Control (RBAC)', tier: 'all' },
        { label: 'Set up HSTS preload to force HTTPS connections', tier: 'all' },
        { label: 'Add Certificate Authority Authorization (CAA) record', tier: 'all' },
        { label: 'Configure Private Connectivity for backend protection', tier: 'enterprise' },
      ],
    },
    {
      title: '5. Implement a Content Security Policy',
      items: [
        { label: 'Set up Content Security Policy (CSP) headers', tier: 'all' },
        { label: 'Define allowlist of domains, content hashes, and nonces', tier: 'all' },
        { label: 'Prevent cross-site scripting (XSS) attacks', tier: 'all' },
        { label: 'Prevent user data exfiltration', tier: 'all' },
      ],
    },
    {
      title: '6. Monitor Site Activity',
      items: [
        { label: 'Enable Web Analytics to monitor visitor patterns', tier: 'all' },
        { label: 'Set up Log Drains to stream logs to monitoring providers', tier: 'enterprise' },
        { label: 'Review site audit log for detailed records of system activity', tier: 'all' },
      ],
    },
  ],
}

const tierBadge = (tier: string) => {
  if (tier === 'pro') return <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">Pro+</span>
  if (tier === 'enterprise') return <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">Enterprise</span>
  return null
}

function ChecklistSection({ section, checkedState, onToggle }: {
  section: ChecklistSection
  checkedState: boolean[]
  onToggle: (i: number) => void
}) {
  const [open, setOpen] = useState(false)
  const done = checkedState.filter(Boolean).length
  const total = section.items.length

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
      >
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-0' : '-rotate-90'}`} />
        <span className="font-medium text-sm flex-1">{section.title}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
          done === total ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
        }`}>
          {done}/{total}
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-2 py-2 space-y-1">
          {section.items.map((item, i) => (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all text-left ${
                checkedState[i]
                  ? 'bg-accent border border-primary/30 text-accent-foreground'
                  : 'bg-secondary/30 border border-transparent hover:bg-secondary/60 text-secondary-foreground'
              }`}
            >
              {checkedState[i]
                ? <SquareCheckBig className="h-4 w-4 text-primary shrink-0" />
                : <Square className="h-4 w-4 text-muted-foreground shrink-0" />
              }
              <span className={checkedState[i] ? 'line-through opacity-60' : ''}>{item.label}</span>
              {item.tier && tierBadge(item.tier)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChecklistCategoryCard({ category }: { category: ChecklistCategory }) {
  const [checked, setChecked] = useState<boolean[][]>(
    category.sections.map(s => s.items.map(() => false))
  )

  const toggle = (sectionIdx: number, itemIdx: number) => {
    setChecked(prev => {
      const next = prev.map(s => [...s])
      next[sectionIdx][itemIdx] = !next[sectionIdx][itemIdx]
      return next
    })
  }

  const totalDone = checked.flat().filter(Boolean).length
  const totalItems = checked.flat().length
  const progressPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0
  const Icon = category.icon

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg gradient-teal text-primary-foreground shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{category.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-teal rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{totalDone}/{totalItems}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {category.sections.map((section, si) => (
          <ChecklistSection
            key={si}
            section={section}
            checkedState={checked[si]}
            onToggle={(ii) => toggle(si, ii)}
          />
        ))}
      </div>
    </div>
  )
}

function ChecklistPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient-teal">Netlify Checklists</h1>
        <p className="text-muted-foreground mt-1">
          Essential checklists from <a href="https://docs.netlify.com/resources/checklists/overview/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netlify docs</a> to prepare your project for production.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" /> All plans</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> Pro+ plans</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-purple-400" /> Enterprise only</span>
      </div>

      <ChecklistCategoryCard category={productionChecklist} />
      <ChecklistCategoryCard category={securityChecklist} />
    </div>
  )
}
