import Link from 'next/link'

import { cn } from '@/lib/utils/cn'
import type { ExperimentDefinition } from '@/lib/experiments/types'

export function ExperimentCard({ experiment, featured = false }: { experiment: ExperimentDefinition; featured?: boolean }) {
  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]',
        featured ? 'min-h-[320px]' : 'min-h-[270px]',
      )}
    >
      <div
        className="absolute inset-0 opacity-60 transition duration-300 group-hover:opacity-90"
        style={{
          background: `radial-gradient(circle at top left, ${experiment.accent[0]}30, transparent 35%), radial-gradient(circle at bottom right, ${experiment.accent[1]}24, transparent 30%)`,
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap gap-2">
          {experiment.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-mist">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-medium tracking-tight text-white">{experiment.title}</h2>
          <p className="mt-3 text-sm leading-7 text-mist">{experiment.summary}</p>
        </div>
        <div className="mt-auto pt-10">
          <div className="h-2 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${experiment.accent[0]}, ${experiment.accent[1]})` }} />
          <div className="mt-4 text-sm text-white/88">{experiment.tagline}</div>
        </div>
      </div>
    </Link>
  )
}

