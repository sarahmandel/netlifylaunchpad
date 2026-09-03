// Documentation library.
//
// The onboarding curriculum already points at ~60 pages of official Netlify
// documentation, but those links only ever appear one module at a time. This
// module rolls them up into a single browsable library (grouped by platform
// section, deduplicated across modules) and into a compact knowledge base that
// grounds the docs assistant so it answers from the same material learners see.

import { modules, sectionOrder, sectionMeta } from '@/lib/curriculum'
import type { Module, PlatformSection } from '@/lib/curriculum'

export type DocEntry = {
  label: string
  url: string
  /** Modules that reference this page, in curriculum order. */
  modules: { id: string; title: string }[]
  section: PlatformSection
}

export type DocGroup = {
  section: PlatformSection
  label: string
  blurb: string
  entries: DocEntry[]
}

function buildLibrary(): DocGroup[] {
  const byUrl = new Map<string, DocEntry>()

  for (const m of modules) {
    // A module's own docs plus everything its subsections and further-reading
    // pointers reference, so the library never hides a page behind a subsection.
    const docs = [
      ...m.docs,
      ...(m.lessons ?? []).flatMap((l) => l.docs),
      ...(m.furtherTopics ?? []).map((t) => ({ label: t.title, url: t.url })),
    ]
    for (const d of docs) {
      const existing = byUrl.get(d.url)
      if (existing) {
        // Subsections repeat their parent module's pages, so credit each module
        // at most once per page.
        if (!existing.modules.some((entry) => entry.id === m.id)) {
          existing.modules.push({ id: m.id, title: m.title })
        }
        continue
      }
      byUrl.set(d.url, {
        label: d.label,
        url: d.url,
        section: m.section,
        modules: [{ id: m.id, title: m.title }],
      })
    }
  }

  return sectionOrder.map((section) => ({
    section,
    label: sectionMeta[section].label,
    blurb: sectionMeta[section].blurb,
    entries: [...byUrl.values()].filter((e) => e.section === section),
  }))
}

export const docGroups: DocGroup[] = buildLibrary()

export const allDocs: DocEntry[] = docGroups.flatMap((g) => g.entries)

/** Case-insensitive label/URL/module filter used by the docs page search box. */
export function filterDocs(query: string): DocGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return docGroups
  return docGroups
    .map((g) => ({
      ...g,
      entries: g.entries.filter((e) =>
        `${e.label} ${e.url} ${e.modules.map((m) => m.title).join(' ')}`.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.entries.length > 0)
}

function moduleDigest(m: Module): string {
  return [
    `## ${m.title} (module id: ${m.id} · section: ${m.section} · ${m.time})`,
    m.overview,
    'Key concepts:',
    ...m.concepts.map((c) => `- ${c}`),
    'Best practices:',
    ...m.bestPractices.map((b) => `- ${b}`),
    ...(m.checklist && m.checklist.length > 0
      ? ['Hands-on activities:', ...m.checklist.map((c) => `- ${c}`)]
      : []),
    'Documentation:',
    ...m.docs.map((d) => `- ${d.label}: ${d.url}`),
    // Subsections carry most of the material for modules that have them, so the
    // assistant needs them in its grounding, not just the parent summary.
    ...(m.lessons ?? []).flatMap((lesson) => [
      '',
      `### ${lesson.title} (subsection id: ${m.id}/${lesson.id} · ${lesson.time})`,
      lesson.overview,
      ...(lesson.addOn ? [`Availability: ${lesson.addOn.label} — ${lesson.addOn.note}`] : []),
      'Key concepts:',
      ...lesson.concepts.map((c) => `- ${c}`),
      'Best practices:',
      ...lesson.bestPractices.map((b) => `- ${b}`),
      'Hands-on activities:',
      ...lesson.checklist.map((c) => `- ${c}`),
      'Documentation:',
      ...lesson.docs.map((d) => `- ${d.label}: ${d.url}`),
    ]),
    ...(m.furtherTopics ?? []).flatMap((t) => ['', `### Also worth knowing: ${t.title}`, t.note, `Docs: ${t.url}`]),
  ].join('\n')
}

/**
 * The full curriculum rendered as grounding context for the assistant. Built
 * once at module load — it is static content, so there is no reason to rebuild
 * it per request.
 */
export const docsKnowledgeBase: string = modules.map(moduleDigest).join('\n\n')

/** Starter questions shown before a conversation has any messages. */
export const suggestedQuestions: string[] = [
  'What is the difference between Functions and Edge Functions?',
  'How do deploy contexts and deploy previews work?',
  'When should I use Blobs instead of the Netlify Database?',
  'What should an admin lock down before going to production?',
]
