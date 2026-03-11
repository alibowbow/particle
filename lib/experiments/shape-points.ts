import { Vector3 } from 'three'

import { hashNoise, TAU } from '@/lib/utils/math'

function sampleLine(points: Vector3[], start: [number, number, number], end: [number, number, number], count: number) {
  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0 : index / (count - 1)
    points.push(
      new Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t,
      ),
    )
  }
}

function buildForgePoints() {
  const points: Vector3[] = []
  const glyphs = [
    { x: -3.6, strokes: [[[0, 1.6, 0], [0, -1.6, 0]], [[0, 1.6, 0], [1.2, 1.6, 0]], [[0, 0.2, 0], [0.9, 0.2, 0]]] },
    { x: -1.9, strokes: [[[0.8, 1.5, 0], [-0.8, 1.5, 0]], [[-0.8, 1.5, 0], [-0.8, -1.5, 0]], [[-0.8, -1.5, 0], [0.8, -1.5, 0]], [[0.8, -1.5, 0], [0.8, 1.5, 0]]] },
    { x: -0.1, strokes: [[[0, -1.6, 0], [0, 1.6, 0]], [[0, 1.6, 0], [1.05, 1.1, 0]], [[0, 0.4, 0], [1.1, 0.4, 0]], [[0, 0.4, 0], [1.2, -1.5, 0]]] },
    { x: 1.8, strokes: [[[0.9, 1.2, 0], [-0.4, 1.5, 0]], [[-0.4, 1.5, 0], [-0.9, 0.1, 0]], [[-0.9, 0.1, 0], [-0.2, -1.4, 0]], [[-0.2, -1.4, 0], [1.0, -0.9, 0]], [[0.1, 0.2, 0], [1.1, 0.2, 0]]] },
    { x: 3.6, strokes: [[[0.9, 1.5, 0], [-0.9, 1.5, 0]], [[-0.9, 1.5, 0], [-0.9, -1.5, 0]], [[-0.9, 0.2, 0], [0.5, 0.2, 0]], [[-0.9, -1.5, 0], [0.9, -1.5, 0]]] },
  ] as const

  glyphs.forEach((glyph) => {
    glyph.strokes.forEach(([start, end]) => {
      sampleLine(
        points,
        [start[0] + glyph.x, start[1], start[2]],
        [end[0] + glyph.x, end[1], end[2]],
        28,
      )
    })
  })

  return points
}

const forgePoints = buildForgePoints()

function createTarget(shape: string, index: number, count: number) {
  const t = index / Math.max(count - 1, 1)
  const angle = t * TAU * 6
  const spiralAngle = t * TAU * 2

  if (shape === 'ring') {
    const radius = 3 + Math.sin(t * TAU * 8) * 0.16
    return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.56, Math.sin(angle * 0.6) * 0.4)
  }

  if (shape === 'helix') {
    return new Vector3(Math.cos(angle) * 2.3, (t - 0.5) * 6, Math.sin(angle) * 2.3)
  }

  if (shape === 'burst') {
    const radius = 0.3 + hashNoise(index + 1) * 4
    const phi = Math.acos(1 - 2 * t)
    return new Vector3(
      Math.sin(phi) * Math.cos(angle) * radius,
      Math.sin(phi) * Math.sin(angle) * radius,
      Math.cos(phi) * radius,
    )
  }

  const point = forgePoints[index % forgePoints.length]
  return point.clone().add(new Vector3(0, Math.sin(spiralAngle) * 0.04, 0))
}

export function buildShapePositions(shape: string, count: number) {
  const result = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const point = createTarget(shape, index, count)
    const cursor = index * 3
    result[cursor] = point.x
    result[cursor + 1] = point.y
    result[cursor + 2] = point.z
  }

  return result
}

export function buildInitialScatter(count: number, spread = 6) {
  const result = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const cursor = index * 3
    const seed = hashNoise(index + 3)
    result[cursor] = (hashNoise(index + 11) - 0.5) * spread
    result[cursor + 1] = (hashNoise(index + 17) - 0.5) * spread
    result[cursor + 2] = (seed - 0.5) * spread
  }

  return result
}

export function buildPlaneScatter(count: number) {
  const result = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const cursor = index * 3
    result[cursor] = (hashNoise(index + 21) - 0.5) * 7
    result[cursor + 1] = (hashNoise(index + 37) - 0.5) * 4.6
    result[cursor + 2] = (hashNoise(index + 51) - 0.5) * 0.12
  }

  return result
}

