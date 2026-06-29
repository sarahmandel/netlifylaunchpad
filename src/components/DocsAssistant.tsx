import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Bot, X, Send, Sparkles } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What should I check before going live?',
  'How do I set up a custom domain?',
  'What are Netlify Functions?',
]

const WELCOME =
  "Hi! I'm the Netlify docs assistant. Ask me anything about Netlify — deploys, " +
  'domains, functions, or the pre-launch checklists. I answer using the official ' +
  'Netlify documentation.'

// Render assistant text safely, turning markdown links and bare URLs into
// clickable anchors. No HTML is injected — everything is plain React nodes.
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g

function renderText(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  LINK_RE.lastIndex = 0

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const label = match[1] ?? match[3]
    const url = match[2] ?? match[3]
    nodes.push(
      <a
        key={`l${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80 break-words"
      >
        {label}
      </a>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return nodes
}

export function DocsAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(text: string) {
    const question = text.trim()
    if (!question || loading) return

    const history: Message[] = [...messages, { role: 'user', content: question }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/docs-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok || !res.body) {
        let msg = 'Sorry, something went wrong. Please try again.'
        try {
          const data = await res.json()
          if (data?.error) msg = data.error
        } catch {
          /* keep default */
        }
        setMessages([...history, { role: 'assistant', content: msg }])
        return
      }

      // Stream the reply token by token into the last assistant message.
      setMessages([...history, { role: 'assistant', content: '' }])
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages([...history, { role: 'assistant', content: acc }])
      }

      if (!acc.trim()) {
        setMessages([
          ...history,
          { role: 'assistant', content: "I couldn't generate a response. Please try again." },
        ])
      }
    } catch {
      setMessages([
        ...history,
        { role: 'assistant', content: 'Network error — please check your connection and try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open documentation assistant"
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full gradient-teal text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity animate-fade-in glow-teal"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">Ask the Docs</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[calc(100vw-3rem)] sm:w-96 h-[34rem] max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-2xl animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-teal text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div className="leading-tight">
                <p className="font-semibold text-sm">Netlify Docs Assistant</p>
                <p className="text-[11px] opacity-90">Powered by the Netlify documentation</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="p-1 rounded-md hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="flex gap-2.5">
                  <div className="flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-accent text-accent-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                    {WELCOME}
                  </div>
                </div>
                <div className="space-y-2 pl-9">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-[13px] rounded-lg border border-border bg-background px-3 py-2 hover:bg-secondary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-accent text-accent-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                    m.role === 'user'
                      ? 'rounded-tr-none gradient-teal text-primary-foreground'
                      : 'rounded-tl-none bg-secondary text-secondary-foreground'
                  }`}
                >
                  {m.role === 'assistant' ? renderText(m.content) : m.content}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2.5">
                <div className="flex items-center justify-center h-7 w-7 shrink-0 rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-lg rounded-tl-none bg-secondary px-3 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about Netlify docs..."
                className="flex-1 resize-none bg-transparent text-sm focus:outline-none max-h-28"
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg gradient-teal text-primary-foreground disabled:opacity-40 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-center text-muted-foreground">
              Answers are generated from the Netlify documentation and may be imperfect.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
