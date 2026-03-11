import type { ControlDefinition, ControlValue } from '@/lib/experiments/types'

function parseByControl(control: ControlDefinition, rawValue: string): ControlValue {
  if (control.type === 'toggle') {
    return rawValue === 'true'
  }

  if (control.type === 'range') {
    const value = Number(rawValue)
    return Number.isFinite(value) ? value : control.min
  }

  return rawValue
}

export function parseQueryParams<Key extends string>(
  controls: ControlDefinition<Key>[],
  values: URLSearchParams,
) {
  const nextValues: Partial<Record<Key, ControlValue>> = {}

  for (const control of controls) {
    const rawValue = values.get(control.id)
    if (rawValue === null) continue
    nextValues[control.id] = parseByControl(control, rawValue)
  }

  return nextValues
}

export function serializeQueryParams(values: Record<string, ControlValue>) {
  const params = new URLSearchParams()

  Object.entries(values).forEach(([key, value]) => {
    params.set(key, String(value))
  })

  return params.toString()
}

export function clampValue(control: ControlDefinition, value: ControlValue): ControlValue {
  if (control.type !== 'range' || typeof value !== 'number') {
    return value
  }

  return Math.min(control.max, Math.max(control.min, value))
}

