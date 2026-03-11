import { notFound } from 'next/navigation'

import { ExperimentShell } from '@/components/experiment-shell/experiment-shell'
import { getExperiment } from '@/lib/experiments/catalog'

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const experiment = getExperiment(slug)

  if (!experiment) {
    notFound()
  }

  return <ExperimentShell definition={experiment} />
}
