import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import RecentWeddings from '@/components/RecentWeddings';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { heroData, philosophyData, aboutData } from '@/data/siteData';
import { getFeaturedClients } from '@/lib/data';

export default function HomePage() {
  const clients = getFeaturedClients();

  const mappedClients = clients.map((c) => ({
    _id: c.id,
    title: c.title,
    slug: { current: c.slug },
    coupleName: c.coupleName,
    date: c.date,
    venue: c.venue,
    description: c.description,
    coverImageUrl: c.coverImageUrl,
    category: c.category ? { title: c.category } : undefined,
  }));

  return (
    <>
      <Hero
        heading={heroData.heading}
        subtext={heroData.subtext}
        backgroundImage={heroData.backgroundImage || undefined}
        ctaText={heroData.ctaText}
        secondaryText={heroData.secondaryText}
        categories={heroData.scrollingCategories}
      />

      <Philosophy
        label={philosophyData.label}
        quote={philosophyData.quote}
        highlight={philosophyData.quoteHighlight}
        attribution={philosophyData.attribution}
        stats={philosophyData.stats}
      />

      <RecentWeddings clients={mappedClients as any} />

      <About
        heading={aboutData.heading}
        paragraphs={aboutData.paragraphs}
        backgroundImage={aboutData.backgroundImage || undefined}
      />

      <Contact />
    </>
  );
}
