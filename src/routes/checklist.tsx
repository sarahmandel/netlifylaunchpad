import { useEffect, useState } from 'react'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Square, SquareCheckBig } from 'lucide-react'
import {
  productionChecklist,
  securityChecklist,
  type ChecklistSection as ChecklistSectionData,
  type ChecklistCategory as ChecklistCategoryData,
} from '@/lib/checklists'
import { slug, flashElement } from '@/lib/search-index'

export const Route = createFileRoute('/checklist')({
  component: ChecklistPage,
})

const tierBadge = (tier: string) => {
  if (tier === 'pro') return <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">Pro+</span>
  if (tier === 'enterprise') return <span className="ml-auto shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">Enterprise</span>
  return null
}

function ChecklistSection({ section, checkedState, onToggle, activeSlug }: {
  section: ChecklistSectionData
  checkedState: boolean[]
  onToggle: (i: number) => void
  activeSlug?: string
}) {
  const containsActive = !!activeSlug && section.items.some((it) => slug(it.label) === activeSlug)
  const [open, setOpen] = useState(false)
  const done = checkedState.filter(Boolean).length
  const total = section.items.length

  // Expand automatically when a search result points at an item inside.
  useEffect(() => {
    if (containsActive) setOpen(true)
  }, [containsActive])

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
              id={`check-${slug(item.label)}`}
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

function ChecklistCategoryCard({ category, activeSlug }: { category: ChecklistCategoryData; activeSlug?: string }) {
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
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
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
            activeSlug={activeSlug}
          />
        ))}
      </div>
    </div>
  )
}

function ChecklistPage() {
  const hash = useRouterState({ select: (s) => s.location.hash })
  const activeSlug = hash && hash.startsWith('check-') ? hash.slice('check-'.length) : undefined

  // Flash the targeted item once its section has expanded and rendered it.
  useEffect(() => {
    if (activeSlug) flashElement(`check-${activeSlug}`)
  }, [activeSlug])

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

      <ChecklistCategoryCard category={productionChecklist} activeSlug={activeSlug} />
      <ChecklistCategoryCard category={securityChecklist} activeSlug={activeSlug} />
    </div>
  )
}
