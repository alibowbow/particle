'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'

import { SceneRenderer } from '@/components/scenes/scene-renderer'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { FEATURED_EXPERIMENTS, getExperiment } from '@/lib/experiments/catalog'

const heroDefinition = getExperiment('particle-morph-studio')!
const secondaryDefinition = getExperiment('shader-kitchen')!

const heroValues = {
  ...heroDefinition.defaultValues,
  mode: 'orbit',
  shape: 'helix',
  particleCount: 3200,
  speed: 1.2,
  noise: 0.66,
  spread: 1.14,
}

const secondaryValues = {
  ...secondaryDefinition.defaultValues,
  surface: 'prismatic',
  distortion: 0.74,
  glow: 1.04,
  noise: 0.72,
}

export function HomeHero() {
  const x = useMotionValue(50)
  const y = useMotionValue(50)
  const glow = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(119, 242, 255, 0.20), transparent 35%)`

  return (
    <section className="page-shell pt-10 sm:pt-16">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6 py-6 sm:py-10">
          <Tag className="w-fit">Interactive Visual Laboratory</Tag>
          <div className="space-y-5">
            <h1 className="text-balance text-5xl font-medium tracking-tight text-white sm:text-6xl xl:text-7xl">
              Touch the effect. Remix the scene. Learn the motion.
            </h1>
            <p className="max-w-xl text-base leading-7 text-mist sm:text-lg">
              SCENE FORGE? ??? ???? ???? ???, ????? ?? ??? ?? ??? ????? ????? ? ?????.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/experiments/particle-morph-studio">
              <Button variant="solid">Launch Studio</Button>
            </Link>
            <Link href="/gallery">
              <Button variant="ghost">Open Remix Gallery</Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['6', 'Playable experiments'],
              ['JSON', 'Code mode editable'],
              ['Share', 'Preset link workflow'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-2xl font-medium text-white">{value}</div>
                <div className="mt-1 text-sm text-mist">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            x.set(((event.clientX - bounds.left) / bounds.width) * 100)
            y.set(((event.clientY - bounds.top) / bounds.height) * 100)
          }}
          className="glass-panel relative overflow-hidden rounded-[34px] border border-white/10"
        >
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
          <div className="relative grid gap-4 p-4 md:grid-cols-[minmax(0,1.4fr)_280px]">
            <div className="relative h-[480px] overflow-hidden rounded-[28px] border border-white/8 bg-black/30 sm:h-[560px]">
              <SceneRenderer scene={heroDefinition.scene as never} values={heroValues} cameraPreset="orbit" cameraPresets={heroDefinition.cameraPresets} ready />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.28em] text-plasma">
                Hero Playground
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-mist">Live cues</div>
                <div className="mt-4 space-y-3 text-sm text-white/88">
                  <div className="rounded-[22px] bg-white/[0.04] px-4 py-3">Orbit mode with helix morphology</div>
                  <div className="rounded-[22px] bg-white/[0.04] px-4 py-3">Instant response to parameter shifts</div>
                  <div className="rounded-[22px] bg-white/[0.04] px-4 py-3">Camera presets tuned for composition</div>
                </div>
              </div>
              <div className="relative h-[220px] overflow-hidden rounded-[28px] border border-white/8 bg-black/30">
                <SceneRenderer scene={secondaryDefinition.scene as never} values={secondaryValues} cameraPreset="tilt" cameraPresets={secondaryDefinition.cameraPresets} ready />
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.28em] text-white">
                  Shader preview
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {FEATURED_EXPERIMENTS.map((experiment, index) => (
          <Link
            key={experiment.slug}
            href={`/experiments/${experiment.slug}`}
            className="group rounded-[28px] border border-white/8 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.28em] text-mist">0{index + 1}</div>
              <div className="h-2 w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${experiment.accent[0]}, ${experiment.accent[1]})` }} />
            </div>
            <h2 className="mt-5 text-xl text-white transition group-hover:translate-x-1">{experiment.title}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">{experiment.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

