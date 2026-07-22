// Netlify checklist data (Production Launch + Security). Extracted into its own
// module so the /checklist route and the global search index share one source.
import { Shield, Rocket } from 'lucide-react'

export type ChecklistTier = 'all' | 'pro' | 'enterprise'

export type ChecklistItem = {
  label: string
  tier?: ChecklistTier
}

export type ChecklistSection = {
  title: string
  items: ChecklistItem[]
}

export type ChecklistCategory = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  sections: ChecklistSection[]
}

export const productionChecklist: ChecklistCategory = {
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

export const securityChecklist: ChecklistCategory = {
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

export const checklistCategories: ChecklistCategory[] = [productionChecklist, securityChecklist]
