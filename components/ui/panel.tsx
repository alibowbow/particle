import { cn } from '@/lib/utils/cn'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export function Panel({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('glass-panel rounded-[28px]', className)} {...props} />
}

export function PanelTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-medium tracking-tight text-white', className)}>{children}</h2>
}

