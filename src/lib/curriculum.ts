import {
  Compass,
  Bot,
  BotOff,
  Boxes,
  CreditCard,
  Rocket,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  FunctionSquare,
  Database,
  DatabaseZap,
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

/**
 * A subsection of a module. Large modules teach several distinct capabilities
 * that each deserve their own page, knowledge check, and activities — when a
 * module has lessons, its own page becomes a landing page that routes into
 * them rather than teaching the material itself.
 */
export type Lesson = {
  id: string
  title: string
  tagline: string
  icon: LucideIcon
  time: string
  /** Optional heading the parent landing page groups this lesson under. */
  group?: string
  /** One-line framing used on the parent module's landing page card. */
  summary: string
  /** Opening paragraph of the lesson page. */
  overview: string
  /** Set when the lesson covers a capability that is not on every plan. */
  addOn?: { label: string; note: string }
  concepts: string[]
  bestPractices: string[]
  docs: DocLink[]
  checklist: string[]
  quiz: QuizQuestion[]
}

/** A short "also worth knowing" pointer shown under a module's lessons. */
export type FurtherTopic = {
  title: string
  note: string
  url: string
  icon: LucideIcon
}

export type Module = {
  id: string
  section: PlatformSection
  title: string
  tagline: string
  icon: LucideIcon
  time: string
  overview: string
  /**
   * Set on modules covering a capability that is not part of every plan, so the
   * UI can badge it and state the entitlement up front.
   */
  addOn?: { label: string; note: string }
  /** Per-role framing — why this module matters for each audience. */
  roleFocus: Record<Role, string>
  /** Relative importance of the module for each role. */
  priority: Record<Role, Priority>
  concepts: string[]
  bestPractices: string[]
  docs: DocLink[]
  /**
   * Subsections. When set, the module page lists them instead of teaching the
   * material itself, and `checklist`/`quiz` move down into each lesson.
   */
  lessons?: Lesson[]
  /** Ordered group headings for the lesson cards on the landing page. */
  lessonGroups?: string[]
  /** Short "also worth knowing" pointers shown under the lessons. */
  furtherTopics?: FurtherTopic[]
  checklist?: string[]
  quiz?: QuizQuestion[]
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
    tagline: 'Agent Runners, AI Gateway, prototyping, and the guardrails around them',
    icon: Bot,
    time: '2.5–3.5 hrs',
    overview:
      'Netlify supports AI in three directions, and this section is organised around them. You can have AI agents write and ship your code — from the dashboard with Agent Runners, or from your own editor with the MCP Server and agent skills. You can put AI models inside your own app with AI Gateway, build tools and code agents on Netlify’s APIs, and keep your content readable by the crawlers those tools use. And because all of it consumes credits and sends data to model providers, you can govern it: turn features on or off, set spend limits, and know exactly what each provider stores. Work through the subsections below in any order — each one is self-contained, with its own knowledge check and activities.',
    roleFocus: {
      admin:
        'Three of the nine subsections are written for you: enabling AI features, the security and privacy posture, and how credits are consumed and capped. Read those first, then skim Agent Runners so you know what you are authorising.',
      developer:
        'Your core path runs through Agent Runners, agent setup (MCP Server and skills), and AI Gateway. Building AI tools & code agents and the Prerender subsection matter when you are shipping AI products rather than just using AI.',
      builder:
        'Agent Runners and prototyping are your subsections — they let you create and iterate from the dashboard or a codegen tool with no local setup. Skim credits so you know what a prompt costs.',
    },
    priority: { admin: 'recommended', developer: 'core', builder: 'core' },
    concepts: [
      'Two directions: use AI to build your project (Agent Runners, agent setup guides, prototyping) and add AI to your project (AI Gateway, code agents, crawler-readable content).',
      'Agent Runners and AI Gateway are both available on credit-based plans only — Free, Personal, and Pro — and both draw on the same pool of plan credits through the AI inference usage meter.',
      'AI inference converts model usage to spend at a fixed rate: every $1 USD of provider token usage becomes 180 Netlify credits.',
      'A Team Owner controls whether AI features are on for the whole team, and can cap AI inference spend team-wide and per member.',
      'Netlify’s model providers are contractually not permitted to train on inputs received through Netlify, and AI Gateway stores no prompts or outputs.',
      'AI features are on by default for credit-based Free, Personal, and Pro plans, and off by default for Enterprise.',
    ],
    bestPractices: [
      'Decide the direction before you pick a tool: Agent Runners writes your code, AI Gateway puts a model inside your product. They are billed the same way but solve different problems.',
      'Give every agent real Netlify context — the MCP Server and agent skills — before blaming an agent for platform mistakes it had no way to know about.',
      'Set an AI Credit Usage Limit and a per-member limit before you hand Agent Runners to a whole team, not after the first surprising invoice.',
      'Read the security and privacy subsection before sending production or customer data through any AI feature, and remember that verifying model output is your responsibility, not the provider’s.',
      'Keep AI work on previews: agent runs branch off production and open a Deploy Preview, so review the preview rather than trusting the run summary.',
    ],
    docs: [
      { label: 'Build with AI overview', url: `${D}/build/build-with-ai/overview/` },
      { label: 'Agent Runners overview', url: `${D}/build/build-with-ai/agent-runners/overview/` },
      { label: 'AI Gateway overview', url: `${D}/build/ai-gateway/overview/` },
      { label: 'Prototyping best practices', url: `${D}/build/build-with-ai/prototyping-best-practices/` },
    ],
    lessonGroups: ['Build with AI agents', 'Add AI to your app', 'Govern and pay for AI'],
    lessons: [
      // ---- Build with AI agents -------------------------------------------
      {
        id: 'agent-runners',
        title: 'Agent Runners',
        tagline: 'Prompt an AI agent from your dashboard, review the Deploy Preview',
        icon: Bot,
        time: '25–30 min',
        group: 'Build with AI agents',
        summary:
          'Run Claude Code, Codex, Gemini, or OpenCode on your project from the Netlify dashboard — no local setup, no extra accounts — and review the result as a Deploy Preview.',
        overview:
          'Agent Runners let you prompt an AI agent to create a project, fix a bug, or ship a change using your project’s own context, straight from the Netlify dashboard or your phone. Netlify runs the agent for you, so there is no local setup and no separate account with an AI provider. The agent gets secure access to your project context, environment variables, build settings, and deploy pipeline — things an agent running on your laptop simply does not have — then branches off your production branch and opens a Deploy Preview for you to review before anything reaches production.',
        addOn: {
          label: 'Credit-based plans',
          note: 'Agent Runners are available on credit-based plans only — Free, Personal, and Pro. On an Enterprise plan, reach out to your Account Manager. You also need a Team Owner, Developer, Internal Builder, or Publisher role, AI features left on by your Team Owner, and credits available on the team.',
        },
        concepts: [
          'Four agents are supported: Claude Code, OpenAI Codex, Google Gemini, and OpenCode. OpenCode serves a rotating selection of current coding models in partnership with OpenRouter, routed only to providers with a Zero Data Retention policy.',
          'Two run modes: Build (the default) changes code and creates a Deploy Preview; Ask answers questions about the project without touching code or creating a preview.',
          'By default each agent picks its own model and reasoning effort per run. You can override both per agent — the setting is a personal preference that follows you across projects, not a team or project setting.',
          'Models are ranked 1–5 for cost in the picker. Pricier models give better visual fidelity and stronger self-verification; on a Free plan a single prompt can consume most of your credits.',
          'Runs branch off your production branch onto a new automated branch by default. You can target a branch deploy from the UI or with --branch in the CLI, and you can start a run from any deploy details page with Run AI agent.',
          'Agent runs consume two meters: AI inference for the model usage, and compute (GB-hours) for the environment the agent works in.',
          'Redeploying a completed run rebuilds its Deploy Preview against updated environment variables or build settings without re-running the agent — so it costs no AI inference credits.',
          'If credits run out mid-run, Netlify keeps the agent’s progress and cancels the run; select Continue once the team has credits again.',
          'Real limits: GitHub is the only supported Git provider for connected projects, Split Testing must be disabled, and your plan caps how many runs can be active at once.',
        ],
        bestPractices: [
          'Use Ask mode to build a plan with a strong model, then switch to Build mode with a cheaper one to implement it — you pay top rates only for the thinking.',
          'Reach for Agent Runners on the work it is optimised for: async maintenance, well-defined bug fixes and content updates, quick landing or 404 pages, and jumpstarting a platform primitive.',
          'Try one prompt across a few agents and models while ideating; settle on a cheaper model for small iterations once you know what the project needs.',
          'Review the Deploy Preview, not the run summary, before publishing to production.',
          'Redeploy the run rather than re-prompting when all that changed was an environment variable or a build setting.',
        ],
        docs: [
          { label: 'Agent Runners overview', url: `${D}/build/build-with-ai/agent-runners/overview/` },
          {
            label: 'Make changes with Agent Runners',
            url: `${D}/build/build-with-ai/agent-runners/make-changes-with-agent-runners/`,
          },
          {
            label: 'Prompt examples for Agent Runners',
            url: `${D}/build/build-with-ai/agent-runners/prompt-examples-for-agent-runners/`,
          },
          {
            label: 'Create a new project with an AI agent',
            url: `${D}/start/quickstarts/create-new-project-with-ai-agent/`,
          },
          { label: 'Fix a failed deploy', url: `${D}/resources/troubleshooting/fix-a-failed-deploy/` },
        ],
        checklist: [
          'Confirm your team is on a credit-based plan, that AI features are on, and that your role can start a run.',
          'Start an Ask-mode run and ask the agent a question about your project without changing any code.',
          'Start a Build-mode run for a small, well-defined fix and read the Deploy Preview it produces.',
          'Open the agent configuration modal and compare the cost ranking of two models for the same agent.',
          'Open a completed run’s detail view and note how many credits the run consumed.',
        ],
        quiz: [
          {
            question: 'What does an Agent Runners Build-mode run produce?',
            options: [
              'A direct commit to your production branch',
              'Code changes on a new branch plus a Deploy Preview to review',
              'A pull request you must merge before anything builds',
              'A text plan with no code changes',
            ],
            correctIndex: 1,
            explanation:
              'Build mode is the default: the agent changes code on a branch off production and creates a Deploy Preview so you can review before shipping. Ask mode is the one that changes nothing.',
          },
          {
            question: 'Which two usage meters does a single agent run consume?',
            options: [
              'Bandwidth and web requests',
              'AI inference and compute',
              'AI inference only',
              'Production deploys and bandwidth',
            ],
            correctIndex: 1,
            explanation:
              'AI inference covers the model usage during the run and compute (measured in GB-hours) covers the environment the agent works in.',
          },
          {
            question: 'Your team runs out of credits while an agent is working. What happens?',
            options: [
              'The run finishes anyway and the balance goes negative',
              'The agent’s progress is discarded and the run fails',
              'Netlify keeps the progress made and cancels the run, and you select Continue once you have credits again',
              'The run is queued until the next billing cycle and resumes automatically',
            ],
            correctIndex: 2,
            explanation:
              'Progress is preserved and the run is cancelled. Once the team has credits — through a reset, an upgrade, or a credit pack — Continue resumes the task.',
          },
          {
            question: 'Which project setup blocks Agent Runners?',
            options: [
              'A project connected to a GitLab repository',
              'A project with serverless functions',
              'A project using Netlify Database',
              'A project with a custom domain',
            ],
            correctIndex: 0,
            explanation:
              'For Git-connected projects, GitHub is the only supported provider — GitLab, Bitbucket, and Azure DevOps are not. Split Testing also has to be disabled.',
          },
        ],
      },
      {
        id: 'agent-setup',
        title: 'Agent setup, MCP Server & Skills',
        tagline: 'Give the agent in your own editor real Netlify context',
        icon: Terminal,
        time: '20–25 min',
        group: 'Build with AI agents',
        summary:
          'Connect Claude Code, Codex, Cursor, or any other agent to the Netlify MCP Server and install Netlify agent skills so it stops guessing at platform details.',
        overview:
          'Agent Runners covers agents that Netlify runs for you. This subsection covers the other case: the agent already running in your editor, terminal, or AI platform. Out of the box those agents know a mix of accurate and outdated Netlify facts, so the fix is to hand them two things — the Netlify MCP Server, which gives them working tools built on the Netlify API and CLI, and Netlify agent skills, which give them focused, factual context per feature. The fastest possible start is a single prompt: `fetch https://netlify.ai to help me deploy and build with Netlify using the latest agent skills`.',
        concepts: [
          'The Netlify MCP Server exposes Netlify expertise and the Netlify CLI to your agent as tools. `npx -y add-mcp https://netlify-mcp.netlify.app/mcp` walks you through configuring the agents you use.',
          'The remote MCP server is the recommendation because it always carries the latest capabilities; a local server (`npx -y add-mcp "npx -y @netlify/mcp"`) exists for environments that require one.',
          'Several clients have their own official install route: Claude Code and Codex via their own commands, Claude Web and Claude Desktop via the Netlify Connector, ChatGPT via the Netlify app, Antigravity and its CLI directly, and Cursor, LM Studio, and VS Code via one-click install links.',
          'Agent skills are focused context files per platform feature. `npx skills add netlify/context-and-tools --skill \'*\' --yes` installs the full set into your project or repository from any terminal or agent chat.',
          'Skills cover the primitives you actually build with: functions, edge functions, Blobs, Database, Image CDN, Forms, netlify.toml configuration, the CLI and deploys, framework adapters, caching, and AI Gateway.',
          'Some agents can invoke a skill by name — Claude Code uses /<skill-name> — so you can point the agent at exactly the context a task needs.',
          'Agent Runners already apply agent skills automatically, so you do not invoke them there. Skills are for the agents you run yourself.',
          'For raw documentation context, https://docs.netlify.com/llms.txt is the complete index, and appending .md to any docs URL returns that page as Markdown.',
        ],
        bestPractices: [
          'Install the MCP Server and the skills before your first real task — most "the AI got Netlify wrong" moments are missing context, not a weak model.',
          'Prefer the remote MCP server unless your environment forbids it, so your agent picks up new capabilities without you re-installing anything.',
          'Commit the installed skills into your repository so every agent and every teammate works from the same platform context.',
          'Use context or rule files in whatever format your tool expects, and point them at llms.txt so the agent can fetch current docs instead of recalling stale ones.',
          'Check the agent-specific setup guide for your tool rather than assuming the generic command is best — several clients have a first-class connector or one-click install.',
        ],
        docs: [
          {
            label: 'Agent setup overview',
            url: `${D}/build/build-with-ai/agent-setup-guides/agent-setup-overview/`,
          },
          {
            label: 'Set up Claude Code for Netlify',
            url: `${D}/build/build-with-ai/agent-setup-guides/set-up-claude-code-for-netlify/`,
          },
          {
            label: 'Set up Codex for Netlify',
            url: `${D}/build/build-with-ai/agent-setup-guides/set-up-codex-for-netlify/`,
          },
          { label: 'Netlify MCP Server (GitHub)', url: 'https://github.com/netlify/netlify-mcp' },
          {
            label: 'Netlify agent skills repository',
            url: 'https://github.com/netlify/context-and-tools',
          },
        ],
        checklist: [
          'Connect your agent to the Netlify remote MCP server and confirm it can list your projects.',
          'Install the Netlify agent skills into a project with npx skills add netlify/context-and-tools.',
          'Ask your agent to write a Netlify function and check that it used the modern syntax from the netlify-functions skill.',
          'Read the setup guide for the specific agent you use and note anything the generic setup missed.',
          'Point your agent at https://docs.netlify.com/llms.txt and have it fetch a docs page as Markdown.',
        ],
        quiz: [
          {
            question: 'What does the Netlify MCP Server give an AI agent?',
            options: [
              'A hosted model to run inference against',
              'Netlify expertise plus tools built on the Netlify API and CLI',
              'A replacement for your Git provider',
              'Free credits for agent runs',
            ],
            correctIndex: 1,
            explanation:
              'The MCP server equips your agent with Netlify expertise and the Netlify CLI, so it can create projects, deploy, and manage configuration through real tools.',
          },
          {
            question: 'When do you not need to invoke Netlify agent skills yourself?',
            options: [
              'When using Claude Code locally',
              'When using Cursor',
              'When using Agent Runners, which apply them automatically',
              'When using the Netlify CLI',
            ],
            correctIndex: 2,
            explanation:
              'Agent Runners apply agent skills for you. Skills are something you install for agents you run yourself.',
          },
          {
            question: 'Which server does Netlify recommend connecting to, and why?',
            options: [
              'The local MCP server, because it is faster',
              'The remote MCP server, because it always has the most up-to-date capabilities',
              'Either — they are identical',
              'Neither; skills replace MCP entirely',
            ],
            correctIndex: 1,
            explanation:
              'The remote server is recommended so you always get the latest MCP capabilities. The local server exists for environments that require local servers.',
          },
        ],
      },
      {
        id: 'prototyping',
        title: 'Prototyping from zero to MVP',
        tagline: 'Prompt well, then claim the deployment',
        icon: Rocket,
        time: '20–25 min',
        group: 'Build with AI agents',
        summary:
          'How to write prompts that produce the thing you meant, gather feedback on the result, and turn a throwaway codegen preview into a project you can actually run.',
        overview:
          'Prototyping with AI has two halves that people usually only do one of. The first is prompting well: lead with the goal, then narrow; write like a technical writer and kill ambiguity where it matters most; show examples; and keep iterating. The second is not losing the result. A prototype built in a codegen tool lives on a deployment you do not own until you claim it — and claiming it is what upgrades a demo into a project with a custom domain, Git version control, rollbacks, secret scanning, forms, analytics, and functions.',
        concepts: [
          'Start the prompt with the general goal, then get more specific — the shape first, the details second.',
          'Think like a technical writer: remove ambiguity where being misread would cost the most, and give examples of what you want built.',
          'Being deliberately less specific in places is a technique, not a mistake — it is how you find options you would not have specified.',
          'If your codegen tool accepts context or rule files, feed it Netlify agent context so it gets platform details right from the first prompt.',
          'Claiming a codegen deployment connects it to your Netlify account and unlocks custom domains, analytics, forms, Git version control, live previews, deploy rollbacks, secret scanning, and serverless and edge functions.',
          'Netlify’s AI partners — including Bolt, Windsurf, and Same.new — offer a built-in way to claim a deployment into your account.',
          'The Netlify Drawer collects and tracks feedback on a prototype, and you can invite an unlimited number of free Reviewers to use it.',
          'Every deployment runs on Netlify’s global edge network, so a prototype that finds traction scales without being rebuilt to scale.',
        ],
        bestPractices: [
          'Claim the deployment as soon as the prototype is worth keeping — everything that makes it maintainable (Git history, rollbacks, secret scanning, domains) starts there.',
          'Give the codegen tool Netlify context files up front rather than correcting its platform assumptions prompt by prompt.',
          'Collect feedback through the Netlify Drawer instead of a screenshot thread, and invite Reviewers rather than sharing credentials.',
          'Iterate in small prompts once the shape is right; save the expensive one-shot prompts for exploring directions.',
          'Move a prototype onto Git version control before it becomes something you are afraid to change.',
        ],
        docs: [
          {
            label: 'Prototyping best practices',
            url: `${D}/build/build-with-ai/prototyping-best-practices/`,
          },
          {
            label: 'Deploy from an AI code generation tool',
            url: `${D}/start/quickstarts/deploy-from-ai-code-generation-tool/`,
          },
          {
            label: 'Netlify Drawer for feedback',
            url: `${D}/deploy/review-deploys/netlify-drawer-for-feedback/overview/`,
          },
          { label: 'Manage deploys and rollbacks', url: `${D}/deploy/manage-deploys/manage-deploys-overview/` },
          { label: 'Secrets Controller / secret scanning', url: `${D}/build/environment-variables/secrets-controller/` },
        ],
        checklist: [
          'Write a prototype prompt that opens with the goal and then narrows to specifics, and note where you deliberately left room.',
          'Build the same prototype twice — once with a tightly specified prompt, once looser — and compare what you got.',
          'Claim a codegen deployment into your Netlify account and confirm you can now set a custom domain.',
          'Enable the Netlify Drawer on a Deploy Preview and invite a Reviewer to leave feedback.',
          'Connect the claimed project to Git and confirm you can roll a published deploy back.',
        ],
        quiz: [
          {
            question: 'How should an AI prototyping prompt be structured?',
            options: [
              'Every technical detail first, goal last',
              'The general goal first, then progressively more specific detail',
              'A single sentence with no detail',
              'A list of file names to create',
            ],
            correctIndex: 1,
            explanation:
              'Netlify recommends starting with the general goal and then getting more specific, writing like a technical writer to remove ambiguity where it matters.',
          },
          {
            question: 'What does claiming a codegen deployment into your Netlify account give you?',
            options: [
              'Faster model inference',
              'Custom domains, Git version control, rollbacks, secret scanning, forms, analytics, and functions',
              'Unlimited free credits',
              'Automatic conversion to a static site',
            ],
            correctIndex: 1,
            explanation:
              'Claiming connects the deployment to your account so you can manage it long term with Netlify’s domains, security, version control, and platform features.',
          },
          {
            question: 'How do you gather structured feedback on a prototype?',
            options: [
              'Netlify Forms',
              'The Netlify Drawer, which supports an unlimited number of free Reviewers',
              'Split Testing',
              'Deploy notifications',
            ],
            correctIndex: 1,
            explanation:
              'The Netlify Drawer collects and tracks feedback on a deploy, and you can invite unlimited free Reviewers to use it.',
          },
        ],
      },
      // ---- Add AI to your app ---------------------------------------------
      {
        id: 'ai-gateway',
        title: 'AI Gateway',
        tagline: 'Call OpenAI, Anthropic, and Gemini with no API keys of your own',
        icon: Sparkles,
        time: '25–30 min',
        group: 'Add AI to your app',
        summary:
          'Use popular AI models from your own server code without provider accounts, keys, or separate credit balances — Netlify injects the configuration and bills the tokens to your plan credits.',
        overview:
          'AI Gateway removes the operational tax on adding AI to an app: no account with each provider, no separate credit balance per provider, no provider API keys copied into your projects. In every Netlify compute context — Functions, Edge Functions, Preview Server, and the framework code that compiles down to them — Netlify sets the API key and base URL environment variables that the official provider SDKs already look for. `new Anthropic()` with no arguments just works. The Gateway makes the provider call on your behalf, converts the actual token usage to credits, and stores neither your prompts nor the model’s output. This app’s own docs assistant is built exactly this way.',
        addOn: {
          label: 'Credit-based plans',
          note: 'AI Gateway is available on credit-based plans only — Free, Personal, and Pro. On an Enterprise plan, reach out to your Account Manager. It is on by default unless your team disabled AI features or you set your own provider API keys, and the project needs at least one production deploy before the Gateway activates.',
        },
        concepts: [
          'Netlify injects OPENAI_, ANTHROPIC_, GEMINI_/GOOGLE_GEMINI_, and OPENROUTER_ key and base-URL variables into AI Gateway-supported runtimes, so official SDKs need no configuration. The OpenRouter SDK is the exception — pass its base URL explicitly.',
          'Netlify never overrides a key or base URL you already set at the project or team level, which is how you opt a single provider out.',
          'NETLIFY_AI_GATEWAY_KEY and NETLIFY_AI_GATEWAY_BASE_URL are always injected and never collide with other variables — use them when you want to mix your own keys with Netlify’s or be explicit about routing through the Gateway.',
          'Anthropic, OpenAI, and Google Gemini models are served directly through each provider’s own API. Models from xAI, DeepSeek, Meta, Mistral, Qwen and others arrive via OpenRouter — pass an OpenRouter-notation model id to the OpenRouter or OpenAI SDK.',
          'Netlify only routes to OpenRouter providers with a Zero Data Retention policy, so a model with no ZDR host is not served at all, even if OpenRouter lists it.',
          'Billing is per successful request: actual input, output, cache-read, and cache-write tokens are converted to USD at provider rates, then to credits at 180 credits per $1 USD, from the same pool as the rest of your plan.',
          'Team-wide rate limits apply per minute, measured in credits: 90 on Free, 450 on Personal, 1,800 on Pro, and 9,000 on Enterprise.',
          'Real limitations: the project needs a prior production deploy, the context window is capped at 200k tokens, request headers are not passed through, batch inference and OpenAI priority processing are unsupported, and prompt caching is restricted per provider.',
          'Local development works through the Netlify CLI, and for Vite projects the Netlify Vite plugin gives you Gateway access without running netlify dev.',
        ],
        bestPractices: [
          'Let the official SDK read the injected environment variables instead of hardcoding a key — that is the whole point, and it keeps provider credentials off your machines and out of your repo.',
          'Add your own rate limiting rules to the functions and edge functions that call the Gateway, so a single abusive visitor cannot spend your team’s credits or exhaust the account-wide limit.',
          'Track credit usage as soon as a Gateway feature is live, and set up auto recharge or credit packs to match the demand you expect.',
          'Deploy to production once before expecting the Gateway to work on a brand-new project.',
          'Design around the 200k-token context window and the per-provider prompt-caching rules rather than discovering them in production.',
          'Remember that AI Gateway usage is not covered by the AI Credit Usage Limit on non-Enterprise plans — cap it with rate limiting and monitoring instead.',
        ],
        docs: [
          { label: 'AI Gateway overview', url: `${D}/build/ai-gateway/overview/` },
          { label: 'Quickstart for AI Gateway', url: `${D}/build/ai-gateway/quickstart-for-ai-gateway/` },
          { label: 'AI Gateway examples', url: `${D}/build/ai-gateway/examples/` },
          { label: 'Rate limiting', url: `${D}/manage/security/secure-access-to-sites/rate-limiting/` },
          {
            label: 'Pricing for AI features',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/pricing-for-ai-features/`,
          },
        ],
        checklist: [
          'Call a model from a function using an official SDK with no API key in your code.',
          'Deploy the project to production once and confirm the Gateway is active.',
          'Run the same code locally through the Netlify CLI (or the Netlify Vite plugin) and confirm it still works.',
          'Add a rate limiting rule to the function that calls the Gateway.',
          'Find your plan’s per-minute credit rate limit and estimate how many requests that allows for your chosen model.',
          'Check your AI Gateway AI inference usage under Usage & billing.',
        ],
        quiz: [
          {
            question: 'How does an official provider SDK authenticate through AI Gateway?',
            options: [
              'You store a provider API key in Netlify environment variables',
              'Netlify injects the key and base URL environment variables the SDK already reads, so no configuration is needed',
              'You pass a Netlify personal access token as the API key',
              'The SDK prompts for a key at build time',
            ],
            correctIndex: 1,
            explanation:
              'Netlify sets the API key and base URL variables that the official client libraries look for in every supported runtime, so `new Anthropic()` works with no arguments.',
          },
          {
            question: 'You already set your own ANTHROPIC_API_KEY at the project level. What does Netlify do?',
            options: [
              'Overrides it with the Gateway key',
              'Leaves your key in place — Netlify never overrides a key or base URL you set',
              'Fails the build',
              'Disables AI Gateway for the whole team',
            ],
            correctIndex: 1,
            explanation:
              'Netlify never overrides keys or base URLs you have set at the project or team level. That is how you route one provider around the Gateway.',
          },
          {
            question: 'How is AI Gateway usage converted to credits?',
            options: [
              'A flat charge per request',
              'Actual tokens used are converted to USD at provider rates, then to credits at 180 credits per $1 USD',
              'From a separate pool of AI-only credits',
              'It is free on all plans',
            ],
            correctIndex: 1,
            explanation:
              'Each successful request bills the actual tokens used, converted to USD and then to credits at 180 credits per dollar, drawn from the same credit pool as the rest of your plan.',
          },
          {
            question: 'Which of these is a real AI Gateway limitation?',
            options: [
              'It only works with Anthropic models',
              'The context window is limited to 200k tokens and the project needs a prior production deploy',
              'It cannot be used from Edge Functions',
              'It requires a paid plan',
            ],
            correctIndex: 1,
            explanation:
              'Input is capped at 200k tokens, the project must have had at least one production deploy, request headers are not passed through, and batch inference is unsupported.',
          },
        ],
      },
      {
        id: 'code-agents',
        title: 'Building AI tools & code agents',
        tagline: 'Ship a product that deploys other people’s projects',
        icon: Boxes,
        time: '20–25 min',
        group: 'Add AI to your app',
        summary:
          'If your product generates or deploys code for its own users, Netlify’s API-first architecture, deploy primitives, and AI partner programme are the platform layer underneath it.',
        overview:
          'This subsection flips the audience. Everywhere else in this section you are the one using AI; here you are building the AI tool, and your users’ projects need somewhere to go. Netlify’s appeal for that job is that it was built API-first, so an agent can create a project, configure build settings and environment variables, deploy, and read the build logs back without a human in the loop — and users do not need a Netlify account to get started. That is the path Bolt scaled along, from hundreds of deployments to millions, without its team taking on DevOps work.',
        concepts: [
          'API-first architecture means agents can create sites with unique configurations in seconds, define build settings, environment variables, and domain rules programmatically, and feed deploy logs back into the system to improve later builds.',
          'Zero-friction deployments: your users can start without having a Netlify account, and pick one up later when they want to own the project.',
          'The recommended AI workflow for both static and full-stack apps is deploying the project as a zip file to Netlify.',
          'The Netlify REST API is the surface for all of it — generating a PAT through Netlify OAuth lets your tool act on behalf of its users.',
          'Guides exist for the specific jobs: surfacing deploy and function logs, adding a custom domain via the API, and deploying full-stack or static projects from an AI tool.',
          'Becoming an official AI partner adds massive rate limits, support help with fraud and abuse detection, engineering support, and co-marketing.',
          'Platform benefits pass straight through to your users: a global CDN with 100+ points of presence, sub-50ms responses worldwide, custom domain support, secret scanning, and enterprise-grade security.',
          'You can also build and host your own MCP Server on Netlify, so agents can pull context about your product the same way they pull Netlify’s.',
        ],
        bestPractices: [
          'Deploy your users’ projects as zip files — it is the workflow Netlify recommends for AI tools and it avoids per-file orchestration.',
          'Use Netlify OAuth to generate personal access tokens and act on behalf of your users rather than deploying everything into one account you own.',
          'Pipe deploy and function logs back into your agent loop; a build failure the agent can read is a build failure the agent can fix.',
          'Apply for the AI partner programme before a growth spike, not during one — rate limits and abuse support are the things that break first.',
          'If agents need context about your own product, publish an MCP server for it rather than expecting them to scrape your docs.',
        ],
        docs: [
          { label: 'Building code agents overview', url: `${D}/extend/building-code-agents/overview/` },
          { label: 'APIs for code agents', url: `${D}/extend/building-code-agents/apis-for-code-agents/` },
          { label: 'Become an AI partner', url: `${D}/extend/building-code-agents/become-ai-partner/` },
          { label: 'Get started with the Netlify API', url: `${D}/api-and-cli-guides/api-guides/get-started-with-api/` },
          { label: 'Write MCP servers on Netlify', url: 'https://developers.netlify.com/guides/write-mcps-on-netlify/' },
        ],
        checklist: [
          'Read the deploy-a-zip-file guide and note why it is the recommended workflow for AI tools.',
          'Generate a personal access token through Netlify OAuth and create a project with the REST API.',
          'Deploy a small project via the API and read its deploy log back programmatically.',
          'Add a custom domain to that project using the API.',
          'Decide whether the AI partner programme applies to what you are building, and note which benefit matters most.',
        ],
        quiz: [
          {
            question: 'What deploy workflow does Netlify recommend for AI tools deploying user projects?',
            options: [
              'Committing to a Git repository per user',
              'Deploying the project as a zip file to Netlify',
              'Uploading files one at a time through the CLI',
              'Rendering everything client-side',
            ],
            correctIndex: 1,
            explanation:
              'Netlify’s guides for both full-stack and static AI deployments recommend deploying the app as a zip file.',
          },
          {
            question: 'How should a code agent act on behalf of its users on Netlify?',
            options: [
              'Share one account token across all users',
              'Generate a personal access token through Netlify OAuth',
              'Ask each user for their password',
              'Use the site deploy key',
            ],
            correctIndex: 1,
            explanation:
              'The guide for generating a PAT with Netlify OAuth is exactly the mechanism for acting on behalf of your users through the REST API.',
          },
          {
            question: 'Which benefit is specific to becoming an official Netlify AI partner?',
            options: [
              'Access to the REST API',
              'A global CDN',
              'Massive rate limits plus support for fraud and abuse detection, engineering support, and co-marketing',
              'Custom domain support',
            ],
            correctIndex: 2,
            explanation:
              'The API, CDN, and custom domains are available to everyone. Raised rate limits, abuse-mitigation support, dedicated engineering support, and co-marketing come with the partner programme.',
          },
        ],
      },
      {
        id: 'crawler-readable-content',
        title: 'Keeping content readable by AI crawlers',
        tagline: 'Prerender your SPA so agents and crawlers see real HTML',
        icon: ScanSearch,
        time: '20–25 min',
        group: 'Add AI to your app',
        summary:
          'A single-page app ships a mostly empty HTML body. Prerendering serves fully rendered HTML to AI agents, crawlers, and preview services while humans keep getting your JavaScript app.',
        overview:
          'If your project renders its content with client-side JavaScript, most AI agents, chat services, and crawlers see nothing — they cannot run JavaScript, and even search engines that can may penalise a slow first paint. Prerendering fixes this without changing your app: Netlify detects a relevant user agent asking for HTML, rewrites the request to a function that loads the page in a headless browser, and returns the fully rendered markup with proper caching headers. Human visitors are untouched. Sites built with SSR or SSG already avoid the problem and do not need this.',
        concepts: [
          'The problem is specific to SPAs built with frameworks like React, Vue, or Angular that leave the HTML body mostly empty; SSR and SSG sites already serve content in HTML.',
          'Prerendering serves pre-rendered HTML to crawlers, AI agents, and preview services — including social media preview cards — while normal visitors continue to receive the standard JavaScript app.',
          'The Netlify Prerender extension works in two parts: an edge function that matches only relevant user agents requesting HTML and rewrites to a serverless function, which loads the page in a headless browser and returns rendered HTML.',
          'There is no additional cost beyond normal billing for the functions invoked, and because the functions run in your own account you get the same logs and metrics as any other function.',
          'The extension requires Node.js 20 or later — an older version can fail with Chromium launch errors. Set it with .node-version, .nvmrc, or NODE_VERSION.',
          'A Team Owner installs the extension for the team; any developer then enables it per project. Enabling requires a redeploy, but later configuration changes do not, because they are stored in a blob object.',
          'The Prerender.io extension is the alternative for business-critical or complex configurations: advanced configuration and vendor-level support, but it needs a Prerender.io API key and a Netlify Pro or Enterprise plan.',
          'Netlify’s prerendering checker tool tells you whether your project actually needs this before you install anything.',
          'The Prerender extension replaces the legacy beta prerendering feature, which is now deprecated.',
        ],
        bestPractices: [
          'Run the prerendering checker against your URL first — an SSR or SSG project does not need prerendering at all.',
          'Pin Node.js 20 or later before enabling the extension, so you never debug a Chromium launch failure that was really a runtime version.',
          'Start with the Netlify Prerender extension and its defaults; it very often needs no additional configuration.',
          'Choose Prerender.io only when you genuinely need advanced configuration or vendor-level support, and budget for its API key and the Pro or Enterprise plan requirement.',
          'Verify the result by requesting a page as a crawler user agent and confirming the body contains real content.',
        ],
        docs: [
          { label: 'Prerendering', url: `${D}/build/post-processing/prerendering/` },
          { label: 'Manage dependencies (Node.js version)', url: `${D}/build/configure-builds/manage-dependencies/` },
          { label: 'Prerendering checker tool', url: 'https://do-you-need-prerender.netlify.app/' },
          { label: 'Netlify Prerender extension', url: 'https://app.netlify.com/extensions/prerender' },
          { label: 'Netlify Blobs overview', url: `${D}/build/data-and-storage/netlify-blobs/` },
        ],
        checklist: [
          'Run your project URL through the prerendering checker and record whether it needs prerendering.',
          'Confirm your project builds on Node.js 20 or later.',
          'Install the Prerender extension for your team and enable it for one project, then redeploy.',
          'Request a page with a crawler user agent and confirm the returned HTML contains your content.',
          'Compare the Netlify Prerender and Prerender.io options against your own requirements and support needs.',
        ],
        quiz: [
          {
            question: 'Which kind of project needs prerendering?',
            options: [
              'A statically generated site',
              'A server-side rendered site',
              'A single-page app that renders content with client-side JavaScript',
              'Any site with images',
            ],
            correctIndex: 2,
            explanation:
              'SPAs leave the HTML body mostly empty, so tools that cannot run JavaScript see no content. SSR and SSG sites already serve content in HTML.',
          },
          {
            question: 'How does the Netlify Prerender extension work?',
            options: [
              'It pre-builds every page at deploy time',
              'An edge function matches relevant user agents and rewrites to a function that renders the page in a headless browser',
              'It proxies all traffic through an external service',
              'It rewrites your app to use server-side rendering',
            ],
            correctIndex: 1,
            explanation:
              'The edge function runs only for relevant user agents requesting HTML; the serverless function loads the page in a headless browser and returns fully rendered HTML with caching headers.',
          },
          {
            question: 'What Node.js version does the Netlify Prerender extension require?',
            options: ['Node.js 16 or later', 'Node.js 18 or later', 'Node.js 20 or later', 'Any version'],
            correctIndex: 2,
            explanation:
              'Node.js 20 or later is required; older versions can fail with Chromium launch errors. Set the version with .node-version, .nvmrc, or NODE_VERSION.',
          },
        ],
      },
      // ---- Govern and pay for AI ------------------------------------------
      {
        id: 'manage-ai-features',
        title: 'Managing AI features',
        tagline: 'The Team Owner switch, and two kinds of spend cap',
        icon: SlidersHorizontal,
        time: '20–25 min',
        group: 'Govern and pay for AI',
        summary:
          'Turn Netlify’s AI features on or off for the whole team, cap team-wide AI inference spend, and set per-member Agent Runner limits with per-person overrides.',
        overview:
          'AI features on Netlify are a team-level setting with a single owner: the Team Owner, from Team settings → AI enablement. One switch covers Agent Runners, AI Gateway, and the "Why did it fail?" deploy troubleshooting. They are on by default for credit-based Free, Personal, and Pro plans and off by default for Enterprise. The same page carries the two spend controls that matter — a team-wide AI Credit Usage Limit and a per-member Agent Runner limit, with overrides for individuals.',
        concepts: [
          'Enabling AI features turns on three things together: Agent Runners, AI Gateway, and the "Why did it fail?" failed-deploy troubleshooting that feeds into Agent Runners.',
          'On by default for credit-based Free, Personal, and Pro plans; off by default for Enterprise plans.',
          'Only a Team Owner can enable or disable AI features, but Team Owner, Developer, Internal Builder, and Publisher roles can all use them.',
          'AI primitives such as AI Gateway only activate if you explicitly add the capability to your project code — enabling the feature does not start spending on its own.',
          'The AI Credit Usage Limit caps AI inference credits the whole team can spend on Agent Runners. When it is hit, active runs stop and no new runs can start.',
          'On non-Enterprise plans that limit counts Agent Runners only — AI Gateway usage is neither counted nor affected. On Enterprise it counts both meters, but still only pauses agent runs.',
          'Setting a limit below current usage stops active runs immediately, so the limit is not just forward-looking.',
          'A blocked team resumes when the credit balance resets at the next billing cycle, when you upgrade the plan, or when you raise or disable the limit.',
          'Member Agent Runner credit limits cap each individual per billing period; a member who hits their own limit is blocked while everyone else continues. Setting the member limit to 0 credits disables Agent Runners for everyone.',
          'Per-member overrides go either way: a positive value raises that person’s limit, 0 credits blocks them entirely, and removing the override returns them to the standard member limit.',
          'Ask Netlify AI is separate — it is enabled by default for all visitors to docs.netlify.com and in-app for all Netlify users.',
        ],
        bestPractices: [
          'Set both limits before rolling Agent Runners out to a team: the team-wide cap protects the balance, the per-member cap stops one person consuming all of it.',
          'Use a 0-credit member override to withhold Agent Runners from a specific person instead of turning the feature off for the whole team.',
          'Check the team credit balance under Team settings → Billing when you set a limit — a cap above your balance is not a cap.',
          'Remember that lowering the limit is immediate and disruptive; announce it before you set it below current usage.',
          'Do not rely on the AI Credit Usage Limit to contain AI Gateway spend on a non-Enterprise plan — use rate limiting on the functions that call it.',
        ],
        docs: [
          {
            label: 'Manage AI features',
            url: `${D}/build/build-with-ai/manage-ai-for-your-team/manage-ai-features/`,
          },
          {
            label: 'Roles and permissions',
            url: `${D}/manage/accounts-and-billing/team-management/roles-and-permissions/`,
          },
          {
            label: 'How credits work',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/`,
          },
          { label: 'Fix a failed deploy', url: `${D}/resources/troubleshooting/fix-a-failed-deploy/` },
          { label: 'Ask Netlify AI', url: `${D}/resources/troubleshooting/ask-netlify/` },
        ],
        checklist: [
          'Open Team settings → AI enablement and note whether AI features are currently on for your team.',
          'Check which of your teammates hold a role that can use AI features.',
          'Set an AI Credit Usage Limit for Agent Runners and confirm what happens when it is reached.',
          'Configure a member credit usage limit and add an override for one member.',
          'Write down how your team would resume agent runs if the limit were reached mid-sprint.',
        ],
        quiz: [
          {
            question: 'Who can enable or disable AI features for a Netlify team?',
            options: [
              'Any team member',
              'A Team Owner only',
              'Team Owners and Developers',
              'Netlify support, on request',
            ],
            correctIndex: 1,
            explanation:
              'Enabling and disabling AI features is Team Owner only, though Team Owners, Developers, Internal Builders, and Publishers can all use the features.',
          },
          {
            question: 'On a Pro plan, what does the AI Credit Usage Limit cap?',
            options: [
              'All AI inference from both Agent Runners and AI Gateway',
              'AI inference from Agent Runners only',
              'Total credits including bandwidth and compute',
              'AI Gateway requests per minute',
            ],
            correctIndex: 1,
            explanation:
              'On credit-based plans other than Enterprise the limit tracks Agent Runners AI inference only. On Enterprise it factors in AI Gateway too, but still only pauses agent runs.',
          },
          {
            question: 'How do you block one specific team member from using Agent Runners?',
            options: [
              'Disable AI features for the team',
              'Remove them from the team',
              'Add a member override of 0 credits for that person',
              'Set the team-wide limit to 0',
            ],
            correctIndex: 2,
            explanation:
              'A member override of 0 credits blocks that member entirely while everyone else keeps their standard limit. Setting the standard member limit to 0 would disable Agent Runners for all members.',
          },
          {
            question: 'What happens when you set an AI Credit Usage Limit below current usage?',
            options: [
              'It applies from the next billing cycle',
              'It is rejected',
              'Active agent runs stop immediately and new ones are prevented',
              'It only warns the team',
            ],
            correctIndex: 2,
            explanation:
              'The limit is enforced immediately — setting it below current usage stops active agent runs and prevents new ones straight away.',
          },
        ],
      },
      {
        id: 'security-privacy',
        title: 'Security & privacy for AI features',
        tagline: 'What is sent, what is stored, and who is liable',
        icon: ShieldCheck,
        time: '20–25 min',
        group: 'Govern and pay for AI',
        summary:
          'Per-feature detail on data handling: which providers Netlify uses, what each AI feature stores and for how long, the no-training guarantee, and where responsibility for model output sits.',
        overview:
          'Before production or customer data goes near an AI feature, someone has to be able to answer what leaves the platform, who sees it, and how long it is kept. Netlify’s answers are per-feature rather than blanket, because the features do genuinely different things: a proxy that stores nothing is a different risk profile from an agent environment whose session logs are retained under CI policy. The load-bearing guarantee across all of them is that Netlify uses third-party providers for inference and those providers are not permitted to train their models on inputs received through Netlify.',
        concepts: [
          'Four features are in scope: Agent Runners, AI Gateway, "Why did it fail?" deploy troubleshooting, and Ask Netlify AI.',
          'No training: Netlify’s AI features use third-party providers for inference exclusively, and those providers are not permitted to train their models on inputs received through Netlify.',
          'AI Gateway acts as a proxy and does not store inputs or outputs. It keeps request metadata — which excludes prompts and generated output — for logging, auditing, and support, and enhanced logging exists only on customer request.',
          'Agent Runners provide a controlled environment for agents like Claude Code, Codex, and Gemini CLI. Session logs are captured for display, troubleshooting, and audit, under the same policies that cover build logs and CI data.',
          '"Why did it fail?" uses build logs already in Netlify’s system, sends a sample to a provider only when invoked on a failed deploy, and stores the resulting suggestion for up to 30 days.',
          'Ask Netlify uses Kapa.ai, and questions and answers are stored to help improve support and product features.',
          'Current providers: Anthropic, Google, OpenAI, Kapa.ai (Ask Netlify only), and OpenRouter (AI Gateway routing and the OpenCode agent).',
          'Netlify only routes through OpenRouter to providers offering Zero Data Retention, meaning those providers do not store prompts or model outputs.',
          'Netlify runs evaluation tests on models and system inputs to reduce unsafe results, but customers are responsible for verifying the outputs of models used in their applications.',
          'All of it is switchable: Agent Runners, AI Gateway, and AI-assisted deploy troubleshooting can be disabled team-wide, and are off by default on Enterprise.',
        ],
        bestPractices: [
          'Map each AI feature you enable to its storage behaviour before approving it — "Netlify AI" is not one retention policy.',
          'Treat model output as unverified input: Netlify’s evaluations reduce risk but verification of what a model produces in your app is your responsibility.',
          'Prefer AI Gateway for inference in product code, since it stores no prompts or outputs, and keep enhanced logging off unless you have asked for it deliberately.',
          'When a workload needs a no-retention guarantee from the model host, use models Netlify serves through ZDR-only OpenRouter routing or served directly by the primary providers.',
          'On Enterprise, treat the default-off state as a decision point: enable AI features deliberately, with the limits and the data-handling review done first.',
          'Include the 30-day retention of failed-deploy suggestions in any assessment that covers build log data.',
        ],
        docs: [
          {
            label: 'Security and privacy for AI features',
            url: `${D}/build/build-with-ai/security-and-privacy-for-ai-features/`,
          },
          {
            label: 'Manage AI features',
            url: `${D}/build/build-with-ai/manage-ai-for-your-team/manage-ai-features/`,
          },
          { label: 'AI Gateway overview', url: `${D}/build/ai-gateway/overview/` },
          { label: 'Agent Runners overview', url: `${D}/build/build-with-ai/agent-runners/overview/` },
          { label: 'Fix a failed deploy', url: `${D}/resources/troubleshooting/fix-a-failed-deploy/` },
        ],
        checklist: [
          'List the AI features your team has enabled and write down what each one stores.',
          'Confirm for yourself that AI Gateway stores no prompts or outputs, only request metadata.',
          'Check whether any data your app sends through an AI feature would be a problem to have in agent session logs.',
          'Note the 30-day retention on "Why did it fail?" suggestions against your own log retention expectations.',
          'Decide who on your team is accountable for verifying model output in production.',
        ],
        quiz: [
          {
            question: 'Can Netlify’s AI providers train on data sent through Netlify?',
            options: [
              'Yes, unless you opt out',
              'No — providers are not permitted to train their models on inputs received through Netlify',
              'Only on Free plans',
              'Only prompts, not outputs',
            ],
            correctIndex: 1,
            explanation:
              'Netlify uses third-party providers for inference exclusively, and those providers are not permitted to train on inputs received through Netlify.',
          },
          {
            question: 'What does AI Gateway store?',
            options: [
              'Full prompts and outputs for 30 days',
              'Nothing at all',
              'Request metadata that excludes prompts and generated output, for logging, auditing, and support',
              'Prompts only',
            ],
            correctIndex: 2,
            explanation:
              'AI Gateway is a proxy: it does not store inputs or outputs, only request metadata without prompts or output. Enhanced logging is available on customer request only.',
          },
          {
            question: 'Who is responsible for verifying the output of models used in your application?',
            options: [
              'Netlify, through its evaluation tests',
              'The model provider',
              'The customer',
              'Nobody — outputs are guaranteed safe',
            ],
            correctIndex: 2,
            explanation:
              'Netlify runs evaluations on models and system inputs to reduce risk, but customers are responsible for verifying the outputs of models used in their applications.',
          },
          {
            question: 'Why does Netlify route OpenRouter requests only to Zero Data Retention providers?',
            options: [
              'To reduce latency',
              'So those providers do not store your prompts or model outputs',
              'To lower credit costs',
              'To support more models',
            ],
            correctIndex: 1,
            explanation:
              'ZDR means the model host does not store prompts or outputs. A model whose hosts offer no ZDR guarantee is not served by AI Gateway at all.',
          },
        ],
      },
      {
        id: 'credits-and-pricing',
        title: 'Credits & pricing for AI',
        tagline: 'One meter, one rate, and where the surprises hide',
        icon: CreditCard,
        time: '20–25 min',
        group: 'Govern and pay for AI',
        summary:
          'How AI inference converts model usage to credits at 180 credits per dollar, what else an agent run bills you for, and how to monitor, cap, and top up.',
        overview:
          'Everything AI on Netlify bills through one meter and one rate: AI inference measures what your model usage cost in USD at provider rates, then converts every $1 to 180 Netlify credits, drawn from the same plan credits that pay for deploys and bandwidth. That rate is set to make Netlify competitive with going direct to providers. The surprises are not in the rate — they are in the second meters. An agent run also bills compute for the environment it works in, and publishing its result bills a production deploy.',
        concepts: [
          'AI inference is one usage meter alongside compute, bandwidth, and web requests, and it covers both Agent Runners and AI Gateway.',
          'The conversion is fixed: $1 USD of provider model usage becomes 180 Netlify credits.',
          'Your usage breakdown splits AI inference into Agent Runners AI inference and AI Gateway AI inference, so you can see which feature spent what. Enterprise dashboards show a single combined metric instead.',
          'An agent run bills two meters: AI inference for the model usage and compute at 10 credits per GB-hour for the environment the agent runs in.',
          'Related costs are easy to miss: publishing an agent run’s changes costs 15 credits as a production deploy, while Deploy Previews and branch deploys are free and failed deploys cost nothing.',
          'The "Why did it fail?" troubleshooting feature itself generates no AI inference cost — but starting an agent run to fix the deploy does.',
          'AI Gateway bills per successful request on actual tokens used, priced separately for input, output, cache reads, and cache writes.',
          'Monthly allotments: 300 credits on Free as a hard limit, 1,000 on Personal, and Pro starting at 3,000. When the balance is fully used, all projects pause and visitors see a "Site not available" page.',
          'Top-ups: credit packs are 500 credits for $5 on Personal and 1,500 for $10 on Pro, and never expire; auto recharge buys the same increments automatically when the balance runs out and is off by default, Team Owner controlled, and team-wide.',
          'Credits are spent soonest-expiring first, so monthly plan credits go before never-expiring pack and auto-recharge credits. Pro plans at 5,000+ monthly credits roll unused credits over for one extra month.',
          'Monitor it under Usage & billing → Account usage insights, where the AI inference chart shows token usage and provider requests for AI Gateway and Agent Runners.',
          'Netlify publishes per-model token rates and a pricing calculator, and the provider and model list is available as JSON from a public API endpoint.',
        ],
        bestPractices: [
          'Budget an agent run as model usage plus compute plus a production deploy, not just the model usage.',
          'Review the AI inference chart before and after adding a Gateway-backed feature, so you learn what your own traffic actually costs.',
          'Enable auto recharge or buy credit packs before launching an AI feature — running the balance to zero pauses every project on the team, not just the AI one.',
          'Use per-model cost rankings and the pricing calculator to estimate before you commit to a model, and re-check when provider rates change.',
          'Iterate with cheaper models and spend the expensive ones on planning and ideation, especially on a Free plan where one prompt can consume most of the monthly allotment.',
          'Pair the spend cap with rate limiting: the AI Credit Usage Limit does not restrain AI Gateway on non-Enterprise plans.',
        ],
        docs: [
          {
            label: 'Pricing for AI features',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/pricing-for-ai-features/`,
          },
          {
            label: 'How credits work',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/`,
          },
          {
            label: 'Monitor usage for credit-based plans',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/monitor-usage-for-credit-based-plans/`,
          },
          {
            label: 'Buy credit packs',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/buy-credit-packs/`,
          },
          {
            label: 'Configure auto recharge',
            url: `${D}/manage/accounts-and-billing/billing/billing-for-credit-based-plans/configure-auto-recharge/`,
          },
        ],
        checklist: [
          'Find your team’s monthly credit allotment and current balance under Team settings → Billing.',
          'Open Usage & billing → Account usage insights and read the AI inference chart.',
          'Take one completed agent run and account for every credit it cost across all meters.',
          'Estimate the credit cost of a realistic AI Gateway feature using the per-model rates or the pricing calculator.',
          'Decide between auto recharge and credit packs for your team, and note who can turn each on.',
        ],
        quiz: [
          {
            question: 'How does AI inference convert model usage into credits?',
            options: [
              'A flat 10 credits per request',
              'Every $1 USD of provider model usage becomes 180 Netlify credits',
              '180 credits per million tokens, regardless of model',
              'Per GB-hour of compute',
            ],
            correctIndex: 1,
            explanation:
              'Provider token usage is priced in USD at provider rates, then converted at 180 Netlify credits per dollar — the same rate for Agent Runners and AI Gateway.',
          },
          {
            question: 'Beyond AI inference, what else does an agent run whose changes you publish cost you?',
            options: [
              'Nothing else',
              'Compute for the agent environment, plus 15 credits for the production deploy',
              'A separate AI-only credit balance',
              'Bandwidth only',
            ],
            correctIndex: 1,
            explanation:
              'Agent runs bill compute in GB-hours for the environment the agent works in, and publishing the result is a production deploy at 15 credits. Deploy Previews and failed deploys are free.',
          },
          {
            question: 'What happens when a team uses up its entire credit balance?',
            options: [
              'Only AI features stop working',
              'Usage continues and is invoiced later',
              'All projects are paused and visitors see a "Site not available" page',
              'The team is downgraded to the Free plan',
            ],
            correctIndex: 2,
            explanation:
              'Once the credit balance is completely used up, all of the team’s web projects are paused and visitors get a "Site not available" page — which is why auto recharge or credit packs matter before launch.',
          },
          {
            question: 'Which credits are spent first?',
            options: [
              'Never-expiring credit pack credits',
              'Credits that expire soonest, ending with credits that never expire',
              'Whichever were purchased most recently',
              'They are consumed proportionally',
            ],
            correctIndex: 1,
            explanation:
              'The balance is used in expiry order, starting with the soonest to expire and ending with non-expiring credits such as credit packs and auto-recharge remainders.',
          },
        ],
      },
    ],
    furtherTopics: [
      {
        title: 'Block AI crawlers and bots',
        note: 'The other side of the crawler question. Netlify’s User Agent Blocker extension uses an edge function to block requests from a preset list of AI, search, and SEO crawlers you choose, which also trims web request traffic. A Team Owner installs it for the team, then activates it one project at a time. Pair it with rate limiting for traffic that does not identify itself honestly.',
        url: `${D}/build/build-with-ai/block-ai-crawlers/`,
        icon: BotOff,
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
    id: 'netlify-database',
    section: 'Create',
    title: 'Netlify Database',
    tagline: 'Managed Postgres with a database branch per deploy preview',
    icon: DatabaseZap,
    time: '45–60 min',
    addOn: {
      label: 'Add-on',
      note: 'Netlify Database is an opt-in capability rather than something every team already has: it is available on credit-based plans only (Free, Personal, Pro, Enterprise), is provisioned per project, and is billed from your plan credits by usage — 10 credits per database compute unit and 20 credits per GB of database bandwidth out. Storage size is free until July 1, 2026. Per-plan caps apply to databases per account, branches per database, and backup retention.',
    },
    overview:
      'Netlify Database is a fully managed Postgres built into the platform — Netlify handles provisioning, migrations, and branching for you. Production deploys are the only deploys allowed to reach the main database; every deploy preview and every agent run gets its own database branch, seeded with a copy of production data, so experiments cannot damage live data. This module goes deep on Database itself; see Data, Storage & Caching for how it compares to Blobs and the Image CDN.',
    roleFocus: {
      admin:
        'Team Owner is the only role that can edit production-branch data, copy a read-write production connection string, restore a backup, or delete a database — and usage draws on your plan credits, so entitlement, cost, and compliance sit with you.',
      developer:
        'Your primary path. Model schema in repo-tracked migrations, query from functions and edge functions, and work freely on preview branches while the production branch stays read-only for your role.',
      builder:
        'You can propose database changes through Agent Runners, but the database dashboard, contents, and connection strings are not available to your role — a Team Owner or Developer publishes the change to production.',
    },
    priority: { admin: 'recommended', developer: 'core', builder: 'optional' },
    concepts: [
      'Fully managed Postgres built into Netlify — provisioning, migrations, and branching are handled by the platform.',
      'Database branching: production deploys reach the main database, while each deploy preview gets its own branch seeded with a copy of production data taken when the preview is first created.',
      'A bad change on a preview branch can be reset and started over without users noticing, which removes the drift and bottleneck problems of a single shared staging database.',
      'Automatic migrations are tracked in the repository under netlify/database/migrations/ and applied at the right point in the deploy lifecycle, so schema never drifts from the code that is running.',
      'Readable and writable from Functions, Edge Functions, Builds, and Agent Runners through the @netlify/database package, with Drizzle ORM as an optional type-safe query builder.',
      'Every agent run gets its own database branch automatically, giving AI agents an isolated environment with no risk to production data.',
      'netlify database init scaffolds the packages, query style, and a starter migration; netlify dev runs a local Postgres so you can iterate without touching production.',
      'Access is role-based: editing production data, copying a read-write production connection string, restoring backups, and deleting a database are Team Owner only.',
    ],
    bestPractices: [
      'Keep every schema change in a repo-tracked migration so the schema ships with the code that depends on it.',
      'Validate schema and data changes on a deploy preview branch first, then publish to production — reset the branch rather than repairing it when something goes wrong.',
      'Connect the project to Git so each agent run opens a pull request and a Team Owner or Developer has to publish the change to production.',
      'Tune auto-scale and sleep-on-inactivity deliberately — compute credits accrue for the whole time the database is active, including idle time before it sleeps.',
      'Do not store cardholder data or Protected Health Information: Netlify Database is not PCI-DSS certified and is not HIPAA-eligible by default.',
      'Use netlify database init instead of wiring a client by hand, and check the per-plan limits before you design around a database count or branch count.',
    ],
    docs: [
      { label: 'Netlify Database overview', url: `${D}/build/data-and-storage/netlify-database/` },
      { label: 'Database: Getting started', url: `${D}/build/data-and-storage/netlify-database/getting-started/` },
      { label: 'Database: Migrations', url: `${D}/build/data-and-storage/netlify-database/migrations/` },
      { label: 'Database: Access control', url: `${D}/build/data-and-storage/netlify-database/access-control/` },
      {
        label: 'Database: Billing, limits, and compliance',
        url: `${D}/build/data-and-storage/netlify-database/billing-and-usage/`,
      },
      { label: 'Database: Local development', url: `${D}/build/data-and-storage/netlify-database/local-development/` },
      { label: 'Database: Backup and recovery', url: `${D}/build/data-and-storage/netlify-database/backup-and-recovery/` },
      { label: 'Database: CLI reference', url: `${D}/build/data-and-storage/netlify-database/cli/` },
    ],
    checklist: [
      'Confirm your team is on a credit-based plan and review the database limits that apply to it.',
      'Run netlify database init in a project and choose a query style (Drizzle ORM or direct SQL).',
      'Write a migration, deploy it, and confirm it applied during the production deploy.',
      'Open a deploy preview and confirm it is reading its own database branch rather than production.',
      'Query the database from a function or edge function.',
      'Compare the access control matrix against your own team role and note what you cannot do.',
    ],
    quiz: [
      {
        question: 'Which deploys are allowed to access the main production database?',
        options: [
          'Every deploy, including branch deploys and deploy previews',
          'Only production deploys',
          'Any deploy that has the connection string',
          'Only local development',
        ],
        correctIndex: 1,
        explanation:
          'Production deploys are the only deploys allowed to access the main database, which protects it from the side effects of experimentation.',
      },
      {
        question: 'What database does a deploy preview use?',
        options: [
          'The production database, in read-only mode',
          'No database until you add a connection string',
          'Its own database branch, seeded with a copy of production data',
          'A shared staging database used by all previews',
        ],
        correctIndex: 2,
        explanation:
          'Each deploy preview gets its own branch seeded from production data when the preview is created, and no code changes are needed to connect to it.',
      },
      {
        question: 'Which role is required to edit production-branch data, restore a backup, or delete a database?',
        options: ['Reviewer', 'Internal Builder', 'Developer', 'Team Owner'],
        correctIndex: 3,
        explanation:
          'Those actions are Team Owner only. Developers have full access to non-production branches but read-only access to the production branch.',
      },
      {
        question: 'How is Netlify Database billed?',
        options: [
          'A flat monthly fee on every plan',
          'From plan credits, based on database compute and bandwidth usage, on credit-based plans only',
          'Free on all plans with no limits',
          'Per query, invoiced separately from Netlify',
        ],
        correctIndex: 1,
        explanation:
          'Netlify Database is available on credit-based plans only and bills usage in credits — 10 credits per compute unit and 20 credits per GB of bandwidth out. Storage size is free until July 1, 2026.',
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
      'Add a honeypot field, and optionally either Akismet (default) or your own reCAPTCHA — note enabling reCAPTCHA turns off Akismet for that form.',
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
      'If your external DNS provider can\'t ALIAS the bare domain, set `www` as your primary domain and redirect the apex to it.',
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
      'Lighthouse scoring: run Google Lighthouse audits at deploy time to track performance, accessibility, SEO, and best-practices scores.',
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
      { label: 'Lighthouse', url: `${D}/manage/monitoring/lighthouse/` },
      { label: 'Notifications', url: `${D}/manage/monitoring/notifications/` },
    ],
    checklist: [
      'Enable Web Analytics on a project.',
      'Review the Observability dashboard and function metrics.',
      'Set up a deploy notification (e.g. Slack or email).',
      'Enable the Lighthouse plugin and review scores on a deploy.',
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
      'Private connectivity (paid add-on) and a security scorecard to track posture.',
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
      { label: 'Private connectivity (paid add-on)', url: `${D}/manage/security/private-connectivity/` },
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

// ---------------------------------------------------------------------------
// Lessons (module subsections)
// ---------------------------------------------------------------------------
//
// Lesson progress lives in the same flat record as module progress, keyed
// `moduleId/lessonId`. That keeps one storage shape for everything and lets a
// lesson page reuse the module page's quiz and checklist wiring unchanged.

/** Progress key for a lesson. */
export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}/${lessonId}`
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return getModule(moduleId)?.lessons?.find((l) => l.id === lessonId)
}

/** Every lesson progress key in the curriculum, for seeding default state. */
export function allLessonKeys(): string[] {
  return modules.flatMap((m) => (m.lessons ?? []).map((l) => lessonKey(m.id, l.id)))
}

/** Every lesson paired with its parent module, in curriculum order. */
export function allLessons(): { module: Module; lesson: Lesson }[] {
  return modules.flatMap((m) => (m.lessons ?? []).map((lesson) => ({ module: m, lesson })))
}

/**
 * Lessons grouped under their module's declared `lessonGroups`, in that order.
 * Lessons with no group (or an unlisted one) fall into a final untitled group so
 * nothing can be dropped from the landing page by a typo.
 */
export function groupedLessons(mod: Module): { label: string | null; lessons: Lesson[] }[] {
  const lessons = mod.lessons ?? []
  if (lessons.length === 0) return []
  const groups = mod.lessonGroups ?? []
  const result = groups
    .map((label) => ({ label: label as string | null, lessons: lessons.filter((l) => l.group === label) }))
    .filter((g) => g.lessons.length > 0)
  const ungrouped = lessons.filter((l) => !l.group || !groups.includes(l.group))
  if (ungrouped.length > 0) result.push({ label: null, lessons: ungrouped })
  return result
}

/**
 * Display title for a progress key, used to tell the docs assistant what the
 * learner is reading. Accepts both a module id and a `moduleId/lessonId` key.
 */
export function getFocusTitle(id: string): string | undefined {
  const [moduleId, lessonId] = id.split('/')
  const mod = getModule(moduleId)
  if (!mod) return undefined
  if (!lessonId) return mod.title
  const lesson = mod.lessons?.find((l) => l.id === lessonId)
  return lesson ? `${mod.title} → ${lesson.title}` : mod.title
}

export const priorityRank: Record<Priority, number> = { core: 0, recommended: 1, optional: 2 }

export const priorityLabel: Record<Priority, string> = {
  core: 'Core',
  recommended: 'Recommended',
  optional: 'Optional',
}

// ---------------------------------------------------------------------------
// Role paths
// ---------------------------------------------------------------------------
//
// Each role gets one guided path made up of exactly the modules marked `core`
// for that role. The path is expressed as a layered directed acyclic graph:
// `stages` are the columns of the diagram (left → right, always in Create →
// Ship → Scale → Secure order) and `edges` are the arrows between concept
// nodes. Stage membership drives both the diagram and the linear walkthrough
// order used by the Start button and the module page's next/previous controls,
// so the graph and the concepts can never drift apart.

export type PathStage = {
  /** Short column heading, e.g. "Build" — the platform section is on the node. */
  label: string
  section: PlatformSection
  /** Module ids rendered as nodes in this column, top to bottom. */
  modules: string[]
}

export type RolePath = {
  headline: string
  summary: string
  /** What the trainee should be able to do once the path is finished. */
  outcomes: string[]
  stages: PathStage[]
  /** DAG arrows between module ids. Every edge must point to a later stage. */
  edges: [string, string][]
}

export const rolePaths: Record<Role, RolePath> = {
  admin: {
    headline: 'Govern the platform',
    summary:
      'Start with the platform model, then work outward through the deploy pipeline, the public surface area you operate, and the controls that keep it locked down.',
    outcomes: [
      'Explain the deploy model and roll back a bad production deploy.',
      'Own domains, DNS, and certificates for the team.',
      'Configure access, SSO, and audit visibility.',
      'Set org-wide secret, CSP, and traffic-protection standards.',
    ],
    stages: [
      { label: 'Understand', section: 'Create', modules: ['foundations'] },
      { label: 'Pipeline', section: 'Ship', modules: ['deploys-previews'] },
      { label: 'Operate', section: 'Scale', modules: ['domains-network', 'monitoring'] },
      { label: 'Lock down', section: 'Secure', modules: ['access-governance', 'secure-builds-data'] },
    ],
    edges: [
      ['foundations', 'deploys-previews'],
      ['deploys-previews', 'domains-network'],
      ['deploys-previews', 'monitoring'],
      ['domains-network', 'access-governance'],
      ['monitoring', 'secure-builds-data'],
      ['domains-network', 'secure-builds-data'],
    ],
  },
  developer: {
    headline: 'Build and ship on the platform',
    summary:
      'Ground yourself in the deploy model, then pick up the compute and data primitives in parallel before mastering the pipeline that puts them in production safely.',
    outcomes: [
      'Choose the right compute primitive for a given use case.',
      'Pick between Netlify Database and Blobs, and cache deliberately.',
      'Use deploy contexts, previews, and environment variables correctly.',
      'Keep secrets, CSP, and rate limits right in every project.',
    ],
    stages: [
      { label: 'Understand', section: 'Create', modules: ['foundations'] },
      { label: 'Build', section: 'Create', modules: ['functions-edge', 'data-storage'] },
      { label: 'Extend', section: 'Create', modules: ['netlify-database', 'build-with-ai'] },
      { label: 'Pipeline', section: 'Ship', modules: ['deploys-previews'] },
      { label: 'Harden', section: 'Secure', modules: ['secure-builds-data'] },
    ],
    edges: [
      ['foundations', 'functions-edge'],
      ['foundations', 'data-storage'],
      ['data-storage', 'netlify-database'],
      ['functions-edge', 'build-with-ai'],
      ['netlify-database', 'deploys-previews'],
      ['build-with-ai', 'deploys-previews'],
      ['deploys-previews', 'secure-builds-data'],
    ],
  },
  builder: {
    headline: 'Create and publish without a backend',
    summary:
      'Learn the vocabulary first, then use Agent Runners and Forms to build something real, and finish on the deploy workflow that gets it reviewed and published.',
    outcomes: [
      'Describe deploys, previews, and the platform primitives in plain terms.',
      'Use Agent Runners to create and iterate from the dashboard.',
      'Ship a working form end to end, including notifications.',
      'Share a Deploy Preview for review before publishing.',
    ],
    stages: [
      { label: 'Understand', section: 'Create', modules: ['foundations'] },
      { label: 'Make', section: 'Create', modules: ['build-with-ai', 'forms'] },
      { label: 'Publish', section: 'Ship', modules: ['deploys-previews'] },
    ],
    edges: [
      ['foundations', 'build-with-ai'],
      ['foundations', 'forms'],
      ['build-with-ai', 'deploys-previews'],
      ['forms', 'deploys-previews'],
    ],
  },
}

export function isRole(value: unknown): value is Role {
  return value === 'admin' || value === 'developer' || value === 'builder'
}

export function getRoleMeta(role: Role) {
  return roles.find((r) => r.id === role)!
}

/** Modules of the role's guided path, in walkthrough order. */
export function corePath(role: Role): Module[] {
  return rolePaths[role].stages
    .flatMap((s) => s.modules)
    .map((id) => getModule(id))
    .filter((m): m is Module => !!m)
}

/** Modules at a given priority for a role, in curriculum order. */
export function modulesByPriority(role: Role, priority: Priority): Module[] {
  return modules.filter((m) => m.priority[role] === priority)
}

/** Position of a module inside the role's path, or -1 when it is off-path. */
export function pathIndex(role: Role, moduleId: string): number {
  return corePath(role).findIndex((m) => m.id === moduleId)
}
