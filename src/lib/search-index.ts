// Global keyword search index.
//
// Aggregates every piece of user-facing content in the app — top-level pages,
// curriculum modules (and their concepts, best practices, and docs), prompt
// library entries, and checklist items — into a single flat list of records.
// A lightweight token-based matcher scores records against a query so the
// command palette can surface results from anywhere in the app.

import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  Network,
  type LucideIcon,
} from 'lucide-react'
import { corePath, modules, roles, rolePaths, sectionMeta } from '@/lib/curriculum'
import { prompts, trackLabels } from '@/lib/prompts'
import { checklistCategories } from '@/lib/checklists'

export type SearchKind = 'page' | 'module' | 'prompt' | 'checklist'

export type SearchTarget = {
  to: string
  params?: Record<string, string>
  /** Hash appended to the destination so the target content can be highlighted. */
  hash?: string
}

export type SearchRecord = {
  id: string
  kind: SearchKind
  /** Human label for the record's kind, shown as a group heading. */
  kindLabel: string
  icon: LucideIcon
  title: string
  /** Pre-lowercased title, so the matcher doesn't re-lowercase on every keystroke. */
  titleLower: string
  /** Short supporting line shown under the title. */
  subtitle?: string
  /** Extra context (e.g. "Module · Create") shown on the right. */
  context?: string
  /** All text the matcher searches over, pre-lowercased. */
  haystack: string
  target: SearchTarget
}

