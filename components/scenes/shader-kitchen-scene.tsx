'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'

import type { SceneProps } from '@/components/scenes/types'
import { SceneCanvas } from '@/components/scenes/shared-canvas'
import { getPalette } from '@/lib/utils/palettes'

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uDistortion;
  uniform float uGlow;
  uniform float uNoise;
  uniform float uTimeScale;
  uniform float uSurface;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv * 2.0 - 1.0;
    float time = uTime * uTimeScale;
    float radial = length(centered);
    float ripple = sin(radial * uFrequency * 6.0 - time * 3.2) * uAmplitude;
    float grain = noise(uv * (3.0 + uFrequency * 0.2) + time * 0.15) * uNoise;

    vec2 warped = uv;

    if (uSurface < 0.5) {
      warped += normalize(centered + 0.001) * ripple * 0.08;
    } else if (uSurface < 1.5) {
      warped += vec2(
        noise(uv * 5.0 + time) - 0.5,
        noise(uv * 5.0 - time) - 0.5
      ) * uDistortion * 0.22;
      warped += ripple * 0.04;
    } else {
      warped += vec2(ripple, sin((uv.y + grain) * uFrequency * 4.0 + time)) * uDistortion * 0.07;
    }

    float wave = sin((warped.x + warped.y + grain * 0.5) * uFrequency * 4.2 + time * 2.0);
    float bands = smoothstep(-0.2, 0.95, wave);
    float halo = pow(max(0.0, 1.0 - radial * 0.9), 2.8) * uGlow;

    vec3 color = mix(uColorC, uColorA, bands * 0.72 + 0.18);
    color = mix(color, uColorB, smoothstep(-0.5, 0.7, warped.x + ripple + grain * 0.2));

    if (uSurface > 1.5) {
      color.r += sin(time + uv.x * 14.0) * uDistortion * 0.12;
      color.b += cos(time + uv.y * 18.0) * uDistortion * 0.12;
    }

    color += halo * vec3(0.8, 0.95, 1.0);
    color += grain * 0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`

function KitchenSurface({ values }: { values: SceneProps['values'] }) {
  const materialRef = useRef<ShaderMaterial>(null)
  const palette = getPalette(String(values.palette))
  const colors = useMemo(() => palette.swatches.map((swatch) => new Color(swatch)), [palette.swatches])
  const surfaceIndex = String(values.surface) === 'ripple' ? 0 : String(values.surface) === 'glass' ? 1 : 2

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    materialRef.current.uniforms.uFrequency.value = Number(values.frequency)
    materialRef.current.uniforms.uAmplitude.value = Number(values.amplitude)
    materialRef.current.uniforms.uDistortion.value = Number(values.distortion)
    materialRef.current.uniforms.uGlow.value = Number(values.glow)
    materialRef.current.uniforms.uNoise.value = Number(values.noise)
    materialRef.current.uniforms.uTimeScale.value = Number(values.timeScale)
    materialRef.current.uniforms.uSurface.value = surfaceIndex
  })

  return (
    <mesh rotation={[-0.18, 0.12, 0]}>
      <planeGeometry args={[8.2, 5.4, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uFrequency: { value: Number(values.frequency) },
          uAmplitude: { value: Number(values.amplitude) },
          uDistortion: { value: Number(values.distortion) },
          uGlow: { value: Number(values.glow) },
          uNoise: { value: Number(values.noise) },
          uTimeScale: { value: Number(values.timeScale) },
          uSurface: { value: surfaceIndex },
          uColorA: { value: colors[0] },
          uColorB: { value: colors[1] },
          uColorC: { value: colors[2] },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export function ShaderKitchenScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  return (
    <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
      <KitchenSurface values={values} />
    </SceneCanvas>
  )
}

