export type PaletteToken = {
  id: string
  name: string
  swatches: [string, string, string]
}

export const PALETTES: PaletteToken[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    swatches: ['#77F2FF', '#8F9DFF', '#0B1220'],
  },
  {
    id: 'ember',
    name: 'Ember',
    swatches: ['#FF8361', '#FFD06B', '#140E0A'],
  },
  {
    id: 'acid',
    name: 'Acid',
    swatches: ['#D2FF5D', '#6CFFB8', '#09110B'],
  },
  {
    id: 'mono',
    name: 'Mono Mist',
    swatches: ['#F4F7FB', '#8A96AA', '#090C11'],
  },
]

export function getPalette(id: string) {
  return PALETTES.find((palette) => palette.id === id) ?? PALETTES[0]
}

