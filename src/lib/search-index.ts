// Global keyword search index.
//
// Aggregates every piece of user-facing content in the app — top-level pages,
// curriculum modules (and their concepts, best practices, and docs), prompt
// library entries, and checklist items — into a single flat list of records.
// A lightweight token-based matcher scores records against a query so the
// command palette can surface results from anywhere in the app.
//
// The same index doubles as the retrieval layer for the home page assistant:
// `searchNatural` turns a spoken-language question into keywords and returns the
// best-matching records, whose `detail` text becomes the model's grounding.

import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  Network,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { allLessons, corePath, modules, roles, rolePaths, sectionMeta } from '@/lib/curriculum'
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
  /**
   * Original-case body text for this record, used to ground the home page
   * assistant. The haystack is lowercased for matching, which reads poorly in a
   * prompt, so retrieval quotes this instead.
   */
  detail: string
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
      id: 'page-home',
      title: 'Ask & search',
      subtitle: 'Ask a question and get an answer grounded in this onboarding',
      keywords:
        'home ask search chat assistant question answer ai find lookup explore start here index elastic fuzzy keyword',
      icon: Sparkles,
      to: '/',
    },
    {
      id: 'page-roles',
      title: 'Choose your role',
      subtitle: 'Pick admin, developer, or internal builder to start onboarding',
      keywords: 'dashboard role admin developer builder getting started switch change role onboarding path',
      icon: LayoutDashboard,
      to: '/roles',
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
      detail: `${p.title} — ${p.subtitle}.`,
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
      detail: [
        `${r.label} onboarding path — ${path.headline}`,
        path.summary,
        `Who it is for: ${r.blurb}`,
        'Outcomes:',
        ...path.outcomes.map((o) => `- ${o}`),
        `Core concepts in order: ${steps.map((m) => m.title).join(' → ')}`,
      ].join('\n'),
      target: { to: '/path/$roleId', params: { roleId: r.id } },
    })
  }

  // ---- Curriculum modules -------------------------------------------------
  for (const m of modules) {
    const subsections = m.lessons ?? []
    const body = [
      m.tagline,
      m.overview,
      ...m.concepts,
      ...m.bestPractices,
      ...m.docs.map((d) => d.label),
      ...subsections.map((l) => `${l.title} ${l.summary}`),
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
      detail: [
        `${m.title} (${sectionMeta[m.section].label} · ${m.time}) — ${m.tagline}`,
        m.overview,
        m.addOn ? `Availability: ${m.addOn.label} — ${m.addOn.note}` : '',
        'Key concepts:',
        ...m.concepts.map((c) => `- ${c}`),
        'Best practices:',
        ...m.bestPractices.map((b) => `- ${b}`),
        'Documentation:',
        ...m.docs.map((d) => `- ${d.label}: ${d.url}`),
        subsections.length > 0 ? `Subsections: ${subsections.map((l) => l.title).join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      target: { to: '/module/$moduleId', params: { moduleId: m.id } },
    })
  }

  // ---- Module subsections -------------------------------------------------
  // Indexed as their own destinations so a search for "credits" or "prerender"
  // lands on the subsection that covers it, not just its parent module.
  for (const { module: m, lesson } of allLessons()) {
    const body = [
      lesson.tagline,
      lesson.summary,
      lesson.overview,
      ...lesson.concepts,
      ...lesson.bestPractices,
      ...lesson.docs.map((d) => d.label),
      lesson.addOn ? `${lesson.addOn.label} ${lesson.addOn.note}` : '',
    ].join(' ')
    records.push({
      id: `lesson-${m.id}-${lesson.id}`,
      kind: 'module',
      kindLabel: 'Modules',
      icon: lesson.icon,
      title: lesson.title,
      subtitle: lesson.summary,
      context: `${m.title} · Subsection`,
      titleLower: lesson.title.toLowerCase(),
      haystack: `${lesson.title} ${m.title} ${body}`.toLowerCase(),
      detail: [
        `${lesson.title} — subsection of the ${m.title} module (${lesson.time}) — ${lesson.tagline}`,
        lesson.overview,
        lesson.addOn ? `Availability: ${lesson.addOn.label} — ${lesson.addOn.note}` : '',
        'Key concepts:',
        ...lesson.concepts.map((c) => `- ${c}`),
        'Best practices:',
        ...lesson.bestPractices.map((b) => `- ${b}`),
        'Documentation:',
        ...lesson.docs.map((d) => `- ${d.label}: ${d.url}`),
      ]
        .filter(Boolean)
        .join('\n'),
      target: { to: '/module/$moduleId/$lessonId', params: { moduleId: m.id, lessonId: lesson.id } },
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
      detail: [
        `Prompt "${p.title}" (${p.category} · ${trackLabels[p.track]}) — ${p.description}`,
        'Prompt text:',
        p.prompt,
      ].join('\n'),
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
          detail: `Checklist item in ${category.title} → ${section.title}: ${item.label}${
            item.tier && item.tier !== 'all' ? ` (${tierLabel(item.tier)} plans)` : ''
          }`,
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

// --------------------------------------------- natural-language retrieval

/**
 * Words that carry no signal in a question but would break `searchAll`, which
 * requires every term to match. "How do deploy previews work?" only finds
 * anything once "how", "do", and "work" are dropped.
 */
const STOPWORDS = new Set([
  'a', 'about', 'after', 'all', 'also', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'best',
  'between', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing', 'for', 'from', 'get', 'give',
  'had', 'has', 'have', 'help', 'her', 'here', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'just', 'know', 'let', 'like', 'looking', 'make', 'many', 'may', 'me', 'mean', 'means',
  'might', 'more', 'most', 'much', 'must', 'my', 'need', 'not', 'now', 'of', 'on', 'once', 'one',
  'only', 'or', 'other', 'our', 'out', 'over', 'please', 'same', 'say', 'see', 'should', 'show',
  'so', 'some', 'such', 'tell', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'they', 'this', 'those', 'to', 'up', 'use', 'used', 'using', 'very', 'want', 'was', 'way', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'why', 'will', 'with', 'work', 'works',
  'would', 'you', 'your',
])

/**
 * Reduce a spoken-language question to the terms worth matching on. Punctuation
 * is dropped, stopwords are removed, and very short tokens go with them — but
 * if that leaves nothing (a query made entirely of stopwords, or a two-letter
 * acronym), the raw tokens are kept so the query still does something.
 */
export function keywordsOf(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const kept = tokens.filter((t) => t.length > 2 && !STOPWORDS.has(t))
  return kept.length > 0 ? kept : tokens
}

/**
 * Question-shaped search over the same index the command palette uses.
 *
 * Tries the strict AND match first, because a record containing every keyword
 * is the strongest possible signal. When nothing satisfies all of them — the
 * common case for a long question — the per-term matches are unioned and their
 * scores summed, so records hitting more of the question still rank highest.
 */
export function searchNatural(query: string, limit = 8): SearchResult[] {
  const terms = keywordsOf(query)
  if (terms.length === 0) return []

  const strict = searchAll(terms.join(' '), limit)
  if (strict.length > 0) return strict

  const merged = new Map<string, SearchResult>()
  for (const term of terms) {
    for (const hit of searchAll(term, limit * 4)) {
      const existing = merged.get(hit.id)
      if (existing) existing.score += hit.score
      else merged.set(hit.id, { ...hit })
    }
  }

  return [...merged.values()]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
}

/** How many records ground a single answer. Shared so the sources listed in the
 * UI are exactly the ones the server retrieved. */
export const RETRIEVAL_LIMIT = 6

/**
 * The query a question is actually searched with. Follow-ups like "what about
 * the edge?" carry too little on their own, so the previous question is folded
 * in. Only the learner's own turns are used — feeding the assistant's words back
 * in would drift the search away from what was asked.
 */
export function retrievalQuery(userQuestions: string[]): string {
  return userQuestions.slice(-2).reverse().join(' ')
}

/** Collapse a search target into a plain href, for citations and plain links. */
export function resolveTarget(target: SearchTarget): string {
  const path = target.params
    ? Object.entries(target.params).reduce((acc, [key, value]) => acc.replace(`$${key}`, value), target.to)
    : target.to
  return target.hash ? `${path}#${target.hash}` : path
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

