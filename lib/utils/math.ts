export const TAU = Math.PI * 2

export function lerp(a: number, b: number, factor: number) {
  return a + (b - a) * factor
}

export function damp(current: number, target: number, smoothing: number, delta: number) {
  return lerp(current, target, 1 - Math.exp(-smoothing * delta))
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = (value - inMin) / (inMax - inMin || 1)
  return outMin + (outMax - outMin) * t
}

export function hashNoise(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

