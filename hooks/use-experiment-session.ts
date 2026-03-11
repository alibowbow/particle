'use client'

import { useEffect, useMemo } from 'react'

import { clampValue, parseQueryParams, serializeQueryParams } from '@/lib/experiments/query'
import { randomizeFromSchema } from '@/lib/experiments/randomize'
import type { ControlValue, ExperimentDefinition, ExperimentPreset } from '@/lib/experiments/types'
import { useExperimentStore } from '@/store/experiment-store'

function getStorageKey(slug: string) {
  return `scene-forge:${slug}`
}

function mergeValues(
  definition: ExperimentDefinition,
  values: Partial<Record<string, ControlValue>>,
): Record<string, ControlValue> {
  return definition.controls.reduce<Record<string, ControlValue>>((accumulator, control) => {
    const candidate = values[control.id]
    accumulator[control.id] = candidate === undefined ? definition.defaultValues[control.id] : clampValue(control, candidate)
    return accumulator
  }, { ...definition.defaultValues })
}

function findPreset(definition: ExperimentDefinition, presetId?: string | null) {
  if (!presetId) return undefined
  return definition.presets.find((preset) => preset.id === presetId)
}

export function useExperimentSession(definition: ExperimentDefinition) {
  const session = useExperimentStore((state) => state.sessions[definition.slug])
  const initSession = useExperimentStore((state) => state.initSession)
  const setParam = useExperimentStore((state) => state.setParam)
  const setParams = useExperimentStore((state) => state.setParams)
  const setTab = useExperimentStore((state) => state.setTab)
  const setPreset = useExperimentStore((state) => state.setPreset)
  const setCameraPreset = useExperimentStore((state) => state.setCameraPreset)

  useEffect(() => {
    if (session?.initialized || typeof window === 'undefined') return

    const search = new URLSearchParams(window.location.search)
    const storageRaw = window.localStorage.getItem(getStorageKey(definition.slug))
    const storageValues = storageRaw ? (JSON.parse(storageRaw) as Partial<Record<string, ControlValue>>) : {}
    const preset = findPreset(definition, search.get('preset'))
    const merged = mergeValues(definition, {
      ...storageValues,
      ...(preset?.values ?? {}),
      ...parseQueryParams(definition.controls, search),
    })

    initSession(definition.slug, {
      params: merged,
      tab: search.get('tab') === 'code' ? 'code' : 'play',
      presetId: preset?.id,
      cameraPreset: search.get('camera') ?? preset?.cameraPreset ?? definition.cameraPresets?.[0]?.id,
    })
  }, [definition, initSession, session?.initialized])

  useEffect(() => {
    if (!session?.initialized || typeof window === 'undefined') return

    window.localStorage.setItem(getStorageKey(definition.slug), JSON.stringify(session.params))

    const search = new URLSearchParams(serializeQueryParams(session.params))
    if (session.presetId) search.set('preset', session.presetId)
    if (session.cameraPreset) search.set('camera', session.cameraPreset)
    if (session.tab === 'code') search.set('tab', 'code')
    const nextUrl = `${window.location.pathname}?${search.toString()}`
    window.history.replaceState({}, '', nextUrl)
  }, [definition.slug, session?.cameraPreset, session?.initialized, session?.params, session?.presetId, session?.tab])

  const values = session?.params ?? definition.defaultValues

  const api = useMemo(() => ({
    setValue: (key: string, value: ControlValue) => {
      const control = definition.controls.find((item) => item.id === key)
      if (!control) return
      setParam(definition.slug, key, clampValue(control, value))
      setPreset(definition.slug, undefined)
    },
    applyPreset: (preset: ExperimentPreset) => {
      setParams(definition.slug, mergeValues(definition, preset.values))
      setPreset(definition.slug, preset.id)
      if (preset.cameraPreset) {
        setCameraPreset(definition.slug, preset.cameraPreset)
      }
    },
    reset: () => {
      setParams(definition.slug, { ...definition.defaultValues })
      setPreset(definition.slug, undefined)
    },
    randomize: () => {
      setParams(definition.slug, randomizeFromSchema(definition.controls, definition.defaultValues))
      setPreset(definition.slug, undefined)
    },
    setTab: (tab: 'play' | 'code') => setTab(definition.slug, tab),
    setCameraPreset: (cameraPreset?: string) => setCameraPreset(definition.slug, cameraPreset),
  }), [definition, setCameraPreset, setParam, setParams, setPreset, setTab])

  return {
    ready: Boolean(session?.initialized),
    tab: session?.tab ?? 'play',
    presetId: session?.presetId,
    cameraPreset: session?.cameraPreset,
    values,
    ...api,
  }
}

