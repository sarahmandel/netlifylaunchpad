import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import {
  loadProgress,
  saveProgress,
  defaultBranding,
  getDefaultStages,
  type BrandingConfig,
  type OnboardingState,
  type Track,
  type UserProgress,
} from '@/lib/progress-store'

export type { Track } from '@/lib/progress-store'

type OnboardingContextType = {
  stages: OnboardingState
  track: Track
  setTrack: (track: Track) => void
  branding: BrandingConfig
  setBranding: (branding: Partial<BrandingConfig>) => void
  passQuiz: (stage: number) => void
  completeActivity: (stage: number) => void
  toggleManagerVerification: (stage: number) => void
  getProgress: () => number
  allVerified: () => boolean
}

const CACHE_KEY = 'netlify-onboarding-progress-cache'

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
  const [state, setState] = useState<OnboardingState>(cached?.stages ?? getDefaultStages())
  const [track, setTrackState] = useState<Track>(cached?.track ?? null)
  const [branding, setBrandingState] = useState<BrandingConfig>(cached?.branding ?? defaultBranding)
  const [hydrated, setHydrated] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    loadProgress()
      .then((data) => {
        if (cancelled || !data) return
        setState(data.stages)
        setTrackState(data.track)
        setBrandingState(data.branding)
        writeCache(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => { cancelled = true }
  }, [])

  const persist = useCallback((next: UserProgress) => {
    writeCache(next)
    if (!hydrated) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveProgress({ data: next }).catch(() => {})
    }, 400)
  }, [hydrated])

  const setTrack = useCallback((t: Track) => {
    setTrackState(t)
    persist({ stages: state, track: t, branding })
  }, [state, branding, persist])

  const setBranding = useCallback((partial: Partial<BrandingConfig>) => {
    setBrandingState(prev => {
      const next = { ...prev, ...partial }
      persist({ stages: state, track, branding: next })
      return next
    })
  }, [state, track, persist])

  const passQuiz = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], quizPassed: true } }
      persist({ stages: next, track, branding })
      return next
    })
  }, [track, branding, persist])

  const completeActivity = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], activityCompleted: true } }
      persist({ stages: next, track, branding })
      return next
    })
  }, [track, branding, persist])

  const toggleManagerVerification = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], managerVerified: !prev[stage].managerVerified } }
      persist({ stages: next, track, branding })
      return next
    })
  }, [track, branding, persist])

  const getProgress = useCallback(() => {
    const verified = Object.values(state).filter(s => s.managerVerified).length
    return (verified / 4) * 100
  }, [state])

  const allVerified = useCallback(() => {
    return Object.values(state).every(s => s.managerVerified)
  }, [state])

  return (
    <OnboardingContext.Provider value={{ stages: state, track, setTrack, branding, setBranding, passQuiz, completeActivity, toggleManagerVerification, getProgress, allVerified }}>
      {children}
    </OnboardingContext.Provider>
  )
}
