'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, Color, ShaderMaterial } from 'three'

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

  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uStyle;
  uniform float uDistortion;
  uniform float uGlow;
  uniform float uDrift;
  uniform float uEdge;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  vec4 sampleText(vec2 uv) {
    return texture2D(uMap, uv);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;
    float warp = noise(uv * 7.0 + time * 0.1) - 0.5;
    vec2 drift = vec2(sin(uv.y * 16.0 + time * 2.0), cos(uv.x * 9.0 + time * 1.4)) * uDrift * 0.02;

    vec2 sampleUv = uv + drift + warp * uDistortion * 0.02;
    vec4 base = sampleText(sampleUv);
    float alpha = base.a;

    if (uStyle < 0.5) {
      vec4 r = sampleText(sampleUv + vec2(uDistortion * 0.03, 0.0));
      vec4 b = sampleText(sampleUv - vec2(uDistortion * 0.03, 0.0));
      base = vec4(r.r, base.g, b.b, max(max(r.a, b.a), base.a));
      alpha = base.a + (sin(uv.y * 240.0 + time * 18.0) * 0.04 + 0.06);
    } else if (uStyle < 1.5) {
      alpha += pow(max(0.0, 1.0 - length((uv - 0.5) * 1.6)), 2.0) * uGlow * 0.35;
      base.rgb += uGlow * 0.3;
    } else {
      vec4 blurA = sampleText(sampleUv + vec2(0.01, 0.0));
      vec4 blurB = sampleText(sampleUv - vec2(0.01, 0.02));
      alpha = max(alpha, (blurA.a + blurB.a) * 0.7);
      base.rgb = mix(base.rgb, vec3(1.0), 0.1);
    }

    float edge = smoothstep(0.05, 0.55, alpha) * (0.5 + uEdge);
    vec3 color = mix(uColorC, uColorA, edge);
    color = mix(color, uColorB, alpha * 0.8);
    color += base.rgb * (0.45 + uGlow * 0.3);

    float vignette = pow(max(0.0, 1.0 - length((uv - 0.5) * 1.4)), 2.4);
    color *= vignette + 0.2;

    gl_FragColor = vec4(color, alpha);
  }
`

function TypeSurface({ values }: { values: SceneProps['values'] }) {
  const materialRef = useRef<ShaderMaterial>(null)
  const canvas = useMemo(() => {
    const element = document.createElement('canvas')
    element.width = 1400
    element.height = 760
    return element
  }, [])
  const texture = useMemo(() => {
    const next = new CanvasTexture(canvas)
    next.needsUpdate = true
    return next
  }, [canvas])
  const palette = getPalette(String(values.palette))
  const colors = useMemo(() => palette.swatches.map((swatch) => new Color(swatch)), [palette.swatches])
  const styleIndex = String(values.style) === 'glitch' ? 0 : String(values.style) === 'neon' ? 1 : 2

  useEffect(() => {
    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'rgba(0,0,0,0)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = '700 210px sans-serif'
    context.fillStyle = colors[0].getStyle()
    context.shadowColor = colors[1].getStyle()
    context.shadowBlur = 36
    context.fillText(String(values.text || 'SCENE FORGE').slice(0, 24), canvas.width / 2, canvas.height / 2)
    texture.needsUpdate = true
  }, [canvas, colors, texture, values.text])

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    materialRef.current.uniforms.uStyle.value = styleIndex
    materialRef.current.uniforms.uDistortion.value = Number(values.distortion)
    materialRef.current.uniforms.uGlow.value = Number(values.glow)
    materialRef.current.uniforms.uDrift.value = Number(values.drift)
    materialRef.current.uniforms.uEdge.value = Number(values.edge)
  })

  return (
    <mesh>
      <planeGeometry args={[7.4, 4, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={{
          uMap: { value: texture },
          uTime: { value: 0 },
          uStyle: { value: styleIndex },
          uDistortion: { value: Number(values.distortion) },
          uGlow: { value: Number(values.glow) },
          uDrift: { value: Number(values.drift) },
          uEdge: { value: Number(values.edge) },
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

export function TypeAliveScene({ values, cameraPreset, cameraPresets }: SceneProps) {
  return (
    <SceneCanvas cameraPreset={cameraPreset} cameraPresets={cameraPresets}>
      <TypeSurface values={values} />
    </SceneCanvas>
  )
}

