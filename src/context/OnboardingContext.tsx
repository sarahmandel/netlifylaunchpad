import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type StageState = {
  quizPassed: boolean
  activityCompleted: boolean
  managerVerified: boolean
}

type OnboardingState = Record<number, StageState>

type OnboardingContextType = {
  stages: OnboardingState
  passQuiz: (stage: number) => void
  completeActivity: (stage: number) => void
  toggleManagerVerification: (stage: number) => void
  getProgress: () => number
  allVerified: () => boolean
}

const STORAGE_KEY = 'netlify-onboarding-progress'

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

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState)

  const save = (newState: OnboardingState) => {
    setState(newState)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    } catch {}
  }

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
    <OnboardingContext.Provider value={{ stages: state, passQuiz, completeActivity, toggleManagerVerification, getProgress, allVerified }}>
      {children}
    </OnboardingContext.Provider>
  )
}
