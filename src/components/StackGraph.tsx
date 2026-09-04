import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CircleCheck, Gauge } from 'lucide-react'
import { getLesson, type Module } from '@/lib/curriculum'
import { getStackGraph, type StackEdge, type StackNode } from '@/lib/ai-stack'

// A horizontal layered DAG of the section's subsections and the stack around
// them. It follows the same technique as PathGraph: nodes are real DOM elements
// — links, so they stay focusable and keep working when the layout reflows —
// and the arrows are drawn in an SVG layer underneath from measured geometry,
// so the edges can never disagree with where the boxes actually ended up.
//
// Two kinds of edge are drawn. Flow edges run left to right between adjacent
// stages, from the right edge of one node to the left edge of the next. Control
// edges drop straight down from a metered node into the governance band, which
// is why governance is not a column: nothing in a request passes through it.

const CONTROL = '__control'

type Anchor = { x: number; y: number }
type DrawnEdge = { id: string; from: Anchor; to: Anchor; control: boolean }

function flowCurve(edge: DrawnEdge): string {
  const span = edge.to.x - edge.from.x
  const bend = Math.max(14, Math.min(56, span / 2))
  return `M ${edge.from.x} ${edge.from.y} C ${edge.from.x + bend} ${edge.from.y} ${
    edge.to.x - bend
  } ${edge.to.y} ${edge.to.x} ${edge.to.y}`
}

function controlCurve(edge: DrawnEdge): string {
  const span = edge.to.y - edge.from.y
  const bend = Math.max(12, Math.min(32, span / 2))
  return `M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.from.y + bend} ${edge.to.x} ${
    edge.to.y - bend
  } ${edge.to.x} ${edge.to.y}`
}

function LegendChip({ swatch, children }: { swatch: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={`h-3 w-3 shrink-0 rounded ${swatch}`} />
      {children}
    </span>
  )
}

/** The card for one node. Lessons and platform primitives link; nothing else does. */
function StackNodeCard({
  node,
  moduleId,
  done,
  register,
}: {
  node: StackNode
  moduleId: string
  done: boolean
  register: (id: string) => (el: HTMLElement | null) => void
}) {
  const Icon = node.icon
  const lesson = node.kind === 'lesson' ? node.lessonId : undefined

  const shell =
    node.kind === 'lesson'
      ? `border-primary/40 ${done ? 'bg-primary/10' : 'bg-accent/40'} hover:border-primary hover:shadow-md`
      : node.kind === 'platform'
        ? 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
        : 'border-dashed border-border bg-transparent'

  const iconShell =
    node.kind === 'lesson'
      ? done
        ? 'gradient-teal text-primary-foreground'
        : 'bg-primary/15 text-primary'
      : node.kind === 'platform'
        ? 'bg-secondary text-muted-foreground'
        : 'bg-transparent text-muted-foreground/70'

  const body = (
    <>
      <div className="flex items-start gap-2">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconShell}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[11.5px] font-semibold leading-tight">{node.label}</h4>
        </div>
        {node.kind === 'lesson' && done && (
          <CircleCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-label="Complete" />
        )}
        {node.metered && !done && (
          <Gauge className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Draws plan credits" />
        )}
      </div>
      <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">{node.role}</p>
      {node.kind === 'lesson' && (
        <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-primary">Subsection</p>
      )}
    </>
  )

  const shared = `block w-[10rem] shrink-0 rounded-xl border p-2.5 text-left transition-all ${shell}`

  if (lesson) {
    return (
      <div ref={register(node.id)} className="w-[10rem] shrink-0">
        <Link
          to="/module/$moduleId/$lessonId"
          params={{ moduleId, lessonId: lesson }}
          aria-label={`Open subsection: ${node.label}`}
          className={shared}
        >
          {body}
        </Link>
      </div>
    )
  }

  if (node.kind === 'platform' && node.moduleId) {
    return (
      <div ref={register(node.id)} className="w-[10rem] shrink-0">
        <Link
          to="/module/$moduleId"
          params={{ moduleId: node.moduleId }}
          aria-label={`Open concept: ${node.label}`}
          className={shared}
        >
          {body}
        </Link>
      </div>
    )
  }

  return (
    <div ref={register(node.id)} className={shared}>
      {body}
    </div>
  )
}

