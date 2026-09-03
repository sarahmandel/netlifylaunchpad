import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import type { Role } from '@/lib/curriculum'
import { allLessonKeys, modules } from '@/lib/curriculum'

// Progress is stored in Netlify Blobs (a platform primitive) keyed by an
// anonymous, per-device client id. The app uses Netlify's platform-level access
// control (basic auth / password protection) rather than an in-app login, so
// there is no authenticated user to key on — the client id is generated in the
// browser and persisted locally, giving each learner their own durable record
// without a custom auth system.

export type ModuleState = {
  quizPassed: boolean
  checklistCompleted: boolean
}

export type OnboardingState = Record<string, ModuleState>

export type UserProgress = {
  role: Role | null
  modules: OnboardingState
}

// `mergeProgress` only keeps keys that exist in the defaults, so every progress
// key the app can write — module ids and lesson keys alike — has to be seeded
// here or it would be silently dropped on the next save.
export function getDefaultModules(): OnboardingState {
  const state: OnboardingState = {}
  for (const m of modules) {
    state[m.id] = { quizPassed: false, checklistCompleted: false }
  }
  for (const key of allLessonKeys()) {
    state[key] = { quizPassed: false, checklistCompleted: false }
  }
  return state
}

function getDefaultProgress(): UserProgress {
  return { role: null, modules: getDefaultModules() }
}

function mergeProgress(stored: Partial<UserProgress> | null): UserProgress {
  const defaults = getDefaultProgress()
  if (!stored) return defaults
  const merged = { ...defaults.modules }
  if (stored.modules) {
    for (const id of Object.keys(defaults.modules)) {
      merged[id] = { ...defaults.modules[id], ...(stored.modules[id] ?? {}) }
    }
  }
  return { role: stored.role ?? null, modules: merged }
}

function isValidClientId(id: unknown): id is string {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(id)
}

function progressStore() {
  return getStore({ name: 'onboarding-progress', consistency: 'strong' })
}

export const loadProgress = createServerFn({ method: 'GET' })
  .inputValidator((clientId: string) => clientId)
  .handler(async ({ data: clientId }): Promise<UserProgress | null> => {
    if (!isValidClientId(clientId)) return getDefaultProgress()
    const store = progressStore()
    const data = await store.get(clientId, { type: 'json' })
    return mergeProgress(data as Partial<UserProgress> | null)
  })

export const saveProgress = createServerFn({ method: 'POST' })
  .inputValidator((input: { clientId: string; progress: UserProgress }) => input)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    if (!isValidClientId(data.clientId)) return { ok: false }
    const store = progressStore()
    await store.setJSON(data.clientId, mergeProgress(data.progress))
    return { ok: true }
  })
