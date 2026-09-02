import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Bot, X, SendHorizontal, Square, RotateCcw, Sparkles, TriangleAlert } from 'lucide-react'
import { Markdown } from '@/lib/markdown'
import { suggestedQuestions } from '@/lib/docs-library'

// Docs assistant.
//
// A grounded chat surface over the documentation the curriculum links to. The
// same <DocsChat /> renders inline on the docs page and inside the slide-over
// panel that any page can open through useDocsAssistant().

type Message = { role: 'user' | 'assistant'; content: string }

type OpenOptions = { moduleId?: string; question?: string }

type DocsAssistantContextValue = {
  open: boolean
  openAssistant: (options?: OpenOptions) => void
  closeAssistant: () => void
}

const DocsAssistantContext = createContext<DocsAssistantContextValue>({
  open: false,
  openAssistant: () => {},
  closeAssistant: () => {},
})

export function useDocsAssistant() {
  return useContext(DocsAssistantContext)
}

// -------------------------------------------------------------------- chat

export function DocsChat({
  moduleId,
  initialQuestion,
  className = '',
}: {
  /** Scopes answers to one curriculum module's documentation. */
  moduleId?: string
  /** Question to ask automatically when the chat first appears. */
  initialQuestion?: string
  className?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const send = useCallback(
    async (question: string) => {
      const text = question.trim()
      if (!text || streaming) return

      const history = [...messages, { role: 'user' as const, content: text }]
      setMessages([...history, { role: 'assistant', content: '' }])
      setInput('')
      setError(null)
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/docs-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, moduleId }),
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
            next[next.length - 1] = { role: 'assistant', content: answer }
            return next
          })
        }

        if (!answer.trim()) {
          throw new Error('The assistant returned an empty answer. Please try again.')
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Stopped by the user — keep whatever text already streamed in.
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
    [messages, moduleId, streaming],
  )

  // Fire the seeded question once, when the chat is first shown.
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current || !initialQuestion) return
    seeded.current = true
    void send(initialQuestion)
  }, [initialQuestion, send])

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const empty = messages.length === 0

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {empty && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar />
              <div className="text-sm text-muted-foreground pt-1.5">
                Ask anything about the Netlify documentation in this onboarding. Answers are grounded in the docs each
                module links to, with sources included.
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Try asking
              </p>
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="block w-full text-left text-sm rounded-lg border border-border px-3 py-2 hover:bg-secondary/60 hover:border-primary/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-lg rounded-br-sm gradient-teal text-primary-foreground px-3 py-2 text-sm whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <Avatar />
              <div className="max-w-[85%] text-sm text-muted-foreground leading-relaxed pt-1">
                {m.content ? <Markdown text={m.content} /> : <TypingDots />}
              </div>
            </div>
          ),
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder="Ask about the docs…"
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm max-h-32 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {streaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              aria-label="Stop generating"
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:bg-secondary transition-colors shrink-0"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void send(input)}
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex items-center justify-center h-9 w-9 rounded-lg gradient-teal text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            AI-generated — check the linked docs before acting on it.
          </p>
          {!empty && !streaming && (
            <button
              type="button"
              onClick={() => {
                setMessages([])
                setError(null)
                inputRef.current?.focus()
              }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <RotateCcw className="h-3 w-3" /> New chat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Avatar() {
  return (
    <div className="flex items-center justify-center h-7 w-7 rounded-lg gradient-teal text-primary-foreground shrink-0">
      <Bot className="h-4 w-4" />
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 pt-1.5" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  )
}

// ----------------------------------------------------------------- bubble

/**
 * Mounts the floating docs assistant once for the whole app: a launcher bubble
 * pinned to the bottom-right corner and the chat window that rises out of it.
 * The bubble and every "ask the docs" affordance elsewhere in the app open the
 * same conversation, which stays mounted after its first open so it survives
 * closing and reopening the window.
 */
export function DocsAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [options, setOptions] = useState<OpenOptions>({})

  const openAssistant = useCallback((next: OpenOptions = {}) => {
    setOptions(next)
    setMounted(true)
    setOpen(true)
  }, [])

  const closeAssistant = useCallback(() => setOpen(false), [])

  const toggleAssistant = useCallback(() => {
    setMounted(true)
    setOpen((o) => !o)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const value = useMemo(
    () => ({ open, openAssistant, closeAssistant }),
    [open, openAssistant, closeAssistant],
  )

  // A new module focus or seeded question starts a fresh conversation.
  const chatKey = `${options.moduleId ?? 'all'}:${options.question ?? ''}`

  return (
    <DocsAssistantContext.Provider value={value}>
      {children}

      {/*
        The widget sits below the command palette (z-[100]) and the mobile nav
        drawer (z-50) so neither is ever covered by it. There is deliberately no
        backdrop: the page stays readable and scrollable while the chat is open,
        which is the point of a bubble rather than a modal.
      */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {mounted && (
          <div
            className={`${
              open ? 'animate-pop-up' : 'hidden'
            } flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[min(32rem,calc(100vh-8rem))] rounded-xl border border-border bg-card shadow-2xl overflow-hidden`}
            role="dialog"
            aria-label="Docs assistant"
            aria-hidden={!open}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Avatar />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">Docs assistant</p>
                <p className="text-[11px] text-muted-foreground truncate">Answers from the Netlify docs</p>
              </div>
              <button
                type="button"
                onClick={closeAssistant}
                aria-label="Close docs assistant"
                className="ml-auto p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DocsChat
              key={chatKey}
              moduleId={options.moduleId}
              initialQuestion={options.question}
              className="flex-1 min-h-0"
            />
          </div>
        )}

        <button
          type="button"
          onClick={toggleAssistant}
          aria-label={open ? 'Close docs assistant' : 'Ask the docs assistant'}
          aria-expanded={open}
          title={open ? 'Close docs assistant' : 'Ask the docs assistant'}
          className="flex items-center justify-center h-14 w-14 rounded-full gradient-teal text-primary-foreground shadow-lg glow-teal hover:opacity-90 hover:scale-105 active:scale-95 transition-transform"
        >
          {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </button>
      </div>
    </DocsAssistantContext.Provider>
  )
}
