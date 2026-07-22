// Prompt Library data. Kept in its own module so both the /prompts route and the
// global search index can consume it without a circular dependency on the route.

export type Track = 'admin' | 'developer' | 'builder' | 'all'

export type Prompt = {
  title: string
  description: string
  prompt: string
  category: string
  track: Track
}

export const prompts: Prompt[] = [
  {
    title: 'Deploy Troubleshooting',
    description: 'Diagnose and fix a failed deploy.',
    prompt:
      'I have a Netlify deploy that failed with the following error: [paste error]. Help me diagnose the issue, explain what caused it, and give step-by-step instructions to fix it.',
    category: 'Debugging',
    track: 'developer',
  },
  {
    title: 'Netlify Functions Setup',
    description: 'Create a serverless function from scratch.',
    prompt:
      'Help me create a Netlify serverless Function that [describe purpose]. It should handle [HTTP method] requests, validate the input, and return a proper JSON response. Include error handling and TypeScript types.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Edge Function Guide',
    description: 'Build a performant edge function.',
    prompt:
      'I need a Netlify Edge Function that [describe use case — e.g., geolocation redirect, A/B test, request rewrite]. Show the code with TypeScript types, explain how it differs from a serverless function, and how to test it locally with netlify dev.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Choose a Storage Primitive',
    description: 'Decide between Netlify Database and Blobs.',
    prompt:
      'My feature needs to store [describe data]. Help me decide between Netlify Database (Postgres) and Netlify Blobs, explain the trade-offs, and outline how I would read and write the data from a serverless function.',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Redirect & Rewrite Rules',
    description: 'Configure redirects and rewrites.',
    prompt:
      'Help me set up Netlify redirect rules for these scenarios: [list scenarios]. Explain the difference between redirects and rewrites, when to use a _redirects file vs netlify.toml, and how to handle trailing slashes and query parameters.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Environment Variables Strategy',
    description: 'Organize variables across deploy contexts.',
    prompt:
      'Help me organize Netlify environment variables for a project with [describe environments]. Cover deploy contexts, scoping variables to specific contexts, and best practices for keeping secrets out of the repository.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Branch Deploy Strategy',
    description: 'Set up contexts and preview workflow.',
    prompt:
      'Help me design a branch and deploy-context strategy: production from main, a staging branch deploy, and Deploy Previews for pull requests. Explain deploy contexts, branch subdomains, and how to share preview URLs with reviewers.',
    category: 'Configuration',
    track: 'all',
  },
  {
    title: 'Form Handling Setup',
    description: 'Set up Netlify Forms with spam filtering.',
    prompt:
      'Help me set up a Netlify [contact/signup/feedback] form. Include the HTML markup with the right attributes, honeypot plus an additional spam filter, email/Slack notifications, and how to view submissions.',
    category: 'Development',
    track: 'builder',
  },
  {
    title: 'Performance Optimization',
    description: 'Tune caching, images, and Core Web Vitals.',
    prompt:
      'Review my Netlify site performance. Help me optimize build time, Cache-Control headers and cache key variations, image delivery with Netlify Image CDN, and Core Web Vitals. My framework is [describe framework].',
    category: 'Development',
    track: 'developer',
  },
  {
    title: 'Access Control & Security Audit',
    description: 'Review site and team access controls.',
    prompt:
      'Perform a security review for our Netlify setup. Cover: HTTPS/HSTS, security headers and Content Security Policy, password protection / basic auth for non-production deploys, role-based access control, environment variable and secret hygiene, and secret scanning.',
    category: 'Security',
    track: 'admin',
  },
  {
    title: 'SSO & Team Governance Plan',
    description: 'Plan SSO, roles, and provisioning.',
    prompt:
      'Help me plan team governance for Netlify. Cover SAML single sign-on, enforced two-factor authentication, Directory Sync (SCIM) for provisioning, least-privilege role assignment, keeping a backup Team Owner, and reviewing the team audit log.',
    category: 'Team Management',
    track: 'admin',
  },
  {
    title: 'Secret Rotation Runbook',
    description: 'Define a process to rotate compromised secrets.',
    prompt:
      'Write a runbook for rotating a compromised secret on Netlify. Include using the Secrets Controller, generating unique secrets per site, updating environment variables via UI/CLI/API, triggering a redeploy, and confirming secret scanning is clean.',
    category: 'Security',
    track: 'admin',
  },
  {
    title: 'Team Onboarding Checklist',
    description: 'Onboard a new team member.',
    prompt:
      'Create an onboarding checklist for a new member of our Netlify team. Include account setup, 2FA, role/permission assignment, key docs to read, dashboard familiarization, and first-week tasks. Our project uses [describe stack].',
    category: 'Team Management',
    track: 'builder',
  },
  {
    title: 'Analytics & Performance Review',
    description: 'Interpret analytics and RUM data.',
    prompt:
      'Help me read our Netlify Web Analytics and Real User Monitoring data. Explain the key metrics, how to spot performance and traffic trends, and what actions to take from common patterns.',
    category: 'Analytics',
    track: 'builder',
  },
  {
    title: 'Migration Planning',
    description: 'Plan a migration to Netlify.',
    prompt:
      'We are migrating from [current platform] to Netlify. Our setup includes [describe infrastructure]. Create a migration plan covering DNS, build configuration, environment variables, redirects from old URLs, HTTPS certificates, and a rollback strategy.',
    category: 'Planning',
    track: 'all',
  },
]

export const promptCategories = Array.from(new Set(prompts.map((p) => p.category)))

export const trackLabels: Record<Track, string> = {
  admin: 'Admin',
  developer: 'Developer',
  builder: 'Internal Builder',
  all: 'All Roles',
}
