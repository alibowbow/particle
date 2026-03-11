'use client'

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'

import type { SceneProps } from '@/components/scenes/types'
import { SceneCanvas } from '@/components/scenes/shared-canvas'
import { Button } from '@/components/ui/button'
import { getPalette } from '@/lib/utils/palettes'

function AudioBloomCore({ values, levelRef }: { values: SceneProps['values']; levelRef: MutableRefObject<number> }) {
  const palette = getPalette(String(values.palette))
  const colors = useMemo(() => palette.swatches.map((swatch) => new Color(swatch)), [palette.swatches])
  const ringCount = Math.round(Number(values.ringCount))
  const bloom = Number(values.bloom)
  const size = Number(values.size)

  useFrame((state) => {
    levelRef.current = Math.max(0, Math.min(1.6, levelRef.current))
    state.scene.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.12) * 0.08
  })

  return (
    <group>
      {Array.from({ length: ringCount }).map((_, index) => {
        const ratio = index / Math.max(ringCount - 1, 1)
        const scale = size + ratio * 0.9 + levelRef.current * bloom * (1 - ratio) * 1.3
        return (
          <mesh
            key={index}
            scale={[scale, scale, 1]}
            rotation={[index * 0.17, index * 0.2, index * 0.14]}
          >
            <torusGeometry args={[0.72, 0.022, 16, 90]} />
            <meshStandardMaterial
              color={colors[index % colors.length]}
              emissive={colors[(index + 1) % colors.length]}
              emissiveIntensity={0.8 + levelRef.current * 1.2}
              transparent
              opacity={0.74 - ratio * 0.4}
            />
          </mesh>
        )
      })}
      <mesh scale={0.8 + levelRef.current * (0.4 + bloom * 0.2)}>
        <icosahedronGeometry args={[0.38, 2]} />
        <meshStandardMaterial color={colors[0]} emissive={colors[1]} emissiveIntensity={1.2 + levelRef.current} />
      </mesh>
    </group>
  )
}

export function AudioBloomScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  const [status, setStatus] = useState('Pulse fallback active')
  const [micEnabled, setMicEnabled] = useState(false)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataRef = useRef<Uint8Array | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const levelRef = useRef(0.4)
  const inputMode = String(values.inputMode)
  const sensitivity = Number(values.sensitivity)
  const decay = Number(values.decay)

  useEffect(() => {
    let frame = 0

    const tick = () => {
      if (inputMode === 'mic' && analyserRef.current && dataRef.current) {
        analyserRef.current.getByteFrequencyData(dataRef.current as Uint8Array<ArrayBuffer>)
        const average = dataRef.current.reduce((sum, value) => sum + value, 0) / (dataRef.current.length * 255)
        levelRef.current = levelRef.current * decay + average * sensitivity * (1 - decay) * 6
      } else {
        const t = performance.now() * 0.0014
        const pulse = 0.35 + Math.sin(t * 2.3) * 0.16 + Math.sin(t * 5.4) * 0.09
        levelRef.current = levelRef.current * 0.92 + pulse * sensitivity * 0.08
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [decay, inputMode, sensitivity])

  useEffect(() => {
    if (inputMode !== 'mic') {
      setStatus('Pulse fallback active')
      return
    }

    setStatus(micEnabled ? 'Microphone live' : 'Enable microphone for live input')
  }, [inputMode, micEnabled])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      audioContextRef.current?.close()
    }
  }, [])

  const enableMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone unsupported, staying on pulse fallback')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      const source = context.createMediaStreamSource(stream)
      source.connect(analyser)
      analyserRef.current = analyser
      dataRef.current = new Uint8Array(analyser.frequencyBinCount)
      streamRef.current = stream
      audioContextRef.current = context
      setMicEnabled(true)
      setStatus('Microphone live')
    } catch {
      setStatus('Permission denied, staying on pulse fallback')
      setMicEnabled(false)
    }
  }

  return (
    <div className="relative h-full">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white">
        <span>{status}</span>
        {inputMode === 'mic' && !micEnabled ? (
          <Button variant="ghost" className="px-3 py-1 text-[11px]" onClick={enableMic}>
            Enable Mic
          </Button>
        ) : null}
      </div>
      <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
        <AudioBloomCore values={values} levelRef={levelRef} />
      </SceneCanvas>
    </div>
  )
}

