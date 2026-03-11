export type ControlValue = boolean | number | string

export type ControlOption = {
  label: string
  value: string
}

type BaseControl<Key extends string> = {
  id: Key
  label: string
  hint?: string
}

export type RangeControl<Key extends string> = BaseControl<Key> & {
  type: 'range'
  min: number
  max: number
  step?: number
}

export type ToggleControl<Key extends string> = BaseControl<Key> & {
  type: 'toggle'
}

export type SelectControl<Key extends string> = BaseControl<Key> & {
  type: 'select'
  options: ControlOption[]
}

export type ColorControl<Key extends string> = BaseControl<Key> & {
  type: 'color'
}

export type TextControl<Key extends string> = BaseControl<Key> & {
  type: 'text'
  placeholder?: string
}

export type ControlDefinition<Key extends string = string> =
  | RangeControl<Key>
  | ToggleControl<Key>
  | SelectControl<Key>
  | ColorControl<Key>
  | TextControl<Key>

export type ExperimentPreset<Key extends string = string> = {
  id: string
  name: string
  summary: string
  cameraPreset?: string
  values: Partial<Record<Key, ControlValue>>
}

export type CameraPreset = {
  id: string
  label: string
  position: [number, number, number]
  target?: [number, number, number]
}

export type LearnChunk = {
  title: string
  body: string
}

export type ExperimentDefinition<Key extends string = string> = {
  slug: string
  title: string
  tagline: string
  summary: string
  detail: string
  tags: string[]
  accent: [string, string]
  scene: string
  controls: ControlDefinition<Key>[]
  defaultValues: Record<Key, ControlValue>
  presets: ExperimentPreset<Key>[]
  cameraPresets?: CameraPreset[]
  learn: LearnChunk[]
  related: string[]
  codeSample: string
}

