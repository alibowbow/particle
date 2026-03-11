'use client'

import dynamic from 'next/dynamic'

import type { SceneProps } from '@/components/scenes/types'

const sceneComponents = {
  particleMorph: dynamic(() => import('@/components/scenes/particle-morph-scene').then((mod) => mod.ParticleMorphScene), { ssr: false }),
  cursorForces: dynamic(() => import('@/components/scenes/cursor-forces-scene').then((mod) => mod.CursorForcesScene), { ssr: false }),
  shaderKitchen: dynamic(() => import('@/components/scenes/shader-kitchen-scene').then((mod) => mod.ShaderKitchenScene), { ssr: false }),
  typeAlive: dynamic(() => import('@/components/scenes/type-alive-scene').then((mod) => mod.TypeAliveScene), { ssr: false }),
  audioBloom: dynamic(() => import('@/components/scenes/audio-bloom-scene').then((mod) => mod.AudioBloomScene), { ssr: false }),
  physicsToybox: dynamic(() => import('@/components/scenes/physics-toybox-scene').then((mod) => mod.PhysicsToyboxScene), { ssr: false }),
}

export function SceneRenderer({ scene, ...props }: SceneProps & { scene: keyof typeof sceneComponents }) {
  const Component = sceneComponents[scene]
  return <Component {...props} />
}

