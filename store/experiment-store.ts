import { create } from 'zustand'

import type { ControlValue } from '@/lib/experiments/types'

export type ExperimentTab = 'play' | 'code'

type ExperimentSession = {
  initialized: boolean
  params: Record<string, ControlValue>
  tab: ExperimentTab
  presetId?: string
  cameraPreset?: string
}

type ExperimentStore = {
  sessions: Record<string, ExperimentSession>
  initSession: (slug: string, session: Omit<ExperimentSession, 'initialized'>) => void
  setParam: (slug: string, key: string, value: ControlValue) => void
  setParams: (slug: string, params: Record<string, ControlValue>) => void
  setTab: (slug: string, tab: ExperimentTab) => void
  setPreset: (slug: string, presetId?: string) => void
  setCameraPreset: (slug: string, cameraPreset?: string) => void
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  sessions: {},
  initSession: (slug, session) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [slug]: {
          ...session,
          initialized: true,
        },
      },
    })),
  setParam: (slug, key, value) =>
    set((state) => {
      const existing = state.sessions[slug]
      if (!existing) return state

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            ...existing,
            params: {
              ...existing.params,
              [key]: value,
            },
          },
        },
      }
    }),
  setParams: (slug, params) =>
    set((state) => {
      const existing = state.sessions[slug]
      if (!existing) return state

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            ...existing,
            params,
          },
        },
      }
    }),
  setTab: (slug, tab) =>
    set((state) => {
      const existing = state.sessions[slug]
      if (!existing) return state

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            ...existing,
            tab,
          },
        },
      }
    }),
  setPreset: (slug, presetId) =>
    set((state) => {
      const existing = state.sessions[slug]
      if (!existing) return state

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            ...existing,
            presetId,
          },
        },
      }
    }),
  setCameraPreset: (slug, cameraPreset) =>
    set((state) => {
      const existing = state.sessions[slug]
      if (!existing) return state

      return {
        sessions: {
          ...state.sessions,
          [slug]: {
            ...existing,
            cameraPreset,
          },
        },
      }
    }),
}))
