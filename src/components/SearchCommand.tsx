import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, CornerDownLeft, ArrowUp, ArrowDown, X } from 'lucide-react'
import { searchAll, type SearchResult } from '@/lib/search-index'

type SearchContextValue = {
  open: boolean
  openSearch: () => void
  closeSearch: () => void
}

const SearchContext = createContext<SearchContextValue>({
  open: false,
  openSearch: () => {},
  closeSearch: () => {},
})

export function useSearch() {
  return useContext(SearchContext)
}

/**
 * Provides the global search state, mounts the command palette once, and binds
 * the ⌘K / Ctrl+K (and "/") shortcuts for the whole app.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openSearch = useCallback(() => setOpen(true), [])
  const closeSearch = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      // Bare "/" opens search unless the user is typing in a field.
      if (key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = document.activeElement as HTMLElement | null
        const typing =
          el &&
          (el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.isContentEditable)
        if (!typing) {
          e.preventDefault()
          setOpen(true)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <SearchContext.Provider value={{ open, openSearch, closeSearch }}>
      {children}
      {open && <SearchCommand onClose={closeSearch} />}
    </SearchContext.Provider>
  )
}

function highlight(text: string, terms: string[]) {
  if (terms.length === 0) return text
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(pattern)
  return parts.map((part, i) =>
    terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} className="bg-primary/25 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function SearchCommand({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const terms = useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query])
  const results = useMemo(() => searchAll(query), [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Reset the highlighted row whenever the result set changes.
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, results])

  const select = useCallback(
    (result: SearchResult | undefined) => {
      if (!result) return
      const { to, params, hash } = result.target
      navigate({ to, params, hash } as never)
      onClose()
    },
    [navigate, onClose],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      select(results[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  // Group results by kind while preserving a flat index for keyboard nav.
  const groups = useMemo(() => {
    const out: { label: string; items: { result: SearchResult; index: number }[] }[] = []
    results.forEach((result, index) => {
      const last = out[out.length - 1]
      if (last && last.label === result.kindLabel) {
        last.items.push({ result, index })
      } else {
        out.push({ label: result.kindLabel, items: [{ result, index }] })
      }
    })
    return out
  }, [results])

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative w-full max-w-xl rounded-xl border border-border bg-popover shadow-2xl overflow-hidden animate-fade-in"
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search modules, prompts, checklists…"
            className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search the app"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={listRef} className="max-h-[min(60vh,420px)] overflow-y-auto py-2">
          {query.trim() === '' && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Search across modules, prompts, and checklists.
            </p>
          )}

          {query.trim() !== '' && results.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>
                No results for <span className="text-foreground font-medium">“{query}”</span>
              </p>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
              {group.items.map(({ result, index }) => {
                const Icon = result.icon
                const active = index === activeIndex
                return (
                  <button
                    key={result.id}
                    data-index={index}
                    onClick={() => select(result)}
                    onMouseMove={() => setActiveIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      active ? 'bg-secondary' : 'hover:bg-secondary/60'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 ${
                        active ? 'gradient-teal text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">
                        {highlight(result.title, terms)}
                      </span>
                      {result.subtitle && (
                        <span className="block text-xs text-muted-foreground truncate">
                          {highlight(result.subtitle, terms)}
                        </span>
                      )}
                    </span>
                    {result.context && (
                      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground shrink-0 hidden sm:block">
                        {result.context}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            <ArrowDown className="h-3 w-3" /> navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-secondary font-mono">esc</kbd> close
          </span>
          {results.length > 0 && (
            <span className="ml-auto">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
