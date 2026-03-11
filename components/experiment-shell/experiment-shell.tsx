'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { ControlPanel } from '@/components/controls/control-panel'
import { CodeModePanel } from '@/components/experiment-shell/code-mode-panel'
import { SceneRenderer } from '@/components/scenes/scene-renderer'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'
import { Tag } from '@/components/ui/tag'
import { useExperimentSession } from '@/hooks/use-experiment-session'
import { useWebGLSupport } from '@/hooks/use-webgl-support'
import { EXPERIMENT_LOOKUP } from '@/lib/experiments/catalog'
import type { ControlValue, ExperimentDefinition } from '@/lib/experiments/types'

export function ExperimentShell({ definition }: { definition: ExperimentDefinition }) {
  const webglSupported = useWebGLSupport()
  const session = useExperimentSession(definition)
  const [shareLabel, setShareLabel] = useState('Share')

  const related = useMemo(
    () => definition.related.map((slug) => EXPERIMENT_LOOKUP.get(slug)).filter(Boolean) as ExperimentDefinition[],
    [definition.related],
  )

  const share = async () => {
    if (typeof window === 'undefined') return

    await navigator.clipboard.writeText(window.location.href)
    setShareLabel('Copied')
    window.setTimeout(() => setShareLabel('Share'), 1400)
  }

  const applyJson = (nextValues: Record<string, ControlValue>) => {
    Object.entries(nextValues).forEach(([key, value]) => {
      if (definition.controls.some((control) => control.id === key)) {
        session.setValue(key, value)
      }
    })
  }

  return (
    <div className="page-shell pb-20 pt-10 sm:pt-14">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap gap-2">
            {definition.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div>
            <h1 className="text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">{definition.title}</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-mist">{definition.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={session.tab === 'play' ? 'solid' : 'ghost'} onClick={() => session.setTab('play')}>
            Play Mode
          </Button>
          <Button variant={session.tab === 'code' ? 'solid' : 'ghost'} onClick={() => session.setTab('code')}>
            Code Mode
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Panel className="overflow-hidden p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pb-2 sm:px-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-mist">Live canvas</div>
              <div className="mt-1 text-sm text-white/92">{definition.detail}</div>
            </div>
            {definition.cameraPresets?.length ? (
              <div className="flex flex-wrap gap-2">
                {definition.cameraPresets.map((camera) => (
                  <Button
                    key={camera.id}
                    variant={session.cameraPreset === camera.id ? 'solid' : 'ghost'}
                    onClick={() => session.setCameraPreset(camera.id)}
                    className="px-3 py-2 text-xs"
                  >
                    {camera.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-[28px] border border-white/8 bg-black/20 sm:h-[620px]">
            {webglSupported ? (
              <SceneRenderer scene={definition.scene as never} values={session.values} cameraPreset={session.cameraPreset} cameraPresets={definition.cameraPresets} ready={session.ready} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-shell p-8 text-center">
                <div className="text-sm uppercase tracking-[0.32em] text-plasma">Fallback Mode</div>
                <h2 className="mt-4 text-3xl font-medium text-white">WebGL unavailable</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-mist">
                  ?? ????? ??? ???? ??? ? ?? ????? ?? ?? ???? ?????. ?? ??? ??? ??? ??? ??? ? ????.
                </p>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          {session.tab === 'play' ? (
            <ControlPanel
              definition={definition}
              values={session.values}
              presetId={session.presetId}
              onChange={session.setValue}
              onPreset={session.applyPreset}
              onReset={session.reset}
              onRandomize={session.randomize}
              onShare={share}
            />
          ) : (
            <CodeModePanel definition={definition} values={session.values} onApply={applyJson} />
          )}
          <Panel className="p-5 sm:p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-mist">Quick actions</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="subtle" onClick={session.reset}>Reset</Button>
              <Button variant="ghost" onClick={session.randomize}>Randomize</Button>
              <Button variant="solid" onClick={share}>{shareLabel}</Button>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel className="p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.28em] text-plasma">Learn</div>
          <div className="mt-5 grid gap-4">
            {definition.learn.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <h2 className="text-lg text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-mist">{item.body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.28em] text-plasma">Related experiments</div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/experiments/${item.slug}`}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
              >
                <div className="text-base text-white">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-mist">{item.summary}</div>
              </Link>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}

