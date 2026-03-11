import { PageIntro } from '@/components/layout/page-intro'
import { ExperimentCard } from '@/components/ui/experiment-card'
import { EXPERIMENTS } from '@/lib/experiments/catalog'

export default function ExperimentsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Experiments"
        title="A playable library of interactive visual systems"
        description="Each experiment runs inside the same reusable shell. Parameters, presets, camera composition, Reset, Randomize, Share, and Code Mode stay consistent while each scene keeps its own visual language."
      />
      <section className="page-shell pb-20 pt-10">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {EXPERIMENTS.map((experiment) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} />
          ))}
        </div>
      </section>
    </>
  )
}