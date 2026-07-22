import {
  Compass,
  Bot,
  FunctionSquare,
  Database,
  FormInput,
  GitBranch,
  Globe,
  Activity,
  ShieldCheck,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'

// Every fact, feature, and link in this curriculum is drawn from and verified
// against the official Netlify documentation at https://docs.netlify.com and the
// platform overview at https://www.netlify.com/platform. Anything that could not
// be confirmed in those sources was removed.

export type Role = 'admin' | 'developer' | 'builder'

export type Priority = 'core' | 'recommended' | 'optional'

export type DocLink = { label: string; url: string }

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type PlatformSection = 'Create' | 'Ship' | 'Scale' | 'Secure'

export type Module = {
  id: string
  section: PlatformSection
  title: string
  tagline: string
  icon: LucideIcon
  time: string
  overview: string
  /** Per-role framing — why this module matters for each audience. */
  roleFocus: Record<Role, string>
  /** Relative importance of the module for each role. */
  priority: Record<Role, Priority>
  concepts: string[]
  bestPractices: string[]
  docs: DocLink[]
  checklist: string[]
  quiz: QuizQuestion[]
}

export const roles: { id: Role; label: string; blurb: string; est: string }[] = [
  {
    id: 'admin',
    label: 'Admin',
    blurb:
      'Team owners and account admins who govern access, billing, security posture, and org-wide standards.',
    est: 'Focus: Secure, Scale',
  },
  {
    id: 'developer',
    label: 'Developer',
    blurb:
      'Engineers who build and ship with functions, edge, data, and the Git-connected deploy workflow.',
    est: 'Focus: Create, Ship',
  },
  {
    id: 'builder',
    label: 'Internal Builder',
    blurb:
      'Marketers, designers, and makers who ship with AI agents, forms, and previews without deep backend work.',
    est: 'Focus: Create, Ship',
  },
]

export const sectionOrder: PlatformSection[] = ['Create', 'Ship', 'Scale', 'Secure']

export const sectionMeta: Record<PlatformSection, { label: string; blurb: string }> = {
  Create: { label: 'Create', blurb: 'Build with AI agents and platform primitives.' },
  Ship: { label: 'Ship', blurb: 'Iterate more, break less, with Git-connected deploys and previews.' },
  Scale: { label: 'Scale', blurb: 'The edge network, delivery, and observability your app needs to grow.' },
  Secure: { label: 'Secure', blurb: 'Access control, governance, and data protection for teams.' },
}

const D = 'https://docs.netlify.com'

export const modules: Module[] = [
  // ---------------------------------------------------------------- CREATE
  {
    id: 'foundations',
    section: 'Create',
    title: 'Platform Foundations',
    tagline: 'What Netlify is and how work flows through it',
    icon: Compass,
    time: '45–60 min',
    overview:
      'Netlify is a composable web platform: you connect a Git repository, Netlify builds it, and every deploy is an immutable, atomic snapshot served from a global edge network. Start here to build a shared mental model of primitives, the deploy lifecycle, and the vocabulary the rest of onboarding uses.',
    roleFocus: {
      admin: 'Understand the platform you govern and the primitives your teams will adopt.',
      developer: 'Ground yourself in the architecture before you build features on top of it.',
      builder: 'Learn the core ideas — deploys, previews, primitives — in plain terms.',
    },
    priority: { admin: 'core', developer: 'core', builder: 'core' },
    concepts: [
      'Composable web platform: frontend framework + backend primitives on one deploy.',
      'Immutable, atomic deploys — every deploy is a complete versioned snapshot.',
      'Git-connected continuous deployment as the default workflow.',
      'Platform primitives: Functions, Edge Functions, Blobs, Database, Image CDN, Forms.',
    ],
    bestPractices: [
      'Adopt Git-connected continuous deployment rather than manual uploads so every change is versioned and reviewable.',
      'Learn the glossary early — shared terms (deploy context, primitive, publish directory) prevent miscommunication across roles.',
      'Prefer platform primitives over bolted-on third-party services when a Netlify primitive covers the need.',
    ],
    docs: [
      { label: 'What is Netlify?', url: `${D}/start/what-is-netlify/` },
      { label: 'Core concepts: Primitives', url: `${D}/start/core-concepts/primitives/` },
      { label: 'Core concepts: Version control', url: `${D}/start/core-concepts/version-control/` },
      { label: 'Glossary', url: `${D}/start/glossary/` },
      { label: 'Deploy overview', url: `${D}/deploy/deploy-overview/` },
    ],
    checklist: [
      'Read "What is Netlify?" and skim the glossary.',
      'Create or join your team and open the Team overview.',
      'Identify which primitives your first project will use.',
      'Bookmark the docs sections most relevant to your role.',
    ],
    quiz: [
      {
        question: 'What makes a Netlify deploy "atomic"?',
        options: [
          'It minifies all assets automatically',
          'Each deploy is a complete, immutable snapshot you can roll back to instantly',
          'It only deploys files that changed',
          'It requires manual approval before going live',
        ],
        correctIndex: 1,
        explanation:
          'Atomic, immutable deploys mean every deploy is a full versioned snapshot, which is what makes instant rollbacks possible.',
      },
      {
        question: 'What is the default way to get code onto Netlify?',
        options: [
          'Manual FTP uploads',
          'Emailing a zip to support',
          'Git-connected continuous deployment',
          'Editing files in production',
        ],
        correctIndex: 2,
        explanation:
          'Connecting a Git repository enables continuous deployment: Netlify builds and deploys on every push.',
      },
    ],
  },
  {
    id: 'build-with-ai',
    section: 'Create',
    title: 'Build with AI',
    tagline: 'Agent Runners, AI Gateway, MCP, and Skills',
    icon: Bot,
    time: '45–60 min',
    overview:
      'Netlify lets you build with AI in two directions: use AI agents to write and ship your code (Agent Runners, the MCP Server, and Netlify Skills), and add AI features to your app without managing API keys (AI Gateway). This module primes every role to work alongside AI on the platform.',
    roleFocus: {
      admin: 'Set expectations and guardrails for how teams use Agent Runners and AI Gateway.',
      developer: 'Wire the MCP Server and AI Gateway into your workflow and app code.',
      builder: 'Use Agent Runners from the dashboard to create and iterate without hand-writing code.',
    },
    priority: { admin: 'recommended', developer: 'core', builder: 'core' },
    concepts: [
      'Agent Runners: prompt an AI agent from the Netlify dashboard to create, fix, and ship code with your project context.',
      'AI Gateway: call OpenAI, Anthropic, or Google Gemini models from server code without managing your own API keys.',
      'Netlify MCP Server: lets code agents create projects, deploy, and manage config through the Netlify API/CLI.',
      'Netlify Skills: focused, factual context files that make AI agents accurate about the platform.',
    ],
    bestPractices: [
      'Install Netlify Skills and the MCP Server so your AI agents get accurate, up-to-date platform context instead of guessing.',
      'Use AI Gateway for inference so provider API keys stay off your machines and out of your repo.',
      'Review the security and privacy guidance for AI features before sending production or user data to a model.',
    ],
    docs: [
      { label: 'Build with AI overview', url: `${D}/build/build-with-ai/overview/` },
      { label: 'Agent Runners overview', url: `${D}/build/build-with-ai/agent-runners/overview/` },
      { label: 'AI Gateway overview', url: `${D}/build/ai-gateway/overview/` },
      { label: 'Security & privacy for AI features', url: `${D}/build/build-with-ai/security-and-privacy-for-ai-features/` },
    ],
    checklist: [
      'Open Agent Runners in the dashboard and read how a run works.',
      'Review the AI Gateway overview and supported providers.',
      'Install Netlify Skills / MCP Server for your AI coding agent (developers).',
      'Read the AI security & privacy guidance.',
    ],
    quiz: [
      {
        question: 'What problem does Netlify AI Gateway solve?',
        options: [
          'It hosts your own fine-tuned models',
          'It lets you call AI models from server code without managing provider API keys',
          'It replaces your Git provider',
          'It generates images at build time',
        ],
        correctIndex: 1,
        explanation:
          'AI Gateway provides access to models from providers like OpenAI, Anthropic, and Google without you managing API keys.',
      },
      {
        question: 'What are Agent Runners used for?',
        options: [
          'Running scheduled cron jobs',
          'Prompting an AI agent from the dashboard to create, fix, and ship code with your project context',
          'Load-testing your site',
          'Managing DNS records',
        ],
        correctIndex: 1,
        explanation:
          'Agent Runners let you prompt AI agents (e.g. Claude Code, Gemini, Codex) directly from your Netlify dashboard.',
      },
    ],
  },
  {
    id: 'functions-edge',
    section: 'Create',
    title: 'Functions, Edge & Async',
    tagline: 'Serverless, edge, background, and scheduled compute',
    icon: FunctionSquare,
    time: '60–90 min',
    overview:
      'Netlify runs your server-side logic without a server to manage. Serverless Functions handle on-demand APIs, Edge Functions run low-latency logic close to visitors, and Async Workloads (including background and scheduled functions) handle long-running and event-driven jobs.',
    roleFocus: {
      admin: 'Know the invocation and usage models so you can reason about billing and limits.',
      developer: 'Choose the right compute primitive per use case and test it locally.',
      builder: 'Understand what serverless can do so you can scope ideas realistically.',
    },
    priority: { admin: 'optional', developer: 'core', builder: 'recommended' },
    concepts: [
      'Serverless Functions: on-demand, server-side code for APIs and dynamic logic.',
      'Edge Functions: TypeScript/JavaScript that runs at the edge to modify requests and personalize responses.',
      'Background Functions for long-running work; Scheduled Functions for cron-style jobs.',
      'Async Workloads: durable, event-driven, multi-step workflows with retries.',
    ],
    bestPractices: [
      'Pick edge functions for request/response personalization and latency-sensitive logic; use serverless functions for heavier on-demand work.',
      'Configure a serverless function region close to your data source to reduce latency.',
      'Reach for Async Workloads or Background Functions when work exceeds standard function time limits.',
      'Test functions locally with the Netlify CLI before deploying.',
    ],
    docs: [
      { label: 'Functions overview', url: `${D}/build/functions/overview/` },
      { label: 'Functions: get started', url: `${D}/build/functions/get-started/` },
      { label: 'Background Functions', url: `${D}/build/functions/background-functions/` },
      { label: 'Scheduled Functions', url: `${D}/build/functions/scheduled-functions/` },
      { label: 'Edge Functions overview', url: `${D}/build/edge-functions/overview/` },
      { label: 'Async Workloads overview', url: `${D}/build/async-workloads/overview/` },
    ],
    checklist: [
      'Create a hello-world serverless function and run it with netlify dev.',
      'Read the Edge Functions overview and note how it differs from serverless.',
      'Identify one task in your project suited to a scheduled or background function.',
      'Review the function limits for your plan.',
    ],
    quiz: [
      {
        question: 'When should you prefer an Edge Function over a serverless Function?',
        options: [
          'For long batch-processing jobs',
          'For low-latency logic that modifies requests/responses close to the visitor',
          'For storing large files',
          'For sending scheduled emails',
        ],
        correctIndex: 1,
        explanation:
          'Edge Functions run at the edge for fast, personalized request/response handling; heavier on-demand work suits serverless Functions.',
      },
      {
        question: 'Which primitive fits a recurring, cron-style job?',
        options: ['Edge Function', 'Scheduled Function', 'Image CDN', 'Blobs'],
        correctIndex: 1,
        explanation: 'Scheduled Functions run serverless code on a regular, consistent schedule.',
      },
    ],
  },
  {
    id: 'data-storage',
    section: 'Create',
    title: 'Data, Storage & Caching',
    tagline: 'Netlify Database, Blobs, Image CDN, and caching',
    icon: Database,
    time: '60–90 min',
    overview:
      'Netlify offers managed storage primitives so you rarely need to leave the platform. Netlify Database is a zero-config Postgres with isolated database branches; Netlify Blobs is a key/value object store for unstructured data; the Image CDN transforms images on demand; and caching controls keep delivery fast.',
    roleFocus: {
      admin: 'Understand which data primitives are in use for governance and billing.',
      developer: 'Choose Database vs. Blobs correctly and cache responses deliberately.',
      builder: 'Know that structured and file storage are available without extra vendors.',
    },
    priority: { admin: 'optional', developer: 'core', builder: 'optional' },
    concepts: [
      'Netlify Database: fully integrated Postgres with isolated branches and platform-managed migrations.',
      'Netlify Blobs: key/value store for files and unstructured data, usable from functions and edge functions.',
      'Image CDN: on-demand image transformation without impacting build times.',
      'Caching: Cache-Control headers, cache key variations, and cache purging by site or tag.',
    ],
    bestPractices: [
      'Use Netlify Database for relational, queryable data; use Blobs for files and unstructured key/value data.',
      'Serve and transform images through the Image CDN instead of committing many pre-sized variants.',
      'Set deliberate Cache-Control headers and use cache key variations to raise cache hit rates.',
      'Add durable caching to serverless function responses where appropriate.',
    ],
    docs: [
      { label: 'Netlify Database', url: `${D}/build/data-and-storage/netlify-database/` },
      { label: 'Netlify Blobs overview', url: `${D}/build/data-and-storage/netlify-blobs/` },
      { label: 'Image CDN', url: `${D}/build/image-cdn/overview/` },
      { label: 'Caching overview', url: `${D}/build/caching/caching-overview/` },
    ],
    checklist: [
      'Decide whether your project needs Database, Blobs, or both.',
      'Read how database branches map to deploy previews.',
      'Transform one image through the Image CDN.',
      'Review Cache-Control and cache key variation options.',
    ],
    quiz: [
      {
        question: 'Which storage primitive suits relational, queryable application data?',
        options: ['Netlify Blobs', 'Image CDN', 'Netlify Database', 'Environment variables'],
        correctIndex: 2,
        explanation:
          'Netlify Database is a managed Postgres for relational data; Blobs is for files and unstructured key/value data.',
      },
      {
        question: 'What does the Netlify Image CDN do?',
        options: [
          'Stores database records',
          'Transforms images on demand without impacting build times',
          'Runs scheduled jobs',
          'Manages DNS',
        ],
        correctIndex: 1,
        explanation: 'The Image CDN handles on-demand transformation and content negotiation automatically.',
      },
    ],
  },
  {
    id: 'forms',
    section: 'Create',
    title: 'Forms & User Input',
    tagline: 'Capture submissions without backend code',
    icon: FormInput,
    time: '30–45 min',
    overview:
      'Netlify Forms captures submissions straight from your HTML — no backend code or third-party form service. You get submission storage, email and Slack notifications, spam filtering, and API access to submissions.',
    roleFocus: {
      admin: 'Understand submission storage and sensitive-data handling for compliance.',
      developer: 'Wire up forms, notifications, and spam filtering; access submissions via API.',
      builder: 'Ship a working contact/signup form yourself, end to end.',
    },
    priority: { admin: 'optional', developer: 'recommended', builder: 'core' },
    concepts: [
      'Enable forms with HTML attributes or JavaScript submissions.',
      'Submissions are stored and viewable in the dashboard and via API.',
      'Notifications via email and Slack on new submissions.',
      'Spam filtering with honeypot fields, Akismet, and reCAPTCHA.',
    ],
    bestPractices: [
      'Add spam prevention (honeypot plus Akismet/reCAPTCHA) before you promote a form.',
      'Create a custom success page so submitters get clear confirmation.',
      'Include an email field so you can reply to submitters directly.',
      'Define a process for handling sensitive form data and who can access submissions.',
    ],
    docs: [
      { label: 'Forms setup', url: `${D}/manage/forms/setup/` },
      { label: 'Form spam filters', url: `${D}/manage/forms/spam-filters/` },
      { label: 'Form notifications', url: `${D}/manage/forms/notifications/` },
      { label: 'Form submissions', url: `${D}/manage/forms/submissions/` },
    ],
    checklist: [
      'Add a Netlify form to a page and deploy it.',
      'Enable a honeypot field and one additional spam filter.',
      'Configure an email or Slack notification.',
      'Submit a test entry and find it in the Forms tab.',
    ],
    quiz: [
      {
        question: 'How does Netlify Forms capture submissions?',
        options: [
          'You must write a custom backend server',
          'Directly from your HTML form markup — no backend code required',
          'Only through a paid third-party service',
          'By polling your database',
        ],
        correctIndex: 1,
        explanation: 'Netlify detects form markup at deploy time and captures submissions with no backend code.',
      },
      {
        question: 'Which is a documented Netlify Forms spam-prevention method?',
        options: ['IP banning only', 'Honeypot fields, Akismet, and reCAPTCHA', 'Disabling JavaScript', 'CAPTCHA emails'],
        correctIndex: 1,
        explanation: 'Netlify Forms supports honeypot fields, Akismet, and reCAPTCHA for spam filtering.',
      },
    ],
  },

  // ------------------------------------------------------------------ SHIP
  {
    id: 'deploys-previews',
    section: 'Ship',
    title: 'Deploys, Previews & Config',
    tagline: 'Continuous deployment, contexts, and rollbacks',
    icon: GitBranch,
    time: '60–90 min',
    overview:
      'Shipping on Netlify means Git-connected continuous deployment. Every push builds and deploys; pull requests get isolated Deploy Previews; branches get branch deploys; and any prior deploy can be rolled back instantly. Build configuration lives in netlify.toml, and deploy contexts let settings differ per environment.',
    roleFocus: {
      admin: 'Own deploy permissions, contexts, and rollback readiness across the team.',
      developer: 'Master build config, deploy contexts, environment variables, and previews.',
      builder: 'Use Deploy Previews to review and share changes before they go live.',
    },
    priority: { admin: 'core', developer: 'core', builder: 'core' },
    concepts: [
      'Continuous deployment builds and deploys on every push.',
      'Deploy Previews for pull requests; branch deploys for long-lived branches.',
      'Deploy contexts (production, deploy-preview, branch-deploy) scope settings.',
      'Instant rollbacks, build hooks, and file-based configuration via netlify.toml.',
      'Environment variables with scopes and per-context values.',
    ],
    bestPractices: [
      'Keep configuration in netlify.toml so build settings are versioned with your code.',
      'Use Deploy Previews to get stakeholder sign-off before merging.',
      'Store secrets as environment variables (UI/CLI/API) — never commit them to the repo.',
      'Scope environment variables to only the contexts and deploys that need them.',
      'Make sure the team knows how to roll back a deploy quickly when something breaks.',
    ],
    docs: [
      { label: 'Deploy overview', url: `${D}/deploy/deploy-overview/` },
      { label: 'Create deploys', url: `${D}/deploy/create-deploys/` },
      { label: 'Manage deploys (rollbacks)', url: `${D}/deploy/manage-deploys/manage-deploys-overview/` },
      { label: 'File-based configuration (netlify.toml)', url: `${D}/build/configure-builds/file-based-configuration/` },
      { label: 'Build hooks', url: `${D}/build/configure-builds/build-hooks/` },
      { label: 'Environment variables', url: `${D}/build/environment-variables/overview/` },
    ],
    checklist: [
      'Connect a repository and trigger a production deploy from a push.',
      'Open a pull request and review its Deploy Preview URL.',
      'Add a netlify.toml with build command, publish dir, and a redirect.',
      'Set an environment variable and scope it to a context.',
      'Practice rolling back to a previous deploy.',
    ],
    quiz: [
      {
        question: 'What does a Deploy Preview give you?',
        options: [
          'A minified production bundle',
          'An isolated preview URL for a pull request before it merges',
          'A rollback of the last deploy',
          'A DNS record',
        ],
        correctIndex: 1,
        explanation: 'Deploy Previews build pull requests to a unique URL so changes can be reviewed before merging.',
      },
      {
        question: 'Where should sensitive API keys live?',
        options: [
          'Hardcoded in source',
          'In a committed .env file',
          'In Netlify environment variables (UI/CLI/API), never in the repo',
          'In netlify.toml',
        ],
        correctIndex: 2,
        explanation: 'Secrets belong in environment variables and should never be committed to the repository.',
      },
    ],
  },

  // ----------------------------------------------------------------- SCALE
  {
    id: 'domains-network',
    section: 'Scale',
    title: 'Domains, HTTPS & Routing',
    tagline: 'Custom domains, DNS, certificates, redirects',
    icon: Globe,
    time: '45–60 min',
    overview:
      'Netlify serves your site from a global edge network with automatic HTTPS. This module covers connecting custom domains, choosing Netlify DNS vs. external DNS, certificate management, redirects and rewrites, and branded deploy subdomains.',
    roleFocus: {
      admin: 'Own domain strategy, DNS, and certificate management for the org.',
      developer: 'Configure redirects/rewrites and understand domain-to-deploy mapping.',
      builder: 'Understand how a custom domain and HTTPS get attached to a site.',
    },
    priority: { admin: 'core', developer: 'recommended', builder: 'optional' },
    concepts: [
      'Custom domains for production, branch, and preview URLs.',
      'Netlify DNS vs. external DNS configuration.',
      'Automatic HTTPS/SSL certificates (or bring your own).',
      'Redirects and rewrites; automatic deploy subdomains for branded preview URLs.',
    ],
    bestPractices: [
      'Keep domain, DNS, deploys, and certificates in one control plane where possible to simplify operations.',
      'When using external DNS, confirm your primary domain is a subdomain or www per the docs guidance.',
      'Set up a custom 404 page and consistent trailing-slash behavior before launch.',
      'Manage certificates carefully when you have many domain aliases to avoid rate limits.',
    ],
    docs: [
      { label: 'Understand custom domains', url: `${D}/manage/domains/domains-fundamentals/understand-domains/` },
      { label: 'HTTPS / SSL setup', url: `${D}/manage/domains/secure-domains-with-https/https-ssl/` },
      { label: 'Set up Netlify DNS', url: `${D}/manage/domains/set-up-netlify-dns/` },
      { label: 'Configure external DNS', url: `${D}/manage/domains/configure-domains/configure-external-dns/` },
      { label: 'Redirect options', url: `${D}/manage/routing/redirects/redirect-options/` },
      { label: 'Automatic deploy subdomains', url: `${D}/manage/domains/configure-domains/configure-an-automatic-subdomain-for-deploys/` },
    ],
    checklist: [
      'Add a custom domain to a project (or review the flow).',
      'Confirm HTTPS is provisioned for the domain.',
      'Add one redirect rule and verify it.',
      'Configure a branded deploy subdomain (optional).',
    ],
    quiz: [
      {
        question: 'What does Netlify provide for custom domains by default?',
        options: [
          'Manual certificate uploads only',
          'Automatic HTTPS/SSL certificates',
          'HTTP-only serving',
          'A required paid add-on for TLS',
        ],
        correctIndex: 1,
        explanation: 'Netlify provisions automatic HTTPS certificates, and you can also bring your own.',
      },
      {
        question: 'Where can redirects and rewrites be defined?',
        options: [
          'Only in your DNS provider',
          'In netlify.toml or a _redirects file',
          'Only by contacting support',
          'They are not supported',
        ],
        correctIndex: 1,
        explanation: 'Redirect and rewrite rules are configured via netlify.toml or a _redirects file.',
      },
    ],
  },
  {
    id: 'monitoring',
    section: 'Scale',
    title: 'Monitoring & Observability',
    tagline: 'Analytics, RUM, logs, and metrics',
    icon: Activity,
    time: '45–60 min',
    overview:
      'Once you are live, you need visibility. Netlify offers server-side Web Analytics, Real User Monitoring, an Observability dashboard, function metrics, logs and log drains, Lighthouse scoring, and deploy notifications so teams can spot and diagnose issues.',
    roleFocus: {
      admin: 'Stand up monitoring, notifications, and log drains for the whole team.',
      developer: 'Use logs, function metrics, and observability to debug production.',
      builder: 'Read analytics and performance trends to inform content and campaigns.',
    },
    priority: { admin: 'core', developer: 'recommended', builder: 'recommended' },
    concepts: [
      'Web Analytics: server-side traffic data with no client script required.',
      'Real User Monitoring (RUM) for real-world performance and usability.',
      'Observability dashboard, function metrics, and logs.',
      'Log Drains to stream logs to third-party monitoring services.',
    ],
    bestPractices: [
      'Enable Web Analytics early to establish a traffic and performance baseline.',
      'Add Real User Monitoring to catch usability and performance regressions from real visitors.',
      'Configure deploy and form notifications so the team hears about events in their existing channels.',
      'Use Log Drains to centralize logs with your existing monitoring stack.',
    ],
    docs: [
      { label: 'Monitoring overview', url: `${D}/manage/monitoring/overview/` },
      { label: 'Web Analytics', url: `${D}/manage/monitoring/web-analytics/overview/` },
      { label: 'Real User Monitoring', url: `${D}/manage/monitoring/real-user-monitoring/` },
      { label: 'Observability', url: `${D}/manage/monitoring/observability/overview/` },
      { label: 'Logs & Log Drains', url: `${D}/manage/monitoring/log-drains/` },
      { label: 'Notifications', url: `${D}/manage/monitoring/notifications/` },
    ],
    checklist: [
      'Enable Web Analytics on a project.',
      'Review the Observability dashboard and function metrics.',
      'Set up a deploy notification (e.g. Slack or email).',
      'Evaluate whether Log Drains fit your monitoring stack.',
    ],
    quiz: [
      {
        question: 'What is a key characteristic of Netlify Web Analytics?',
        options: [
          'It requires adding a heavy client-side script',
          'It is server-side and needs no client-side tracking script',
          'It only works on Enterprise',
          'It replaces your logs',
        ],
        correctIndex: 1,
        explanation: 'Netlify Web Analytics is server-side, so it does not depend on a client-side tracking script.',
      },
      {
        question: 'What do Log Drains let you do?',
        options: [
          'Delete old deploys',
          'Stream logs to third-party monitoring services',
          'Cache images',
          'Rotate secrets',
        ],
        correctIndex: 1,
        explanation: 'Log Drains stream your logs to external monitoring/observability providers.',
      },
    ],
  },

  // ---------------------------------------------------------------- SECURE
  {
    id: 'access-governance',
    section: 'Secure',
    title: 'Access & Team Governance',
    tagline: 'Basic auth, RBAC, SSO, 2FA, audit logs',
    icon: ShieldCheck,
    time: '45–60 min',
    overview:
      'Control who can reach your sites and who can act on your team. Netlify offers site access controls (password protection and HTTP basic authentication), role-based access control, SAML SSO and Directory Sync, enforced two-factor authentication, and a team audit log.',
    roleFocus: {
      admin: 'This is your core module: configure access, roles, SSO, 2FA, and auditing.',
      developer: 'Understand access controls that gate previews and protected environments.',
      builder: 'Know how protected previews and team roles affect what you can see and do.',
    },
    priority: { admin: 'core', developer: 'recommended', builder: 'optional' },
    concepts: [
      'Site access: password protection and HTTP basic authentication to gate visitors.',
      'Role-based access control (RBAC) and team roles & permissions.',
      'SAML single sign-on (team and organization) and Directory Sync (SCIM).',
      'Enforced two-factor authentication and the team audit log.',
    ],
    bestPractices: [
      'Protect non-production deploys with password protection or basic authentication so previews are not public.',
      'Grant each member the minimum permissions their role requires, and keep at least one backup Team Owner.',
      'Enforce SSO and two-factor authentication for the whole team where your plan supports it.',
      'Use Directory Sync to automatically provision and de-provision users.',
      'Review the team audit log regularly to monitor access and changes.',
    ],
    docs: [
      { label: 'Security overview', url: `${D}/manage/security/overview/` },
      { label: 'Secure access to sites', url: `${D}/manage/security/secure-access-to-sites/overview/` },
      { label: 'Password protection', url: `${D}/manage/security/secure-access-to-sites/password-protection/` },
      { label: 'HTTP basic authentication', url: `${D}/manage/security/secure-access-to-sites/basic-authentication-with-custom-http-headers/` },
      { label: 'Role-based access control', url: `${D}/manage/security/secure-access-to-sites/role-based-access-control/` },
      { label: 'Roles & permissions', url: `${D}/manage/accounts-and-billing/team-management/roles-and-permissions/` },
      { label: 'Team SAML SSO', url: `${D}/manage/security/secure-netlify-access/configure-team-saml-sso/` },
      { label: 'Directory Sync (SCIM)', url: `${D}/manage/security/secure-netlify-access/directory-sync/` },
      { label: 'Enforce 2FA', url: `${D}/manage/security/secure-netlify-access/enforce-2fa/` },
      { label: 'Team audit log', url: `${D}/manage/accounts-and-billing/team-management/team-audit-log/` },
    ],
    checklist: [
      'Enable password protection or basic auth on a non-production context.',
      'Review team roles and apply least-privilege permissions.',
      'Add a second Team Owner as backup.',
      'Enable 2FA; configure SSO/Directory Sync if on a supporting plan.',
      'Open the team audit log and review recent activity.',
    ],
    quiz: [
      {
        question: 'How can you keep non-production deploy previews from being publicly accessible?',
        options: [
          'Delete them after each build',
          'Use password protection or HTTP basic authentication',
          'Disable HTTPS',
          'Block search engines only',
        ],
        correctIndex: 1,
        explanation:
          'Password protection and basic authentication are documented site access controls for gating non-production deploys.',
      },
      {
        question: 'What is the recommended way to assign team permissions?',
        options: [
          'Give everyone Owner access',
          'Grant the minimum permissions each role requires (least privilege)',
          'Share one login',
          'Avoid roles entirely',
        ],
        correctIndex: 1,
        explanation: 'Least-privilege access with role-based permissions is the documented best practice.',
      },
    ],
  },
  {
    id: 'secure-builds-data',
    section: 'Secure',
    title: 'Secure Builds & Data',
    tagline: 'Secrets, scanning, CSP, and traffic protection',
    icon: KeyRound,
    time: '45–60 min',
    overview:
      'Protect your code, secrets, and users. Netlify provides the Secrets Controller and secret scanning, Content Security Policy support, rate limiting, traffic rules and a web application firewall, private connectivity, and a security scorecard to track your posture.',
    roleFocus: {
      admin: 'Set org-wide secret, CSP, and traffic-protection standards.',
      developer: 'Implement secret hygiene, CSP, and rate limiting in your projects.',
      builder: 'Follow the secret-handling rules and understand why they exist.',
    },
    priority: { admin: 'core', developer: 'core', builder: 'recommended' },
    concepts: [
      'Secrets Controller and secret scanning of code and build output.',
      'Content Security Policy (CSP) to mitigate XSS and data exfiltration.',
      'Rate limiting, traffic rules, and a web application firewall.',
      'Private connectivity and a security scorecard to track posture.',
    ],
    bestPractices: [
      'Store secrets via the Netlify UI, CLI, or API — never in netlify.toml, .env files in the repo, or source code.',
      'Flag sensitive values with the Secrets Controller and rely on secret scanning to catch leaks.',
      'Generate unique secrets per site and define a rotation process for compromised values.',
      'Add a Content Security Policy to reduce cross-site scripting and data exfiltration risk.',
      'Use rate limiting and traffic rules to protect APIs and sites from abuse.',
    ],
    docs: [
      { label: 'Secrets Controller', url: `${D}/build/environment-variables/secrets-controller/` },
      { label: 'Secret scanning', url: `${D}/manage/security/secret-scanning/` },
      { label: 'Content Security Policy', url: `${D}/manage/security/content-security-policy/` },
      { label: 'Rate limiting', url: `${D}/manage/security/secure-access-to-sites/rate-limiting/` },
      { label: 'Traffic rules', url: `${D}/manage/security/secure-access-to-sites/traffic-rules/` },
      { label: 'Web application firewall', url: `${D}/manage/security/secure-access-to-sites/web-application-firewall/` },
      { label: 'Private connectivity', url: `${D}/manage/security/private-connectivity/` },
      { label: 'Security scorecard', url: `${D}/manage/security/security-scorecard/` },
    ],
    checklist: [
      'Move any hardcoded secrets into Netlify environment variables.',
      'Enable the Secrets Controller for sensitive values and confirm secret scanning.',
      'Add a Content Security Policy to a project.',
      'Evaluate rate limiting / traffic rules for public endpoints.',
      'Review your security scorecard.',
    ],
    quiz: [
      {
        question: 'Where should secrets NOT be stored?',
        options: [
          'Netlify environment variables via the UI',
          'The Secrets Controller',
          'netlify.toml or a committed .env file',
          'Via the Netlify CLI',
        ],
        correctIndex: 2,
        explanation:
          'Secrets should never live in netlify.toml, committed .env files, or source — use environment variables and the Secrets Controller.',
      },
      {
        question: 'What does a Content Security Policy help prevent?',
        options: [
          'Slow builds',
          'Cross-site scripting (XSS) and data exfiltration',
          'DNS propagation delays',
          'Large image files',
        ],
        correctIndex: 1,
        explanation: 'A CSP restricts allowed sources to help prevent XSS and user-data exfiltration.',
      },
    ],
  },
]

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}

export const priorityRank: Record<Priority, number> = { core: 0, recommended: 1, optional: 2 }

export const priorityLabel: Record<Priority, string> = {
  core: 'Core',
  recommended: 'Recommended',
  optional: 'Optional',
}
