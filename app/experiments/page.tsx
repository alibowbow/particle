import { PageIntro } from '@/components/layout/page-intro'
import { ExperimentCard } from '@/components/ui/experiment-card'
import { EXPERIMENTS } from '@/lib/experiments/catalog'

export default function ExperimentsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Experiments"
        title="???, ???, ????? ?? ???"
        description="? ??? ?? ? ??? ????. ?? ???? ????, Reset/Randomize, ???, ??? ??, Code Mode? ?????? ?? ?? ?? ??? ???."
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

