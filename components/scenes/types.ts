import type { CameraPreset, ControlValue } from '@/lib/experiments/types'

export type SceneProps = {
  values: Record<string, ControlValue>
  cameraPreset?: string
  cameraPresets?: CameraPreset[]
  ready: boolean
}

