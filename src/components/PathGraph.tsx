import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleCheck, Clock, Flag, Sparkles } from 'lucide-react'
import { corePath, rolePaths, getModule, getRoleMeta, type Role } from '@/lib/curriculum'

// The path diagram is a layered directed acyclic graph. Nodes are real DOM
// elements (so they stay accessible, focusable, and reflow on small screens)
// and the arrows are drawn in an SVG layer underneath, positioned from measured
// node geometry. That means the graph never disagrees with the layout, however
// the columns wrap.

const ROOT = '__root'
const END = '__end'

type Anchor = { x: number; y: number }
type DrawnEdge = { id: string; from: Anchor; to: Anchor; active: boolean }

function curve(edge: DrawnEdge): string {
  const span = edge.to.y - edge.from.y
  const bend = Math.max(16, Math.min(48, span / 2))
  return `M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.from.y + bend} ${edge.to.x} ${
    edge.to.y - bend
  } ${edge.to.x} ${edge.to.y}`
}

export function PathGraph({
  role,
  selectedId,
  onSelect,
  isComplete,
}: {
  role: Role
  selectedId: string | null
  onSelect: (moduleId: string) => void
  isComplete: (moduleId: string) => boolean
}) {
  const path = rolePaths[role]
  const steps = useMemo(() => corePath(role), [role])
  const roleMeta = getRoleMeta(role)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())
  const [box, setBox] = useState({ width: 0, height: 0 })
  const [edges, setEdges] = useState<DrawnEdge[]>([])

  const register = useCallback((id: string) => {
    return (el: HTMLElement | null) => {
      if (el) nodeRefs.current.set(id, el)
      else nodeRefs.current.delete(id)
    }
  }, [])

  // Every arrow in the diagram, including the two synthetic framing nodes.
  const allEdges = useMemo<[string, string][]>(() => {
    const firstStage = path.stages[0]?.modules ?? []
    const lastStage = path.stages[path.stages.length - 1]?.modules ?? []
    return [
      ...firstStage.map((id) => [ROOT, id] as [string, string]),
      ...path.edges,
      ...lastStage.map((id) => [id, END] as [string, string]),
    ]
  }, [path])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const base = container.getBoundingClientRect()
    setBox((prev) =>
      prev.width === base.width && prev.height === base.height
        ? prev
        : { width: base.width, height: base.height },
    )

    const anchor = (id: string, side: 'top' | 'bottom'): Anchor | null => {
      const el = nodeRefs.current.get(id)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return {
        x: rect.left - base.left + rect.width / 2,
        y: (side === 'bottom' ? rect.bottom : rect.top) - base.top,
      }
    }

    const drawn: DrawnEdge[] = []
    for (const [from, to] of allEdges) {
      const start = anchor(from, 'bottom')
      const end = anchor(to, 'top')
      if (!start || !end) continue
      drawn.push({
        id: `${from}->${to}`,
        from: start,
        to: end,
        // The entry arrow is always live; every other arrow lights up once the
        // concept it leaves has been completed.
        active: from === ROOT || isComplete(from),
      })
    }
    setEdges(drawn)
  }, [allEdges, isComplete])

  useEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measure())
    observer.observe(container)
    for (const el of nodeRefs.current.values()) observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    // Web fonts landing after hydration can shift node geometry by a few pixels.
    const frame = requestAnimationFrame(() => measure())
    return () => cancelAnimationFrame(frame)
  }, [measure])

  const doneCount = steps.filter((s) => isComplete(s.id)).length
  const pathDone = doneCount === steps.length

  return (
    <div ref={containerRef} className="relative">
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-visible"
        width={box.width || undefined}
        height={box.height || undefined}
        viewBox={box.width ? `0 0 ${box.width} ${box.height}` : undefined}
      >
        <defs>
          <marker id="path-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-border" />
          </marker>
          <marker
            id="path-arrow-active"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" className="fill-primary" />
          </marker>
        </defs>
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={curve(edge)}
            fill="none"
            strokeWidth={edge.active ? 2 : 1.5}
            className={edge.active ? 'stroke-primary' : 'stroke-border'}
            markerEnd={`url(#${edge.active ? 'path-arrow-active' : 'path-arrow'})`}
          />
        ))}
      </svg>

      <div className="relative z-10 space-y-10">
        {/* Root of the tree — the role itself. */}
        <div className="grid gap-2 md:grid-cols-[7.5rem_1fr] md:items-center md:gap-4">
          <span className="hidden md:block" />
          <div className="flex justify-center">
            <div
              ref={register(ROOT)}
              className="inline-flex items-center gap-2 rounded-full gradient-teal px-4 py-2 text-primary-foreground shadow-sm"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold">{roleMeta.label} path</span>
              <span className="rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-medium">
                {doneCount}/{steps.length}
              </span>
            </div>
          </div>
        </div>

        {path.stages.map((stage, stageIndex) => (
          <div key={`${stage.label}-${stageIndex}`} className="grid gap-2 md:grid-cols-[7.5rem_1fr] md:items-center md:gap-4">
            <div className="md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{stage.section}</p>
              <p className="text-[11px] text-muted-foreground">{stage.label}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {stage.modules.map((moduleId) => {
                const mod = getModule(moduleId)
                if (!mod) return null
                const Icon = mod.icon
                const done = isComplete(mod.id)
                const selected = selectedId === mod.id
                const step = steps.findIndex((s) => s.id === mod.id) + 1
                return (
                  <button
                    key={mod.id}
                    ref={register(mod.id)}
                    type="button"
                    onClick={() => onSelect(mod.id)}
                    aria-pressed={selected}
                    className={`w-56 max-w-full rounded-xl border bg-card p-3.5 text-left transition-all hover:shadow-md ${
                      selected
                        ? 'border-primary ring-2 ring-primary/30'
                        : done
                          ? 'border-primary/40 bg-accent/50'
                          : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          done ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                          Concept {step}
                        </p>
                        <h3 className="text-sm font-semibold leading-snug">{mod.title}</h3>
                      </div>
                      {done && <CircleCheck className="h-4 w-4 shrink-0 text-primary" />}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground">{mod.tagline}</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" /> {mod.time}
                      {mod.addOn && (
                        <span className="ml-auto rounded border border-amber-500/20 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-amber-400">
                          {mod.addOn.label}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Leaf of the tree — the outcome. */}
        <div className="grid gap-2 md:grid-cols-[7.5rem_1fr] md:items-center md:gap-4">
          <span className="hidden md:block" />
          <div className="flex justify-center">
            <div
              ref={register(END)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${
                pathDone
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-dashed border-border bg-card text-muted-foreground'
              }`}
            >
              <Flag className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold">{path.headline}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
