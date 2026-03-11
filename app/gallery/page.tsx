import { PageIntro } from '@/components/layout/page-intro'
import { RemixCard } from '@/components/ui/remix-card'
import { GALLERY_ENTRIES } from '@/lib/presets/gallery'

export default function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Remix Gallery"
        title="?? preset ???? ???? ??? ???"
        description="?? ??? DB? ???, ???? ?? ?? ??? ?? ???? ??. ??? ?? ??? ??, ?????, ?? ??? ??? ? ??."
      />
      <section className="page-shell pb-20 pt-10">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {GALLERY_ENTRIES.map((entry) => (
            <RemixCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  )
}

