import { notFound } from 'next/navigation';
import { getClientBySlug, getAllClientSlugs, processFilms, processReels } from '@/lib/data';
import ClientGalleryPage from '@/components/ClientGalleryPage';

export function generateStaticParams() {
  return getAllClientSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const data = getClientBySlug(slug);
  if (!data) return { title: 'Wedding — WBSK' };
  return {
    title: `${data.title} — ${data.coupleName} | WBSK`,
    description: data.description,
  };
}

export default async function ClientPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const data = getClientBySlug(slug);

  if (!data) notFound();

  const gallery = (data.gallery ?? []).map((item, i) => ({
    url: item.url,
    caption: item.caption ?? '',
    key: String(i),
  }));

  return (
    <ClientGalleryPage
      title={data.title}
      coupleName={data.coupleName}
      date={data.date}
      venue={data.venue}
      description={data.description}
      coverUrl={data.coverImageUrl ?? ''}
      gallery={gallery}
      films={processFilms(data.films)}
      reels={processReels(data.reels)}
      whatWeCapture={data.whatWeCapture}
    />
  );
}
