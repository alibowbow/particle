import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-mist', className)}>
      {children}
    </span>
  )
}

