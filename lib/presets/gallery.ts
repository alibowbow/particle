import { EXPERIMENTS } from '@/lib/experiments/catalog'

export type GalleryEntry = {
  id: string
  title: string
  experimentSlug: string
  experimentTitle: string
  summary: string
  href: string
}

export const GALLERY_ENTRIES: GalleryEntry[] = EXPERIMENTS.flatMap((experiment, index) =>
  experiment.presets.slice(0, 2).map((preset, presetIndex) => ({
    id: `${experiment.slug}-${preset.id}`,
    title: preset.name,
    experimentSlug: experiment.slug,
    experimentTitle: experiment.title,
    summary: preset.summary,
    href: `/experiments/${experiment.slug}?preset=${preset.id}&from=gallery-${index + 1}-${presetIndex + 1}`,
  })),
)

