import { PageIntro } from '@/components/layout/page-intro'
import { RemixCard } from '@/components/ui/remix-card'
import { GALLERY_ENTRIES } from '@/lib/presets/gallery'

export default function GalleryPage() {
  return (
    <>
      <PageIntro
        eyebrow="Remix Gallery"
        title="A mock gallery built from presets, ready for remixing"
        description="There is no user database yet, but the preset and share-link workflow is already in place. Open a result, remix it, and copy the link back out with a single action."
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