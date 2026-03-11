'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils/cn'
import { NAV_ITEMS, SITE_NAME } from '@/lib/utils/site'

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-ink/60 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-xs font-medium uppercase tracking-[0.34em] text-plasma">
            SF
          </span>
          <div>
            <div className="text-sm font-medium tracking-[0.24em] text-white/96">{SITE_NAME}</div>
            <div className="text-xs text-mist">Interactive visual playground</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.04] p-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-2 text-sm transition-colors',
                  active ? 'bg-white/10 text-white' : 'text-mist hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

