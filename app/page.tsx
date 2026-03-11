import Link from 'next/link'

import { HomeHero } from '@/components/layout/home-hero'
import { PageIntro } from '@/components/layout/page-intro'
import { ExperimentCard } from '@/components/ui/experiment-card'
import { Button } from '@/components/ui/button'
import { FEATURED_EXPERIMENTS } from '@/lib/experiments/catalog'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PageIntro
        className="pb-4 pt-20"
        eyebrow="Why it feels different"
        title="A hands-on experiment UX inside a single cinematic surface"
        description="Scene Forge borrows the immediate parameter response, camera presets, and mode-switching energy of the reference, then rebuilds it as a premium digital playground focused on play, remixing, and learning."
        actions={
          <>
            <Link href="/experiments"><Button variant="solid">Browse Experiments</Button></Link>
            <Link href="/learn"><Button variant="ghost">Read Learn Notes</Button></Link>
          </>
        }
      />
      <section className="page-shell pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {FEATURED_EXPERIMENTS.map((experiment, index) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} featured={index === 0} />
          ))}
        </div>
      </section>
    </>
  )
}