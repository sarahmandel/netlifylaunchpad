import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'

export type StageState = {
  quizPassed: boolean
  activityCompleted: boolean
  managerVerified: boolean
}

export type Track = 'developer' | 'non-developer' | null

export type BrandingConfig = {
  companyName: string
  logoUrl: string
  primaryColor: string
  accentColor: string
}

export type OnboardingState = Record<number, StageState>

export type UserProgress = {
  stages: OnboardingState
  track: Track
  branding: BrandingConfig
}

export const defaultBranding: BrandingConfig = {
  companyName: 'Netlify',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
}

export function getDefaultStages(): OnboardingState {
  return {
    1: { quizPassed: false, activityCompleted: false, managerVerified: false },
    2: { quizPassed: false, activityCompleted: false, managerVerified: false },
    3: { quizPassed: false, activityCompleted: false, managerVerified: false },
    4: { quizPassed: false, activityCompleted: false, managerVerified: false },
  }
}

function getDefaultProgress(): UserProgress {
  return {
    stages: getDefaultStages(),
    track: null,
    branding: defaultBranding,
  }
}

function mergeProgress(stored: Partial<UserProgress> | null): UserProgress {
  const defaults = getDefaultProgress()
  if (!stored) return defaults
  const stages = { ...defaults.stages }
  if (stored.stages) {
    for (const key of Object.keys(defaults.stages)) {
      const k = Number(key)
      stages[k] = { ...defaults.stages[k], ...(stored.stages[k] ?? {}) }
    }
  }
  return {
    stages,
    track: stored.track ?? null,
    branding: { ...defaults.branding, ...(stored.branding ?? {}) },
  }
}

function progressStore() {
  return getStore({ name: 'user-progress', consistency: 'strong' })
}

export const loadProgress = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserProgress | null> => {
    const user = await getUser()
    if (!user) return null
    const store = progressStore()
    const data = await store.get(user.id, { type: 'json' })
    return mergeProgress(data as Partial<UserProgress> | null)
  },
)

export const saveProgress = createServerFn({ method: 'POST' })
  .validator((data: UserProgress) => data)
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const user = await getUser()
    if (!user) return { ok: false, error: 'unauthenticated' }
    const store = progressStore()
    await store.setJSON(user.id, data)
    return { ok: true }
  })