function build(): SearchRecord[] {
  const records: SearchRecord[] = []

  // ---- Top-level pages ----------------------------------------------------
  const pages: Array<{
    id: string
    title: string
    subtitle: string
    keywords: string
    icon: LucideIcon
    to: string
  }> = [
    {
      id: 'page-dashboard',
      title: 'Choose your role',
      subtitle: 'Pick admin, developer, or internal builder to start onboarding',
      keywords: 'home dashboard role admin developer builder getting started switch change role',
      icon: LayoutDashboard,
      to: '/',
    },
    {
      id: 'page-docs',
      title: 'Documentation',
      subtitle: 'Docs library and the docs assistant',
      keywords: 'docs documentation library assistant chat ai ask reference links',
      icon: BookOpen,
      to: '/docs',
    },
    {
      id: 'page-checklist',
      title: 'Checklists',
      subtitle: 'Production launch and security checklists',
      keywords: 'production launch security checklist tasks',
      icon: ClipboardCheck,
      to: '/checklist',
    },
    {
      id: 'page-prompts',
      title: 'Prompt Library',
      subtitle: 'Ready-to-use prompts for Netlify and AI agents',
      keywords: 'prompts ai agents copy templates library',
      icon: MessageSquare,
      to: '/prompts',
    },
  ]
  for (const p of pages) {
    records.push({
      id: p.id,
      kind: 'page',
      kindLabel: 'Pages',
      icon: p.icon,
      title: p.title,
      subtitle: p.subtitle,
      context: 'Page',
      titleLower: p.title.toLowerCase(),
      haystack: `${p.title} ${p.subtitle} ${p.keywords}`.toLowerCase(),
      target: { to: p.to },
    })
  }

  // ---- Role paths ---------------------------------------------------------
  for (const r of roles) {
    const path = rolePaths[r.id]
    const steps = corePath(r.id)
    records.push({
      id: `path-${r.id}`,
      kind: 'page',
      kindLabel: 'Pages',
      icon: Network,
      title: `${r.label} path`,
      subtitle: path.headline,
      context: 'Path overview',
      titleLower: `${r.label} path`.toLowerCase(),
      haystack: `${r.label} path ${path.headline} ${path.summary} ${r.blurb} ${path.outcomes.join(' ')} ${steps
        .map((m) => m.title)
        .join(' ')} role concepts graph overview`.toLowerCase(),
      target: { to: '/path/$roleId', params: { roleId: r.id } },
    })
  }

  // ---- Curriculum modules -------------------------------------------------
  for (const m of modules) {
    const body = [
      m.tagline,
      m.overview,
      ...m.concepts,
      ...m.bestPractices,
      ...m.docs.map((d) => d.label),
      Object.values(m.roleFocus).join(' '),
      m.addOn ? `${m.addOn.label} add-on ${m.addOn.note}` : '',
    ].join(' ')
    records.push({
      id: `module-${m.id}`,
      kind: 'module',
      kindLabel: 'Modules',
      icon: m.icon,
      title: m.title,
      subtitle: m.tagline,
      context: `Module · ${sectionMeta[m.section].label}`,
      titleLower: m.title.toLowerCase(),
      haystack: `${m.title} ${body}`.toLowerCase(),
      target: { to: '/module/$moduleId', params: { moduleId: m.id } },
    })
  }

  // ---- Prompt library -----------------------------------------------------
  for (const p of prompts) {
    records.push({
      id: `prompt-${p.title}`,
      kind: 'prompt',
      kindLabel: 'Prompts',
      icon: MessageSquare,
      title: p.title,
      subtitle: p.description,
      context: `${p.category} · ${trackLabels[p.track]}`,
      titleLower: p.title.toLowerCase(),
      haystack: `${p.title} ${p.description} ${p.prompt} ${p.category} ${trackLabels[p.track]}`.toLowerCase(),
      target: { to: '/prompts', hash: `prompt-${slug(p.title)}` },
    })
  }

  // ---- Checklist items ----------------------------------------------------
  for (const category of checklistCategories) {
    for (const section of category.sections) {
      for (const item of section.items) {
        records.push({
          id: `checklist-${slug(category.title)}-${slug(item.label)}`,
          kind: 'checklist',
          kindLabel: 'Checklist items',
          icon: ClipboardCheck,
          title: item.label,
          subtitle: `${category.title} · ${section.title}`,
          context: item.tier && item.tier !== 'all' ? tierLabel(item.tier) : undefined,
          titleLower: item.label.toLowerCase(),
          haystack: `${item.label} ${category.title} ${section.title}`.toLowerCase(),
          target: { to: '/checklist', hash: `check-${slug(item.label)}` },
        })
      }
    }
  }

  return records
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function tierLabel(tier: string): string {
  if (tier === 'pro') return 'Pro+'
  if (tier === 'enterprise') return 'Enterprise'
  return ''
}

export const searchRecords: SearchRecord[] = build()

export type SearchResult = SearchRecord & { score: number }

/**
 * Token-based keyword search. Every whitespace-separated term in the query must
 * appear somewhere in a record for it to match (AND semantics). Records are then
 * scored so that title matches, whole-word matches, and prefix matches rank
 * above incidental body matches.
 */
export function searchAll(query: string, limit = 40): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  // Compile each term's word-boundary matcher once per query, not once per
  // record. This is the difference between a few regex builds per keystroke and
  // several hundred, which is what made typing feel laggy.
  const compiled = terms.map((term) => ({
    term,
    boundary: new RegExp(`\\b${escapeRegExp(term)}`),
  }))

  const results: SearchResult[] = []
  for (const record of searchRecords) {
    const title = record.titleLower
    let score = 0
    let matchedAll = true

    for (const { term, boundary } of compiled) {
      const inTitle = title.includes(term)
      const inHay = record.haystack.includes(term)
      if (!inTitle && !inHay) {
        matchedAll = false
        break
      }
      if (inTitle) {
        score += 10
        if (title.startsWith(term)) score += 8
        if (boundary.test(title)) score += 4
      } else {
        score += 2
        if (boundary.test(record.haystack)) score += 1
      }
    }

    if (!matchedAll) continue

    // Exact / phrase bonus and a small per-kind nudge so pages and modules
    // (higher-level destinations) edge out deep body matches at equal relevance.
    if (title === q) score += 20
    else if (title.includes(q)) score += 6
    score += kindWeight(record.kind)

    results.push({ ...record, score })
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  return results.slice(0, limit)
}

function kindWeight(kind: SearchKind): number {
  switch (kind) {
    case 'page':
      return 3
    case 'module':
      return 2
    case 'prompt':
      return 1
    default:
      return 0
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Scroll an element into view and briefly outline it. Used by routes to focus
 * the specific item a search result pointed at (via the URL hash).
 */
export function flashElement(id: string, attempts = 8): void {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) {
    // The target may still be rendering (e.g. a section that just expanded).
    if (attempts > 0) {
      requestAnimationFrame(() => flashElement(id, attempts - 1))
    }
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.remove('search-flash')
  // Force reflow so the animation can retrigger if the same item is revisited.
  void el.offsetWidth
  el.classList.add('search-flash')
  setTimeout(() => el.classList.remove('search-flash'), 1800)
}

