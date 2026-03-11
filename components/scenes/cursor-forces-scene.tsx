'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, Color } from 'three'

import type { SceneProps } from '@/components/scenes/types'
import { SceneCanvas } from '@/components/scenes/shared-canvas'
import { useMobileQuality } from '@/hooks/use-mobile-quality'
import { buildPlaneScatter } from '@/lib/experiments/shape-points'
import { getPalette } from '@/lib/utils/palettes'
import { hashNoise } from '@/lib/utils/math'

function ForceField({ values }: { values: SceneProps['values'] }) {
  const { particleScale } = useMobileQuality()
  const positionRef = useRef<BufferAttribute>(null)
  const count = Math.max(400, Math.round(Number(values.particleCount) * particleScale))
  const radius = Number(values.radius)
  const attraction = Number(values.attraction)
  const repulsion = Number(values.repulsion)
  const turbulence = Number(values.turbulence)
  const damping = Number(values.damping)
  const particleSize = Number(values.particleSize)
  const forceType = String(values.forceType)
  const palette = getPalette(String(values.palette))

  const basePositions = useMemo(() => buildPlaneScatter(count), [count])
  const positions = useMemo(() => Float32Array.from(basePositions), [basePositions])
  const velocities = useMemo(() => new Float32Array(count * 3), [count])
  const seeds = useMemo(() => Array.from({ length: count }, (_, index) => hashNoise(index + 7)), [count])
  const colors = useMemo(() => {
    const swatches = palette.swatches.map((hex) => new Color(hex))
    const buffer = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const color = swatches[(index + 1) % swatches.length]
      buffer[cursor] = color.r
      buffer[cursor + 1] = color.g
      buffer[cursor + 2] = color.b
    }

    return buffer
  }, [count, palette.swatches])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const cursorX = state.pointer.x * 3.8
    const cursorY = state.pointer.y * 2.3

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const seed = seeds[index]
      const baseX = basePositions[cursor] + Math.sin(time * 0.3 + seed * 12) * turbulence * 0.4
      const baseY = basePositions[cursor + 1] + Math.cos(time * 0.35 + seed * 15) * turbulence * 0.3
      const dx = cursorX - positions[cursor]
      const dy = cursorY - positions[cursor + 1]
      const distance = Math.sqrt(dx * dx + dy * dy) + 0.0001
      const falloff = Math.max(0, 1 - distance / radius)
      let ax = (baseX - positions[cursor]) * 0.4
      let ay = (baseY - positions[cursor + 1]) * 0.4

      if (forceType === 'magnet') {
        ax += (dx / distance) * attraction * falloff * 1.6
        ay += (dy / distance) * attraction * falloff * 1.6
        ax -= (dx / distance) * repulsion * falloff * 1.1
        ay -= (dy / distance) * repulsion * falloff * 1.1
      }

      if (forceType === 'wind') {
        ax += attraction * falloff * 1.2
        ay += Math.sin(time * 6 + seed * 20) * turbulence * 0.8 * falloff
        ax -= repulsion * falloff * 0.5
      }

      if (forceType === 'gravity') {
        ax += (dx / distance) * attraction * falloff * 2.1
        ay += (dy / distance) * attraction * falloff * 2.1
        ay -= repulsion * falloff * 1.3
      }

      ax += (hashNoise(index + time * 30) - 0.5) * turbulence * 0.8
      ay += (hashNoise(index + 40 + time * 20) - 0.5) * turbulence * 0.8

      velocities[cursor] = (velocities[cursor] + ax * delta * 5) * damping
      velocities[cursor + 1] = (velocities[cursor + 1] + ay * delta * 5) * damping

      positions[cursor] += velocities[cursor] * delta * 3
      positions[cursor + 1] += velocities[cursor + 1] * delta * 3
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
        size={particleSize}
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

export function CursorForcesScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  return (
    <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
      <ForceField values={values} />
    </SceneCanvas>
  )
}

