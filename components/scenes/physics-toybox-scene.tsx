'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, InstancedMesh, Object3D } from 'three'

import type { SceneProps } from '@/components/scenes/types'
import { SceneCanvas } from '@/components/scenes/shared-canvas'
import { useMobileQuality } from '@/hooks/use-mobile-quality'
import { getPalette } from '@/lib/utils/palettes'
import { hashNoise, TAU } from '@/lib/utils/math'

function PhysicsField({ values }: { values: SceneProps['values'] }) {
  const { particleScale } = useMobileQuality()
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const count = Math.max(10, Math.round(Number(values.spawnCount) * particleScale))
  const behavior = String(values.behavior)
  const gravity = Number(values.gravity)
  const stiffness = Number(values.stiffness)
  const drag = Number(values.drag)
  const collision = Boolean(values.collision)
  const impulse = Number(values.impulse)
  const palette = getPalette(String(values.palette))

  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const velocities = useMemo(() => new Float32Array(count * 3), [count])
  const bases = useMemo(() => new Float32Array(count * 3), [count])
  const seeds = useMemo(() => Array.from({ length: count }, (_, index) => hashNoise(index + 13)), [count])

  useEffect(() => {
    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const x = (hashNoise(index + 41) - 0.5) * 4
      const y = (hashNoise(index + 71) - 0.5) * 3
      const z = (hashNoise(index + 101) - 0.5) * 1.6
      positions[cursor] = x
      positions[cursor + 1] = y
      positions[cursor + 2] = z
      bases[cursor] = x
      bases[cursor + 1] = y
      bases[cursor + 2] = z
    }
  }, [bases, count, positions])

  useEffect(() => {
    if (!meshRef.current) return
    const colors = palette.swatches.map((swatch) => new Color(swatch))

    for (let index = 0; index < count; index += 1) {
      meshRef.current.setColorAt(index, colors[index % colors.length])
    }

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [count, palette.swatches])
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      const seed = seeds[index]
      let anchorX = bases[cursor]
      let anchorY = bases[cursor + 1]
      let anchorZ = bases[cursor + 2]

      if (behavior === 'flock') {
        const angle = time * (0.5 + impulse * 0.3) + seed * TAU
        const radius = 1.4 + seed * 1.8
        anchorX = Math.cos(angle) * radius
        anchorY = Math.sin(angle * 1.2) * 1.4
        anchorZ = Math.sin(angle) * radius * 0.5
      }

      if (behavior === 'cluster') {
        anchorX = Math.sin(time * 0.7 + seed * 12) * 0.6
        anchorY = Math.cos(time * 0.8 + seed * 8) * 0.6
        anchorZ = Math.sin(time * 0.5 + seed * 10) * 0.4
      }

      const ax = (anchorX - positions[cursor]) * stiffness * impulse
      const ay = (anchorY - positions[cursor + 1]) * stiffness * impulse - gravity * 0.8
      const az = (anchorZ - positions[cursor + 2]) * stiffness * impulse

      velocities[cursor] = (velocities[cursor] + ax * delta * 4) * drag
      velocities[cursor + 1] = (velocities[cursor + 1] + ay * delta * 4) * drag
      velocities[cursor + 2] = (velocities[cursor + 2] + az * delta * 4) * drag

      positions[cursor] += velocities[cursor] * delta * 3
      positions[cursor + 1] += velocities[cursor + 1] * delta * 3
      positions[cursor + 2] += velocities[cursor + 2] * delta * 3

      const bounds = [3.2, 2.2, 1.6]
      if (Math.abs(positions[cursor]) > bounds[0]) velocities[cursor] *= -0.8
      if (Math.abs(positions[cursor + 1]) > bounds[1]) velocities[cursor + 1] *= -0.8
      if (Math.abs(positions[cursor + 2]) > bounds[2]) velocities[cursor + 2] *= -0.8
      positions[cursor] = Math.max(-bounds[0], Math.min(bounds[0], positions[cursor]))
      positions[cursor + 1] = Math.max(-bounds[1], Math.min(bounds[1], positions[cursor + 1]))
      positions[cursor + 2] = Math.max(-bounds[2], Math.min(bounds[2], positions[cursor + 2]))
    }

    if (collision) {
      for (let a = 0; a < count; a += 1) {
        for (let b = a + 1; b < count; b += 1) {
          const ac = a * 3
          const bc = b * 3
          const dx = positions[bc] - positions[ac]
          const dy = positions[bc + 1] - positions[ac + 1]
          const dz = positions[bc + 2] - positions[ac + 2]
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001
          const minDistance = 0.18
          if (distance < minDistance) {
            const overlap = (minDistance - distance) * 0.5
            const nx = dx / distance
            const ny = dy / distance
            const nz = dz / distance
            positions[ac] -= nx * overlap
            positions[ac + 1] -= ny * overlap
            positions[ac + 2] -= nz * overlap
            positions[bc] += nx * overlap
            positions[bc + 1] += ny * overlap
            positions[bc + 2] += nz * overlap
          }
        }
      }
    }

    if (!meshRef.current) return

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3
      dummy.position.set(positions[cursor], positions[cursor + 1], positions[cursor + 2])
      dummy.scale.setScalar(0.8 + seeds[index] * 0.9)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 20, 20]} />
      <meshStandardMaterial emissive="#87e7ff" emissiveIntensity={0.22} roughness={0.3} metalness={0.1} />
    </instancedMesh>
  )
}

export function PhysicsToyboxScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  return (
    <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
      <PhysicsField values={values} />
    </SceneCanvas>
  )
}

