import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Track = 'developer' | 'non-developer' | null

type StageState = {
  quizPassed: boolean
  activityCompleted: boolean
  managerVerified: boolean
}

type BrandingConfig = {
  companyName: string
  logoUrl: string
  primaryColor: string
  accentColor: string
}

type OnboardingState = Record<number, StageState>

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

const STORAGE_KEY = 'netlify-onboarding-progress'
const TRACK_KEY = 'netlify-onboarding-track'
const BRANDING_KEY = 'netlify-onboarding-branding'

const defaultBranding: BrandingConfig = {
  companyName: 'Netlify',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
}

function getDefaultState(): OnboardingState {
  return {
    1: { quizPassed: false, activityCompleted: false, managerVerified: false },
    2: { quizPassed: false, activityCompleted: false, managerVerified: false },
    3: { quizPassed: false, activityCompleted: false, managerVerified: false },
    4: { quizPassed: false, activityCompleted: false, managerVerified: false },
  }
}

function loadState(): OnboardingState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const defaults = getDefaultState()
      for (const key of Object.keys(defaults)) {
        parsed[key] = { ...defaults[Number(key)], ...parsed[key] }
      }
      return parsed
    }
  } catch {}
  return getDefaultState()
}

function loadTrack(): Track {
  try {
    const saved = localStorage.getItem(TRACK_KEY)
    if (saved === 'developer' || saved === 'non-developer') return saved
  } catch {}
  return null
}

function loadBranding(): BrandingConfig {
  try {
    const saved = localStorage.getItem(BRANDING_KEY)
    if (saved) return { ...defaultBranding, ...JSON.parse(saved) }
  } catch {}
  return defaultBranding
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState)
  const [track, setTrackState] = useState<Track>(loadTrack)
  const [branding, setBrandingState] = useState<BrandingConfig>(loadBranding)

  const setTrack = useCallback((t: Track) => {
    setTrackState(t)
    try { localStorage.setItem(TRACK_KEY, t ?? '') } catch {}
  }, [])

  const setBranding = useCallback((partial: Partial<BrandingConfig>) => {
    setBrandingState(prev => {
      const next = { ...prev, ...partial }
      try { localStorage.setItem(BRANDING_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const passQuiz = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], quizPassed: true } }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const completeActivity = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], activityCompleted: true } }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const toggleManagerVerification = useCallback((stage: number) => {
    setState(prev => {
      const next = { ...prev, [stage]: { ...prev[stage], managerVerified: !prev[stage].managerVerified } }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

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
