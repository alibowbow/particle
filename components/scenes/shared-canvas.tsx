'use client'

import { AdaptiveDpr } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { Vector3 } from 'three'

import type { CameraPreset } from '@/lib/experiments/types'
import { damp } from '@/lib/utils/math'

function CameraRig({ activeId, presets }: { activeId?: string; presets?: CameraPreset[] }) {
  const { camera } = useThree()
  const fallback = useMemo(() => new Vector3(0, 0, 7), [])
  const targetPosition = useMemo(
    () => presets?.find((preset) => preset.id === activeId)?.position ?? presets?.[0]?.position ?? [0, 0, 7],
    [activeId, presets],
  )
  const lookAt = useMemo(
    () => presets?.find((preset) => preset.id === activeId)?.target ?? presets?.[0]?.target ?? [0, 0, 0],
    [activeId, presets],
  )

  useFrame((_, delta) => {
    camera.position.x = damp(camera.position.x, targetPosition[0], 6, delta)
    camera.position.y = damp(camera.position.y, targetPosition[1], 6, delta)
    camera.position.z = damp(camera.position.z, targetPosition[2], 6, delta)
    fallback.set(lookAt[0], lookAt[1], lookAt[2])
    camera.lookAt(fallback)
  })

  return null
}

export function SceneCanvas({
  cameraPreset,
  cameraPresets,
  children,
}: PropsWithChildren<{ cameraPreset?: string; cameraPresets?: CameraPreset[] }>) {
  const initial = cameraPresets?.[0]?.position ?? [0, 0, 7]

  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: initial as [number, number, number], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#06080c']} />
      <fog attach="fog" args={['#06080c', 8, 18]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 5, 6]} intensity={24} color="#77f2ff" />
      <pointLight position={[-5, -3, 4]} intensity={14} color="#8f9dff" />
      <CameraRig activeId={cameraPreset} presets={cameraPresets} />
      <AdaptiveDpr pixelated />
      {children}
    </Canvas>
  )
}

