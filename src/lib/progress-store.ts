import { createServerFn } from '@tanstack/react-start'
import { getDatabase } from '@netlify/database'
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

type ProgressRow = {
  progress: UserProgress | Partial<UserProgress> | string | null
}

let databaseConnection: ReturnType<typeof getDatabase> | null = null

function database() {
  databaseConnection ??= getDatabase()
  return databaseConnection
}

function parseStoredProgress(value: ProgressRow['progress']): Partial<UserProgress> | null {
  if (!value) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as Partial<UserProgress>
    } catch {
      return null
    }
  }
  return value
}

export const loadProgress = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserProgress | null> => {
    const user = await getUser()
    if (!user) return null
    const db = database()
    const rows = await db.sql<ProgressRow>`
      SELECT progress
      FROM user_progress
      WHERE user_id = ${user.id}
      LIMIT 1
    `
    return mergeProgress(parseStoredProgress(rows[0]?.progress ?? null))
  },
)

export const saveProgress = createServerFn({ method: 'POST' })
  .inputValidator((data: UserProgress) => data)
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const user = await getUser()
    if (!user) return { ok: false, error: 'unauthenticated' }
    const db = database()
    await db.sql`
      INSERT INTO user_progress (user_id, progress)
      VALUES (${user.id}, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (user_id)
      DO UPDATE SET
        progress = EXCLUDED.progress,
        updated_at = now()
    `
    return { ok: true }
  })
