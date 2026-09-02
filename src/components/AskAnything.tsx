import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  Bot,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  Square,
  TriangleAlert,
} from 'lucide-react'
import { Markdown } from '@/lib/markdown'
import {
  RETRIEVAL_LIMIT,
  resolveTarget,
  retrievalQuery,
  searchNatural,
  type SearchResult,
} from '@/lib/search-index'

// Home page assistant.
//
// Two halves of the same search. While the learner types, the app's index is
// queried on every keystroke and the matches are shown live — that is the whole
// retrieval step, made visible. On submit the same matches are what the server
// grounds the answer in, so the "Grounded in" list under an answer is not a
// guess about the sources: it is the sources, produced by running the identical
// pure function over the identical static index.

type Message = {
  role: 'user' | 'assistant'
  content: string
  /** Records that grounded this answer. Set on assistant turns only. */
  sources?: SearchResult[]
}

const STARTERS = [
  'What is the difference between Functions and Edge Functions?',
  'What should I lock down before going to production?',
  'How do deploy previews fit into the Git workflow?',
  'Which prompts help me ship with an AI agent?',
]

export function AskAnything() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Matching is a synchronous pass over a static in-memory index, so it runs on
  // every keystroke without debouncing — memoised only to skip re-renders.
  const preview = useMemo(() => searchNatural(input, 5), [input])

  const askedSoFar = useMemo(
    () => messages.filter((m) => m.role === 'user').map((m) => m.content),
    [messages],
  )

  const send = useCallback(
    async (question: string) => {
      const text = question.trim()
      if (!text || streaming) return

      // Mirror exactly what the endpoint will retrieve for this turn.
      const sources = searchNatural(retrievalQuery([...askedSoFar, text]), RETRIEVAL_LIMIT)

      const history: Message[] = [...messages, { role: 'user', content: text }]
      setMessages([...history, { role: 'assistant', content: '', sources }])
      setInput('')
      setError(null)
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/search-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const detail = await res
            .json()
            .then((d: { error?: string }) => d.error)
            .catch(() => null)
          throw new Error(detail || 'The assistant is unavailable right now.')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let answer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          answer += decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content: answer, sources }
            return next
          })
        }

        if (!answer.trim()) {
          throw new Error('The assistant returned an empty answer. Please try again.')
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Stopped by the learner — keep whatever text already streamed in.
          setMessages((prev) => prev.filter((m) => m.content.trim() !== ''))
        } else {
          setError((err as Error).message)
          setMessages((prev) => prev.slice(0, -1))
        }
      } finally {
        abortRef.current = null
        setStreaming(false)
      }
    },
    [askedSoFar, messages, streaming],
  )

  useEffect(() => () => abortRef.current?.abort(), [])

  // Keep the newest turn in view as it streams.
  useEffect(() => {
    if (messages.length > 0) transcriptEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages])

  const open = (result: SearchResult) => {
    const { to, params, hash } = result.target
    navigate({ to, params, hash } as never)
  }

  const empty = messages.length === 0

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- transcript */}
      {!empty && (
        <div className="space-y-6">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-xl rounded-br-sm gradient-teal px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-teal text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-3 pt-1">
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {m.content ? <Markdown text={m.content} /> : <Thinking sources={m.sources} />}
                  </div>
                  {m.content && m.sources && m.sources.length > 0 && (
                    <GroundedIn sources={m.sources} onOpen={open} />
                  )}
                </div>
              </div>
            ),
          )}
          <div ref={transcriptEndRef} />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- composer */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder="Ask about deploys, edge functions, access control, checklists…"
            aria-label="Ask the onboarding a question"
            className="max-h-40 min-h-[3.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {streaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              aria-label="Stop generating"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void send(input)}
              disabled={!input.trim()}
              aria-label="Send question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-teal text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Retrieval, made visible: what the index matches as you type. */}
        {input.trim() !== '' && (
          <div className="border-t border-border px-3 py-2">
            <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {preview.length > 0
                ? `${preview.length} match${preview.length === 1 ? '' : 'es'} in this onboarding`
                : 'No matches in this onboarding yet'}
            </p>
            {preview.length === 0 ? (
              <p className="px-1 pb-1 text-xs text-muted-foreground">
                Try a product term like <span className="text-foreground">edge functions</span>,{' '}
                <span className="text-foreground">deploy previews</span>, or{' '}
                <span className="text-foreground">access control</span>.
              </p>
            ) : (
              <div className="space-y-0.5">
                {preview.map((r) => {
                  const Icon = r.icon
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => open(r)}
                      className="flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-secondary/60"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">{r.title}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {r.kindLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2">
          <p className="text-[11px] text-muted-foreground">
            AI-generated from this onboarding — check the linked docs before acting on it.
          </p>
          {!empty && !streaming && (
            <button
              type="button"
              onClick={() => {
                setMessages([])
                setError(null)
                inputRef.current?.focus()
              }}
              className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> New chat
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- conversation starters */}
      {empty && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Try asking
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {STARTERS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void send(q)}
                className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <span className="min-w-0 flex-1">{q}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Shows which records were retrieved while the answer is still streaming in. */
function Thinking({ sources }: { sources?: SearchResult[] }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex gap-1" aria-label="Thinking">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      {sources && sources.length > 0 && (
        <span>
          Reading {sources.length} match{sources.length === 1 ? '' : 'es'} from the index…
        </span>
      )}
    </span>
  )
}

function GroundedIn({
  sources,
  onOpen,
}: {
  sources: SearchResult[]
  onOpen: (result: SearchResult) => void
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Grounded in
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((r) => {
          const Icon = r.icon
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpen(r)}
              title={`${r.kindLabel} · ${resolveTarget(r.target)}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{r.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
