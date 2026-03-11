'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, Color } from 'three'

import type { SceneProps } from '@/components/scenes/types'
import { SceneCanvas } from '@/components/scenes/shared-canvas'
import { useMobileQuality } from '@/hooks/use-mobile-quality'
import { buildInitialScatter, buildShapePositions } from '@/lib/experiments/shape-points'
import { getPalette } from '@/lib/utils/palettes'
import { damp, hashNoise, TAU } from '@/lib/utils/math'

function MorphPoints({ values }: { values: SceneProps['values'] }) {
  const { particleScale } = useMobileQuality()
  const positionRef = useRef<BufferAttribute>(null)
  const count = Math.max(600, Math.round(Number(values.particleCount) * particleScale))
  const size = Number(values.particleSize)
  const speed = Number(values.speed)
  const noise = Number(values.noise)
  const spread = Number(values.spread)
  const mode = String(values.mode)
  const shape = String(values.shape)
  const palette = getPalette(String(values.palette))

  const targetPositions = useMemo(() => buildShapePositions(shape, count), [count, shape])
  const positions = useMemo(() => buildInitialScatter(count, 9), [count])
  const seeds = useMemo(() => Array.from({ length: count }, (_, index) => hashNoise(index + 1)), [count])
  const colors = useMemo(() => {
    const buffer = new Float32Array(count * 3)
    const swatches = palette.swatches.map((hex) => new Color(hex))

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const color = swatches[index % swatches.length]
      buffer[cursor] = color.r
      buffer[cursor + 1] = color.g
      buffer[cursor + 2] = color.b
    }

    return buffer
  }, [count, palette.swatches])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const seed = seeds[index]
      const tx = targetPositions[cursor]
      const ty = targetPositions[cursor + 1]
      const tz = targetPositions[cursor + 2]
      const orbitAngle = time * speed + seed * TAU
      const directionX = Math.cos(seed * TAU * 3.1)
      const directionY = Math.sin(seed * TAU * 2.7)
      const directionZ = Math.cos(seed * TAU * 1.9)
      const noiseOffsetX = Math.sin(time * (1.2 + seed) + seed * 12) * noise * 0.22
      const noiseOffsetY = Math.cos(time * (1.4 + seed) + seed * 18) * noise * 0.22
      const noiseOffsetZ = Math.sin(time * (1.1 + seed) + seed * 9) * noise * 0.18

      let desiredX = tx + noiseOffsetX
      let desiredY = ty + noiseOffsetY
      let desiredZ = tz + noiseOffsetZ

      if (mode === 'scatter') {
        desiredX += directionX * spread * (1.2 + seed)
        desiredY += directionY * spread * (0.8 + seed)
        desiredZ += directionZ * spread * 0.8
      }

      if (mode === 'explode') {
        const burst = 1.8 + Math.sin(time * speed * 2 + seed * 10) * 0.2
        desiredX += directionX * spread * burst * 1.8
        desiredY += directionY * spread * burst * 1.4
        desiredZ += directionZ * spread * burst
      }

      if (mode === 'orbit') {
        desiredX += Math.cos(orbitAngle) * (0.5 + spread * 0.7)
        desiredY += Math.sin(orbitAngle * 1.2) * (0.35 + spread * 0.4)
        desiredZ += Math.sin(orbitAngle) * (0.6 + spread * 0.2)
      }

      positions[cursor] = damp(positions[cursor], desiredX, 7 * speed, delta)
      positions[cursor + 1] = damp(positions[cursor + 1], desiredY, 7 * speed, delta)
      positions[cursor + 2] = damp(positions[cursor + 2], desiredZ, 7 * speed, delta)
    }

    if (positionRef.current) {
      positionRef.current.needsUpdate = true
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={positionRef} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        transparent
        opacity={0.95}
        vertexColors
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export function ParticleMorphScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  return (
    <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
      <MorphPoints values={values} />
    </SceneCanvas>
  )
}

