'use client'

import { useEffect, useState } from 'react'

import type { ControlValue, ExperimentDefinition } from '@/lib/experiments/types'

import { Button } from '@/components/ui/button'
import { Panel, PanelTitle } from '@/components/ui/panel'

export function CodeModePanel({
  definition,
  values,
  onApply,
}: {
  definition: ExperimentDefinition
  values: Record<string, ControlValue>
  onApply: (nextValues: Record<string, ControlValue>) => void
}) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(JSON.stringify(values, null, 2))
  }, [values])

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <PanelTitle>Code Mode</PanelTitle>
        <div className="text-xs uppercase tracking-[0.24em] text-mist">JSON</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-mist">
        For now, Code Mode focuses on direct JSON editing for the core parameters. The structure is separated so a richer editor can be introduced later without rebuilding the experiment shell.
      </p>
      <textarea
        className="mt-4 min-h-[300px] w-full rounded-[24px] border border-white/10 bg-black/30 p-4 font-mono text-sm leading-6 text-white outline-none transition focus:border-white/20"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      {error ? <div className="mt-3 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="solid"
          onClick={() => {
            try {
              const parsed = JSON.parse(draft) as Record<string, ControlValue>
              onApply(parsed)
              setError('')
            } catch {
              setError('The JSON format is invalid.')
            }
          }}
        >
          Apply JSON
        </Button>
      </div>
      <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-mist">Snippet</div>
        <pre className="mt-3 overflow-x-auto font-mono text-xs leading-6 text-white/88">{definition.codeSample}</pre>
      </div>
    </Panel>
  )
}