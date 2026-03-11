import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/cn'

const variants = {
  solid: 'bg-white text-ink hover:bg-white/90',
  ghost: 'bg-white/6 text-white hover:bg-white/12',
  subtle: 'bg-transparent text-mist hover:bg-white/6 hover:text-white',
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }>(
  function Button({ className, variant = 'ghost', ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)