export function StackGraph({
  mod,
  isLessonComplete,
}: {
  mod: Module
  isLessonComplete: (moduleId: string, lessonId: string) => boolean
}) {
  const graph = getStackGraph(mod.id)
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

  // Flow edges come from the graph; control edges are derived, so a node only
  // has to declare that it is metered to be wired into the governance band.
  const controlEdges = useMemo<StackEdge[]>(() => {
    if (!graph) return []
    return graph.stages
      .flatMap((stage) => stage.nodes)
      .filter((node) => node.metered)
      .map((node) => [node.id, CONTROL] as StackEdge)
  }, [graph])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container || !graph) return
    const base = container.getBoundingClientRect()
    setBox((prev) =>
      prev.width === base.width && prev.height === base.height
        ? prev
        : { width: base.width, height: base.height },
    )

    const anchor = (id: string, side: 'right' | 'left' | 'bottom' | 'top'): Anchor | null => {
      const el = nodeRefs.current.get(id)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      const x =
        side === 'right' ? rect.right : side === 'left' ? rect.left : rect.left + rect.width / 2
      const y = side === 'bottom' ? rect.bottom : side === 'top' ? rect.top : rect.top + rect.height / 2
      return { x: x - base.left, y: y - base.top }
    }

    const drawn: DrawnEdge[] = []
    for (const [from, to] of graph.edges) {
      const start = anchor(from, 'right')
      const end = anchor(to, 'left')
      if (!start || !end) continue
      drawn.push({ id: `${from}->${to}`, from: start, to: end, control: false })
    }
    for (const [from] of controlEdges) {
      const start = anchor(from, 'bottom')
      const band = anchor(CONTROL, 'top')
      if (!start || !band) continue
      // The band spans the full width of the diagram, so the edge can drop
      // straight down from the node rather than reaching for a card inside it.
      drawn.push({ id: `${from}->control`, from: start, to: { x: start.x, y: band.y }, control: true })
    }
    setEdges(drawn)
  }, [graph, controlEdges])

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

  if (!graph) return null

  const controlLessons = graph.control.lessonIds
    .map((id) => ({ id, lesson: getLesson(mod.id, id) }))
    .filter((entry): entry is { id: string; lesson: NonNullable<ReturnType<typeof getLesson>> } =>
      Boolean(entry.lesson),
    )

  return (
    // A seven-stage diagram is wider than the page's reading column, so on wide
    // screens it reclaims the slack either side of that column before falling
    // back to horizontal scrolling.
    <div className="rounded-xl border border-border bg-card p-5 xl:-mx-8 2xl:-mx-32">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-semibold">Where each piece fits in the stack</h2>
        <p className="text-[11px] text-muted-foreground">Build time on the left, request time on the right</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Every subsection of this section is a box below, placed in the layer it actually belongs to and wired to
        what it talks to. Boxes with a teal edge are subsections — open one to work through it. Plain boxes are the
        rest of the stack around them and open their own concept; dashed boxes sit outside Netlify.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <LegendChip swatch="border border-primary/40 bg-accent">Subsection of this section</LegendChip>
        <LegendChip swatch="border border-border bg-card">Platform primitive</LegendChip>
        <LegendChip swatch="border border-dashed border-border">Outside Netlify</LegendChip>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Gauge className="h-3 w-3 shrink-0 text-amber-400" /> Draws plan credits
        </span>
      </div>

      <p className="sr-only">
        The diagram runs in {graph.stages.length} stages:{' '}
        {graph.stages.map((stage) => stage.label).join(', then ')}. A separate control plane —{' '}
        {graph.control.label} — governs the metered nodes rather than sitting in the request path. Each box is a
        link, listed here stage by stage.
      </p>

      <div className="mt-5 overflow-x-auto pb-3">
        <div ref={containerRef} className="relative w-max min-w-full">
          <svg
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-visible"
            width={box.width || undefined}
            height={box.height || undefined}
            viewBox={box.width ? `0 0 ${box.width} ${box.height}` : undefined}
          >
            <defs>
              <marker
                id="stack-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" className="fill-border" />
              </marker>
              <marker
                id="stack-arrow-control"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" className="fill-amber-400" />
              </marker>
            </defs>
            {edges.map((edge) => (
              <path
                key={edge.id}
                d={edge.control ? controlCurve(edge) : flowCurve(edge)}
                fill="none"
                strokeWidth={1.5}
                strokeDasharray={edge.control ? '4 4' : undefined}
                className={edge.control ? 'stroke-amber-400/70' : 'stroke-border'}
                markerEnd={`url(#${edge.control ? 'stack-arrow-control' : 'stack-arrow'})`}
              />
            ))}
          </svg>

          <div className="relative z-10 flex items-stretch gap-6">
            {graph.stages.map((stage) => (
              <div key={stage.id} className="flex shrink-0 flex-col">
                <div className="mb-3 w-[10rem]">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground">{stage.phase}</p>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3">
                  {stage.nodes.map((node) => (
                    <StackNodeCard
                      key={node.id}
                      node={node}
                      moduleId={mod.id}
                      done={node.lessonId ? isLessonComplete(mod.id, node.lessonId) : false}
                      register={register}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* The control plane: cross-cutting, so it is a band under the whole
              diagram rather than a stage inside it. */}
          <div
            ref={register(CONTROL)}
            className="relative z-10 mt-8 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4"
          >
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 shrink-0 text-amber-400" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Control plane · {graph.control.label}
              </h3>
            </div>
            <p className="mt-1 max-w-3xl text-[11px] leading-snug text-muted-foreground">{graph.control.note}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {controlLessons.map(({ id, lesson }) => {
                const LessonIcon = lesson.icon
                const done = isLessonComplete(mod.id, id)
                return (
                  <Link
                    key={id}
                    to="/module/$moduleId/$lessonId"
                    params={{ moduleId: mod.id, lessonId: id }}
                    aria-label={`Open subsection: ${lesson.title}`}
                    className={`flex w-[15rem] shrink-0 items-start gap-2 rounded-lg border p-2.5 transition-all hover:shadow-md ${
                      done
                        ? 'border-primary/40 bg-primary/10 hover:border-primary'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        done ? 'gradient-teal text-primary-foreground' : 'bg-primary/15 text-primary'
                      }`}
                    >
                      <LessonIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-1.5">
                        <h4 className="text-[11.5px] font-semibold leading-tight">{lesson.title}</h4>
                        {done && <CircleCheck className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
                      </div>
                      <p className="mt-1 text-[10px] leading-snug text-muted-foreground">{lesson.tagline}</p>
                      <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-primary">
                        Subsection
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
