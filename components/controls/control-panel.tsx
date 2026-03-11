'use client'

import type { ControlDefinition, ControlValue, ExperimentDefinition, ExperimentPreset } from '@/lib/experiments/types'

import { ControlField } from '@/components/controls/control-field'
import { Button } from '@/components/ui/button'
import { Panel, PanelTitle } from '@/components/ui/panel'

export function ControlPanel({
  definition,
  values,
  presetId,
  onChange,
  onPreset,
  onReset,
  onRandomize,
  onShare,
}: {
  definition: ExperimentDefinition
  values: Record<string, ControlValue>
  presetId?: string
  onChange: (key: string, value: ControlValue) => void
  onPreset: (preset: ExperimentPreset) => void
  onReset: () => void
  onRandomize: () => void
  onShare: () => void
}) {
  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <PanelTitle>Controls</PanelTitle>
        <div className="text-xs uppercase tracking-[0.24em] text-mist">Live</div>
      </div>
      <div className="mt-5 space-y-3">
        {definition.controls.map((control: ControlDefinition) => (
          <ControlField key={control.id} control={control} value={values[control.id]} onChange={(value) => onChange(control.id, value)} />
        ))}
      </div>
      <div className="mt-6">
        <div className="mb-3 text-xs uppercase tracking-[0.24em] text-mist">Presets</div>
        <div className="grid gap-2">
          {definition.presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPreset(preset)}
              className={`rounded-[22px] border px-4 py-3 text-left transition ${presetId === preset.id ? 'border-white/18 bg-white/[0.08]' : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.06]'}`}
            >
              <div className="text-sm text-white">{preset.name}</div>
              <div className="mt-1 text-xs leading-5 text-mist">{preset.summary}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <Button onClick={onReset} variant="subtle">Reset</Button>
        <Button onClick={onRandomize} variant="ghost">Randomize</Button>
        <Button onClick={onShare} variant="solid">Share</Button>
      </div>
    </Panel>
  )
}

