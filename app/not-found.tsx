import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-xs uppercase tracking-[0.32em] text-plasma">404</div>
      <h1 className="mt-4 text-4xl font-medium text-white">Scene not found</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-mist">
        ?? ??? ????. ?? ????? ???? ?? ?????.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/"><Button variant="solid">Go Home</Button></Link>
        <Link href="/experiments"><Button variant="ghost">Browse Experiments</Button></Link>
      </div>
    </div>
  )
}

