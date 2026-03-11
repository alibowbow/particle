import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  className?: string
  actions?: ReactNode
}) {
  return (
    <section className={cn('page-shell pt-14 sm:pt-18', className)}>
      <div className="max-w-3xl space-y-5">
        <div className="text-xs uppercase tracking-[0.32em] text-plasma">{eyebrow}</div>
        <h1 className="text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-mist sm:text-lg">{description}</p>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

