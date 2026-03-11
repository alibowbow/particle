'use client'

import Link from 'next/link'

import type { GalleryEntry } from '@/lib/presets/gallery'

import { Button } from '@/components/ui/button'

export function RemixCard({ entry }: { entry: GalleryEntry }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03] p-6">
      <div className="absolute inset-0 bg-shell opacity-70" />
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.24em] text-mist">{entry.experimentTitle}</div>
        <h2 className="mt-4 text-2xl text-white">{entry.title}</h2>
        <p className="mt-3 text-sm leading-7 text-mist">{entry.summary}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={entry.href}><Button variant="solid">Open</Button></Link>
          <Link href={`${entry.href}&remix=1`}><Button variant="ghost">Remix</Button></Link>
          <Button
            variant="subtle"
            onClick={async () => {
              if (typeof window === 'undefined') return
              await navigator.clipboard.writeText(`${window.location.origin}${entry.href}`)
            }}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  )
}

