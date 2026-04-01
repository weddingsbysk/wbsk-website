'use client';

import { useEffect, useRef } from 'react';

interface PhilosophyProps {
  label?: string;
  quote?: string;
  highlight?: string;
  attribution?: string;
  stats?: { number: string; label: string }[];
}

const DEFAULT_STATS = [
  { number: '9+', label: 'Years of Craft' },
  { number: '500+', label: 'Stories Told' },
  { number: '1', label: 'Wedding Per Day' },
  { number: '∞', label: 'Memories Made' },
];

function parseStatNumber(str: string): { num: number; suffix: string } {
  const match = str.match(/^(\d+)(.*)$/);
  if (match) return { num: parseInt(match[1]), suffix: match[2] };
  return { num: 0, suffix: str };
}

export default function Philosophy({
  label = 'OUR PHILOSOPHY',
  quote = '"We don\'t just photograph weddings. We preserve the feeling of them."',
  highlight = 'feeling',
  attribution = '— SIDDHANT KAPOOR  ·  LEAD PHOTOGRAPHER',
  stats,
}: PhilosophyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const displayStats = stats?.length ? stats : DEFAULT_STATS;

  const renderQuote = () => {
    if (!highlight) return quote;
    const parts = quote.split(new RegExp(`(${highlight})`, 'i'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <em key={i} className="italic text-gold-400 font-display">{part}</em>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ctx: any;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo('.philosophy-label',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true } }
        );

        gsap.fromTo('.philosophy-quote',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 75%', once: true }, delay: 0.15 }
        );

        gsap.fromTo('.philosophy-attr',
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 70%', once: true }, delay: 0.4 }
        );

        // Counters
        counterRefs.current.forEach((counter, i) => {
          if (!counter) return;
          const stat = displayStats[i];
          const { num, suffix } = parseStatNumber(stat.number);

          if (num === 0) {
            gsap.fromTo(counter,
              { opacity: 0, scale: 0.5 },
              { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: i * 0.15,
                scrollTrigger: { trigger: counter, start: 'top 88%', once: true } }
            );
            return;
          }

          const obj = { val: 0 };
          gsap.to(obj, {
            val: num,
            duration: 2.5,
            ease: 'power2.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: counter, start: 'top 88%', once: true },
            onUpdate: () => { if (counter) counter.textContent = Math.floor(obj.val) + suffix; },
          });
        });

        // Stats blocks stagger
        const statItems = el.querySelectorAll('.stat-block');
        gsap.fromTo(statItems,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: statItems[0], start: 'top 88%', once: true } }
        );
      }, el);
    };

    loadGsap();

    return () => ctx?.revert();
  }, [displayStats]);

  return (
    <section ref={sectionRef} className="relative bg-espresso-900 text-cream-50 py-28 lg:py-40 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-gold-400/20" />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="philosophy-label text-[10px] tracking-[0.4em] uppercase text-gold-400 font-sans mb-12">
          {label}
        </p>

        <h2 className="philosophy-quote font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.25] font-medium max-w-4xl mx-auto">
          {renderQuote()}
        </h2>

        <p className="philosophy-attr mt-10 text-[10px] tracking-[0.3em] uppercase text-cream-200/30 font-sans">
          {attribution}
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 mt-24 lg:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {displayStats.map((stat, i) => (
          <div key={i} className="stat-block text-center">
            <span
              ref={(el) => { counterRefs.current[i] = el; }}
              className="counter-number text-5xl lg:text-6xl font-display font-bold text-cream-50"
            >
              {stat.number}
            </span>
            <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-cream-200/30 font-sans">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-transparent to-gold-400/20" />
    </section>
  );
}
