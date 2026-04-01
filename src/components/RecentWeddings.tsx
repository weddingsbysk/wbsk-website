'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ClientItem {
  _id: string;
  title: string;
  slug: { current: string };
  coupleName: string;
  date: string;
  venue: string;
  description: string;
  coverImageUrl?: string;
  category?: { title: string };
}

const DEMO_CLIENTS: ClientItem[] = [
  { _id: '2', title: 'Cultural Celebration', slug: { current: 'cultural-celebration' }, coupleName: 'Ayushi & Kunal', date: '2025-02-14', venue: 'Mishtten Club, Kota', description: 'A vibrant celebration of love, tradition, and cultural heritage.', category: { title: 'Traditional' } },
  { _id: '3', title: 'Seaside Elegance', slug: { current: 'seaside-elegance' }, coupleName: 'Anusha & Rohit', date: '2025-03-29', venue: 'La Cabana, Goa', description: 'An elegant beachside ceremony with stunning ocean views.', category: { title: 'Destination' } },
  { _id: '4', title: 'Mountain Bliss', slug: { current: 'mountain-bliss' }, coupleName: 'Anukriti & Gaurav', date: '2025-03-03', venue: 'Evara Resort, Corbett', description: 'A breathtaking mountain wedding surrounded by nature\'s grandeur.', category: { title: 'Destination' } },
];

export default function RecentWeddings({ clients }: { clients?: ClientItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const displayClients = clients?.length ? clients : DEMO_CLIENTS;
  const tripled = [...displayClients, ...displayClients, ...displayClients];

  useEffect(() => {
    const el = sectionRef.current;
    const track = cardsRef.current;
    if (!el || !track) return;

    let ctx: any;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Heading reveal
        gsap.fromTo('.weddings-heading',
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: '.weddings-heading', start: 'top 85%', once: true } }
        );

        gsap.fromTo('.weddings-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power3.inOut', delay: 0.2,
            scrollTrigger: { trigger: '.weddings-divider', start: 'top 85%', once: true } }
        );

        gsap.fromTo('.weddings-subtext',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3,
            scrollTrigger: { trigger: '.weddings-subtext', start: 'top 85%', once: true } }
        );

        // Cards stagger reveal
        const cards = track.querySelectorAll('.wedding-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: track, start: 'top 85%', once: true } }
        );

        // Infinite GSAP-driven marquee (much smoother than CSS)
        const totalWidth = track.scrollWidth / 3;
        const marquee = gsap.to(track, {
          x: -totalWidth,
          duration: 50,
          ease: 'none',
          repeat: -1,
        });

        // Slow down on hover
        track.addEventListener('mouseenter', () => gsap.to(marquee, { timeScale: 0.15, duration: 0.8 }));
        track.addEventListener('mouseleave', () => gsap.to(marquee, { timeScale: 1, duration: 0.8 }));
      }, el);
    };

    loadGsap();

    return () => ctx?.revert();
  }, []);

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section ref={sectionRef} id="weddings" className="py-28 lg:py-40 bg-cream-50 overflow-hidden">
      <div className="text-center px-6 mb-20">
        <h2 className="weddings-heading font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-espresso-800">
          Recent Weddings
        </h2>
        <div className="weddings-divider w-20 h-[2px] bg-gold-500 mx-auto mt-6 mb-5 origin-center" />
        <p className="weddings-subtext text-espresso-400 font-body text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">
          Each wedding is a unique story waiting to be told.<br />Explore our recent celebrations of love.
        </p>
      </div>

      <div className="overflow-hidden">
        <div ref={cardsRef} className="flex gap-7 px-6" style={{ width: 'max-content' }}>
          {tripled.map((client, i) => (
            <Link
              key={`${client._id}-${i}`}
              href={`/client/${client.slug.current}`}
              className="wedding-card group flex-shrink-0 w-[300px] lg:w-[340px]"
              data-cursor-hover
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
                <div className="overflow-hidden aspect-[4/5] relative bg-espresso-100">
                  {client.coverImageUrl ? (
                    <Image src={client.coverImageUrl} alt={client.title} fill
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      sizes="340px" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-espresso-200 via-espresso-300 to-espresso-200 flex items-center justify-center">
                      <span className="text-espresso-400/60 font-display text-xl italic">{client.coupleName}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-8">
                    <span className="text-cream-50 text-[11px] tracking-[0.3em] uppercase font-sans translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 flex items-center gap-2">
                      View Gallery
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                  {client.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-espresso-900/50 backdrop-blur-md rounded-full">
                      <span className="text-cream-50/90 text-[10px] tracking-widest uppercase font-sans">{client.category.title}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-espresso-800 group-hover:text-gold-600 transition-colors duration-500">{client.title}</h3>
                  <p className="text-gold-500 font-body text-base mt-1 italic">{client.coupleName}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-sans text-espresso-400">
                    <svg className="w-3.5 h-3.5 text-gold-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {formatDate(client.date)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-sans text-espresso-400">
                    <svg className="w-3.5 h-3.5 text-gold-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {client.venue}
                  </div>
                  <p className="mt-4 text-[13px] text-espresso-500/80 font-body leading-relaxed line-clamp-2">{client.description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
