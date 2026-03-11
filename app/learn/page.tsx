import { PageIntro } from '@/components/layout/page-intro'
import { Panel } from '@/components/ui/panel'
import { LEARN_TOPICS } from '@/lib/learn/topics'

export default function LearnPage() {
  return (
    <>
      <PageIntro
        eyebrow="Learn"
        title="??? ? ??? ????, ??? ?? ???? ??"
        description="???, ???, ???, ??? ????, ?? ?? ???? ?? ?? ???? ????. ??? ??? ????? ??? ??? ??? ??? ? ??."
      />
      <section className="page-shell pb-20 pt-10">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {LEARN_TOPICS.map((topic) => (
            <Panel key={topic.slug} className="p-6 sm:p-7">
              <div className="text-xs uppercase tracking-[0.28em] text-plasma">{topic.title}</div>
              <h2 className="mt-4 text-2xl text-white">{topic.summary}</h2>
              <p className="mt-4 text-sm leading-7 text-mist">{topic.body}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  )
}

