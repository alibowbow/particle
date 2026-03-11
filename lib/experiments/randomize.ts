import type { ControlDefinition, ControlValue } from '@/lib/experiments/types'

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step
}

export function randomizeFromSchema<Key extends string>(
  controls: ControlDefinition<Key>[],
  defaults: Record<Key, ControlValue>,
) {
  return controls.reduce<Record<Key, ControlValue>>((accumulator, control) => {
    if (control.type === 'range') {
      const step = control.step ?? 0.01
      const span = control.max - control.min
      const jitter = control.min + Math.random() * span
      accumulator[control.id] = Number(roundToStep(jitter, step).toFixed(4))
      return accumulator
    }

    if (control.type === 'toggle') {
      accumulator[control.id] = Math.random() > 0.5
      return accumulator
    }

    if (control.type === 'select') {
      const option = control.options[Math.floor(Math.random() * control.options.length)]
      accumulator[control.id] = option?.value ?? defaults[control.id]
      return accumulator
    }

    accumulator[control.id] = defaults[control.id]
    return accumulator
  }, { ...defaults })
}

