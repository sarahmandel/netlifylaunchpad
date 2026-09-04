import {
  Bot,
  Boxes,
  BrainCircuit,
  DatabaseZap,
  FileText,
  FormInput,
  FunctionSquare,
  GitBranch,
  Globe,
  HardDrive,
  ImageIcon,
  KeyRound,
  PackageCheck,
  Rocket,
  ScanSearch,
  Sparkles,
  Terminal,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// The "Build with AI" section teaches nine subsections in three groups, but a
// grouped list of cards does not answer the question people actually arrive
// with: where does each of these things sit in my stack, and what does it talk
// to? This module describes that answer as a layered directed acyclic graph so
// the section's landing page can draw it.
//
// The layers run left to right in lifecycle order — the build-time half of the
// stack first (who writes the code, where it comes from, what builds it), then
// the request-time half (what serves a request, what handles it, what backs it,
// what it calls out to). Every edge therefore points rightwards, which is what
// makes the graph acyclic.
//
// Governance is deliberately not a stage. Enablement, privacy, and credits are
// not something a request passes through — they are a control plane sitting
// under the whole diagram, so the three "Govern and pay for AI" subsections are
// drawn as a band and the metered nodes drop a dashed edge into it.

export type StackNodeKind =
  /** A subsection of the module — the node is the lesson. */
  | 'lesson'
  /** A Netlify platform primitive, taught by some other module. */
  | 'platform'
  /** Something outside Netlify that the stack talks to. */
  | 'external'

export type StackNode = {
  id: string
  label: string
  /** One line: what this piece does in the stack, not what it is. */
  role: string
  icon: LucideIcon
  kind: StackNodeKind
  /** Set on lesson nodes — the subsection this node opens. */
  lessonId?: string
  /** Set on platform nodes that have a module of their own to open. */
  moduleId?: string
  /** Draws on plan credits, so the control plane governs it. */
  metered?: boolean
}

export type StackStage = {
  id: string
  label: string
  /** Which half of the lifecycle the stage belongs to. */
  phase: 'Build time' | 'Request time'
  nodes: StackNode[]
}

/** A left-to-right dependency: `[fromNodeId, toNodeId]`. */
export type StackEdge = [string, string]

export type StackGraph = {
  stages: StackStage[]
  edges: StackEdge[]
  /** The cross-cutting band under the pipeline. */
  control: {
    label: string
    note: string
    /** Subsections that make up the control plane, in order. */
    lessonIds: string[]
  }
}

const aiStack: StackGraph = {
  stages: [
    {
      id: 'author',
      label: 'Author',
      phase: 'Build time',
      nodes: [
        {
          id: 'agent-runners',
          label: 'Agent Runners',
          role: 'Netlify runs the agent on your project and opens a Deploy Preview',
          icon: Bot,
          kind: 'lesson',
          lessonId: 'agent-runners',
          metered: true,
        },
        {
          id: 'agent-setup',
          label: 'MCP Server & Skills',
          role: 'Your own editor’s agent, given real Netlify tools and context',
          icon: Terminal,
          kind: 'lesson',
          lessonId: 'agent-setup',
        },
        {
          id: 'prototyping',
          label: 'Prototyping',
          role: 'Prompt to an MVP, then claim the deployment into your account',
          icon: Rocket,
          kind: 'lesson',
          lessonId: 'prototyping',
        },
      ],
    },
    {
      id: 'sources',
      label: 'Sources of truth',
      phase: 'Build time',
      nodes: [
        {
          id: 'git',
          label: 'Git repository',
          role: 'The branch an agent commits to and the trigger for every deploy',
          icon: GitBranch,
          kind: 'platform',
          moduleId: 'deploys-previews',
        },
        {
          id: 'cms',
          label: 'CMS',
          role: 'Headless content, pulled at build time or fetched at request time',
          icon: FileText,
          kind: 'external',
        },
        {
          id: 'env',
          label: 'Env vars & secrets',
          role: 'Configuration and keys, scoped per deploy context',
          icon: KeyRound,
          kind: 'platform',
          moduleId: 'secure-builds-data',
        },
      ],
    },
    {
      id: 'build',
      label: 'Build & deploy',
      phase: 'Build time',
      nodes: [
        {
          id: 'deploy',
          label: 'Build & deploy',
          role: 'Turns a commit into an immutable deploy, with a preview per pull request',
          icon: PackageCheck,
          kind: 'platform',
          moduleId: 'deploys-previews',
        },
      ],
    },
    {
      id: 'delivery',
      label: 'Edge delivery',
      phase: 'Request time',
      nodes: [
        {
          id: 'cdn',
          label: 'CDN & routing',
          role: 'Serves the deploy from the edge and routes what it cannot serve',
          icon: Globe,
          kind: 'platform',
          moduleId: 'domains-network',
        },
        {
          id: 'prerender',
          label: 'Prerender for AI crawlers',
          role: 'Matches crawler user agents at the edge and rewrites them to a render function',
          icon: ScanSearch,
          kind: 'lesson',
          lessonId: 'crawler-readable-content',
        },
        {
          id: 'image-cdn',
          label: 'Image CDN',
          role: 'Transforms and caches images on the way out',
          icon: ImageIcon,
          kind: 'platform',
          moduleId: 'data-storage',
        },
      ],
    },
    {
      id: 'runtime',
      label: 'Runtime',
      phase: 'Request time',
      nodes: [
        {
          id: 'edge-functions',
          label: 'Edge Functions',
          role: 'Low-latency logic that runs before the response leaves the edge',
          icon: Zap,
          kind: 'platform',
          moduleId: 'functions-edge',
        },
        {
          id: 'functions',
          label: 'Functions & server routes',
          role: 'Where your AI calls live — and where the prerender function runs',
          icon: FunctionSquare,
          kind: 'platform',
          moduleId: 'functions-edge',
        },
        {
          id: 'code-agents',
          label: 'AI tools & code agents',
          role: 'Your product deploying other people’s projects through the Netlify API',
          icon: Boxes,
          kind: 'lesson',
          lessonId: 'code-agents',
        },
        {
          id: 'forms',
          label: 'Forms',
          role: 'Submissions captured by the platform with no backend code',
          icon: FormInput,
          kind: 'platform',
          moduleId: 'forms',
        },
      ],
    },
    {
      id: 'backing',
      label: 'Backing services',
      phase: 'Request time',
      nodes: [
        {
          id: 'ai-gateway',
          label: 'AI Gateway',
          role: 'Model access with no provider keys of your own, billed to plan credits',
          icon: Sparkles,
          kind: 'lesson',
          lessonId: 'ai-gateway',
          metered: true,
        },
        {
          id: 'database',
          label: 'Database',
          role: 'Managed Postgres, with a database branch per Deploy Preview',
          icon: DatabaseZap,
          kind: 'platform',
          moduleId: 'netlify-database',
        },
        {
          id: 'blobs',
          label: 'Blobs',
          role: 'Key/value object storage for unstructured state',
          icon: HardDrive,
          kind: 'platform',
          moduleId: 'data-storage',
        },
      ],
    },
    {
      id: 'providers',
      label: 'Model providers',
      phase: 'Request time',
      nodes: [
        {
          id: 'model-providers',
          label: 'Anthropic · OpenAI · Gemini · OpenRouter',
          role: 'The inference the Gateway proxies to — no training on Netlify inputs',
          icon: BrainCircuit,
          kind: 'external',
        },
      ],
    },
  ],
  edges: [
    // Author → source of truth: every route to code ends in a commit.
    ['agent-runners', 'git'],
    ['agent-setup', 'git'],
    ['prototyping', 'git'],
    // Source of truth → build.
    ['git', 'deploy'],
    ['cms', 'deploy'],
    ['env', 'deploy'],
    // Build → what the edge serves.
    ['deploy', 'cdn'],
    ['deploy', 'prerender'],
    ['deploy', 'image-cdn'],
    // Edge → whatever handles the request.
    ['cdn', 'edge-functions'],
    ['cdn', 'functions'],
    ['cdn', 'code-agents'],
    ['cdn', 'forms'],
    ['prerender', 'functions'],
    // Runtime → backing services.
    ['edge-functions', 'ai-gateway'],
    ['edge-functions', 'blobs'],
    ['functions', 'ai-gateway'],
    ['functions', 'database'],
    ['functions', 'blobs'],
    ['code-agents', 'ai-gateway'],
    ['code-agents', 'database'],
    // Backing services → outside Netlify.
    ['ai-gateway', 'model-providers'],
  ],
  control: {
    label: 'Govern and pay for AI',
    note: 'Not a stage in the stack — a control plane over it. One Team Owner switch turns Agent Runners and AI Gateway on or off, both meter to the same AI inference credits, and each has its own data-handling posture.',
    lessonIds: ['manage-ai-features', 'security-privacy', 'credits-and-pricing'],
  },
}

/** The stack graph for a module, when that module has one. */
export const stackGraphs: Record<string, StackGraph> = {
  'build-with-ai': aiStack,
}

export function getStackGraph(moduleId: string): StackGraph | undefined {
  return stackGraphs[moduleId]
}
