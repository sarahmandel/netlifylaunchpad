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
  type LucideIcon,
} from 'lucide-react'
import { modules, sectionMeta } from '@/lib/curriculum'
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
      title: 'Dashboard',
      subtitle: 'Onboarding overview and your progress',
      keywords: 'home overview progress roles modules getting started',
      icon: LayoutDashboard,
      to: '/',
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
      haystack: `${p.title} ${p.subtitle} ${p.keywords}`.toLowerCase(),
      target: { to: p.to },
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
    ].join(' ')
    records.push({
      id: `module-${m.id}`,
      kind: 'module',
      kindLabel: 'Modules',
      icon: m.icon,
      title: m.title,
      subtitle: m.tagline,
      context: `Module · ${sectionMeta[m.section].label}`,
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

  const results: SearchResult[] = []
  for (const record of searchRecords) {
    const title = record.title.toLowerCase()
    let score = 0
    let matchedAll = true

    for (const term of terms) {
      const inTitle = title.includes(term)
      const inHay = record.haystack.includes(term)
      if (!inTitle && !inHay) {
        matchedAll = false
        break
      }
      if (inTitle) {
        score += 10
        if (title.startsWith(term)) score += 8
        if (new RegExp(`\\b${escapeRegExp(term)}`).test(title)) score += 4
      } else {
        score += 2
        if (new RegExp(`\\b${escapeRegExp(term)}`).test(record.haystack)) score += 1
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

