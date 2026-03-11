import { PageIntro } from '@/components/layout/page-intro'
import { Panel } from '@/components/ui/panel'
import { LEARN_TOPICS } from '@/lib/learn/topics'

export default function LearnPage() {
  return (
    <>
      <PageIntro
        eyebrow="Learn"
        title="Short explanations for why each effect feels the way it does"
        description="Particles, noise, shaders, audio-reactive motion, and lightweight physics are explained in plain language. When a scene makes you curious, this page turns that instinct into understanding."
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