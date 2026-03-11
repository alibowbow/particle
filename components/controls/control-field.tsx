'use client'

import type { ChangeEvent } from 'react'

import type { ControlDefinition, ControlValue } from '@/lib/experiments/types'
import { cn } from '@/lib/utils/cn'

function formatValue(value: ControlValue) {
  if (typeof value === 'number') {
    return value >= 100 ? Math.round(value).toString() : value.toFixed(2).replace(/\.00$/, '')
  }

  return String(value)
}

export function ControlField({
  control,
  value,
  onChange,
}: {
  control: ControlDefinition
  value: ControlValue
  onChange: (value: ControlValue) => void
}) {
  const baseClassName =
    'mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/[0.07]'

  if (control.type === 'range') {
    return (
      <label className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-white">{control.label}</span>
          <span className="font-mono text-xs text-mist">{formatValue(value)}</span>
        </div>
        <input
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
          type="range"
          min={control.min}
          max={control.max}
          step={control.step ?? 0.01}
          value={typeof value === 'number' ? value : control.min}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {control.hint ? <div className="mt-2 text-xs text-mist">{control.hint}</div> : null}
      </label>
    )
  }

  if (control.type === 'toggle') {
    return (
      <button
        type="button"
        onClick={() => onChange(!(value === true))}
        className={cn(
          'flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition',
          value === true ? 'border-white/18 bg-white/[0.08]' : 'border-white/8 bg-white/[0.03]',
        )}
      >
        <div>
          <div className="text-sm text-white">{control.label}</div>
          {control.hint ? <div className="mt-1 text-xs text-mist">{control.hint}</div> : null}
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-mist">
          {value === true ? 'On' : 'Off'}
        </span>
      </button>
    )
  }

  if (control.type === 'select') {
    return (
      <label className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <div className="text-sm text-white">{control.label}</div>
        <select className={baseClassName} value={String(value)} onChange={(event) => onChange(event.target.value)}>
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (control.type === 'color') {
    return (
      <label className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <div className="text-sm text-white">{control.label}</div>
        <input className={`${baseClassName} h-12 p-2`} type="color" value={String(value)} onChange={(event) => onChange(event.target.value)} />
      </label>
    )
  }

  return (
    <label className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="text-sm text-white">{control.label}</div>
      <input
        className={baseClassName}
        type="text"
        placeholder={control.placeholder}
        value={String(value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </label>
  )
}

