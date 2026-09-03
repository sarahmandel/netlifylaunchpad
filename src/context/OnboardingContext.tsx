import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import {
  loadProgress,
  saveProgress,
  getDefaultModules,
  type OnboardingState,
  type UserProgress,
} from '@/lib/progress-store'
import { corePath, getModule, lessonKey, modules } from '@/lib/curriculum'
import type { Role } from '@/lib/curriculum'

export type { Role } from '@/lib/curriculum'

type OnboardingContextType = {
  moduleState: OnboardingState
  role: Role | null
  setRole: (role: Role | null) => void
  passQuiz: (moduleId: string) => void
  completeChecklist: (moduleId: string) => void
  isModuleComplete: (moduleId: string) => boolean
  isLessonComplete: (moduleId: string, lessonId: string) => boolean
  /** How many of a module's lessons are finished, for its landing page. */
  lessonProgress: (moduleId: string) => { done: number; total: number }
  completedCount: () => number
  totalCount: () => number
  getProgress: () => number
  allComplete: () => boolean
}

const CACHE_KEY = 'netlify-onboarding-progress-v2'
const CLIENT_KEY = 'netlify-onboarding-client-id'

function getClientId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(CLIENT_KEY)
    if (!id) {
      const c = globalThis.crypto
      id = c?.randomUUID ? c.randomUUID() : `c-${Date.now()}-${Math.floor(Math.random() * 1e9)}`
      localStorage.setItem(CLIENT_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

function loadCache(): UserProgress | null {
  try {
    const saved = localStorage.getItem(CACHE_KEY)
    if (saved) return JSON.parse(saved) as UserProgress
  } catch {}
  return null
}

function writeCache(progress: UserProgress) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(progress))
  } catch {}
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const cached = typeof window !== 'undefined' ? loadCache() : null
  const [moduleState, setModuleState] = useState<OnboardingState>(cached?.modules ?? getDefaultModules())
  const [role, setRoleState] = useState<Role | null>(cached?.role ?? null)
  const [hydrated, setHydrated] = useState(false)
  const clientId = useRef<string>('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    clientId.current = getClientId()
    let cancelled = false
    loadProgress({ data: clientId.current })
      .then((data) => {
        if (cancelled || !data) return
        setModuleState(data.modules)
        setRoleState(data.role)
        writeCache(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(
    (next: UserProgress) => {
      writeCache(next)
      if (!hydrated || !clientId.current) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveProgress({ data: { clientId: clientId.current, progress: next } }).catch(() => {})
      }, 400)
    },
    [hydrated],
  )

  const setRole = useCallback(
    (r: Role | null) => {
      setRoleState(r)
      persist({ role: r, modules: moduleState })
    },
    [moduleState, persist],
  )

  const passQuiz = useCallback(
    (moduleId: string) => {
      setModuleState((prev) => {
        const next = { ...prev, [moduleId]: { ...prev[moduleId], quizPassed: true } }
        persist({ role, modules: next })
        return next
      })
    },
    [role, persist],
  )

  const completeChecklist = useCallback(
    (moduleId: string) => {
      setModuleState((prev) => {
        const next = { ...prev, [moduleId]: { ...prev[moduleId], checklistCompleted: true } }
        persist({ role, modules: next })
        return next
      })
    },
    [role, persist],
  )

  const isComplete = useCallback(
    (key: string) => {
      const s = moduleState[key]
      return !!s && s.quizPassed && s.checklistCompleted
    },
    [moduleState],
  )

  const isLessonComplete = useCallback(
    (moduleId: string, lessonId: string) => isComplete(lessonKey(moduleId, lessonId)),
    [isComplete],
  )

  // A module made of subsections has no knowledge check of its own — it is
  // finished exactly when every one of its lessons is.
  const isModuleComplete = useCallback(
    (moduleId: string) => {
      const lessons = getModule(moduleId)?.lessons
      if (lessons && lessons.length > 0) {
        return lessons.every((l) => isComplete(lessonKey(moduleId, l.id)))
      }
      return isComplete(moduleId)
    },
    [isComplete],
  )

  const lessonProgress = useCallback(
    (moduleId: string) => {
      const lessons = getModule(moduleId)?.lessons ?? []
      return {
        done: lessons.filter((l) => isComplete(lessonKey(moduleId, l.id))).length,
        total: lessons.length,
      }
    },
    [isComplete],
  )

  // Progress is measured against the selected role's guided path — the modules
  // that role has to complete — rather than the whole curriculum, so an admin
  // is not marked incomplete for skipping developer-only material.
  const scope = useCallback(() => (role ? corePath(role) : modules), [role])

  const totalCount = useCallback(() => scope().length, [scope])
  const completedCount = useCallback(
    () => scope().filter((m) => isModuleComplete(m.id)).length,
    [scope, isModuleComplete],
  )
  const getProgress = useCallback(() => {
    const total = scope().length
    return total === 0 ? 0 : Math.round((completedCount() / total) * 100)
  }, [scope, completedCount])
  const allComplete = useCallback(() => completedCount() === scope().length, [scope, completedCount])

  return (
    <OnboardingContext.Provider
      value={{
        moduleState,
        role,
        setRole,
        passQuiz,
        completeChecklist,
        isModuleComplete,
        isLessonComplete,
        lessonProgress,
        completedCount,
        totalCount,
        getProgress,
        allComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}
