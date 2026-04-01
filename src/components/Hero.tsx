'use client';

import { useEffect, useRef } from 'react';
import { useMouseParallax } from '@/lib/animations';

interface HeroProps {
  heading?: string;
  subtext?: string;
  backgroundImage?: string;
  ctaText?: string;
  secondaryText?: string;
  categories?: string[];
}

// Fallback data when CMS is empty
const DEFAULTS = {
  heading: 'Timeless Moments. Preserved.',
  subtext:
    'Luxury wedding photography capturing authentic emotions, untold stories, and the quiet in-between moments that define your love.',
  ctaText: 'View Portfolio',
  secondaryText: 'Book a Session',
  categories: [
    'Pre-Wedding',
    'Bride & Groom',
    'Luxury Photography',
    'Weddings',
    'Candid Moments',
    'Haldi Ceremonies',
    'Portraits',
    'Engagements',
    'Pre-Wedding',
    'Bride & Groom',
    'Luxury Photography',
    'Candid Moments',
  ],
};

export default function Hero({
  heading,
  subtext,
  backgroundImage,
  ctaText,
  secondaryText,
  categories,
}: HeroProps) {
  const bgRef = useMouseParallax(0.015);
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const h = heading || DEFAULTS.heading;
  const s = subtext || DEFAULTS.subtext;
  const cats = categories?.length ? [...categories, ...categories] : DEFAULTS.categories;

  useEffect(() => {
    let ctx: any;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;

      ctx = gsap.context(() => {
        // Hero entrance timeline
        const tl = gsap.timeline({ delay: 0.5 });

        tl.fromTo(bgRef.current,
          { scale: 1.3, opacity: 0 },
          { scale: 1.05, opacity: 1, duration: 2, ease: 'power3.out' }
        );

        // Animate heading words
        if (headingRef.current) {
          const words = headingRef.current.querySelectorAll('.hero-word');
          tl.from(words, {
            y: 120, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out',
          }, '-=1.5');
        }

        tl.from(subtextRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
        tl.from(ctaRef.current, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');

        if (statsRef.current) {
          const items = statsRef.current.querySelectorAll('.stat-item');
          tl.from(items, { x: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5');
        }

        tl.from(marqueeRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
      });
    };

    loadGsap();

    return () => ctx?.revert();
  }, []);

  // Split heading into words wrapped in spans
  const headingWords = h.split(/(\s+)/).map((word, i) =>
    word.trim() ? (
      <span key={i} className="inline-block overflow-hidden">
        <span className="hero-word inline-block">{word}</span>
      </span>
    ) : (
      <span key={i}> </span>
    )
  );

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Video with Parallax */}
      <div className="absolute inset-0">
        <div
          ref={bgRef}
          className="absolute inset-[-5%] overflow-hidden parallax-bg"
          style={{ transform: 'scale(1.05)', opacity: 0 }}
        >
          {/* YouTube video — full-cover, auto-play, muted, looping */}
          <iframe
            src="https://www.youtube.com/embed/Uu6J7jDswug?autoplay=1&mute=1&loop=1&playlist=Uu6J7jDswug&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&playsinline=1"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 border-0 pointer-events-none"
            style={{
              width: '177.78vh',
              height: '100vh',
              minWidth: '100%',
              minHeight: '56.25vw',
              transform: 'translate(-50%, -50%)',
            }}
            title="Hero background video"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso-900/40 via-espresso-900/50 to-espresso-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-end pb-32 lg:pb-24 px-6 lg:px-16">
          {/* Breadcrumb style tags */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[10px] tracking-ultrawide uppercase text-cream-200/60 font-sans">
              Photography
            </span>
            <span className="w-1 h-1 rounded-full bg-gold-400" />
            <span className="text-[10px] tracking-ultrawide uppercase text-cream-200/60 font-sans">
              Films
            </span>
            <span className="w-1 h-1 rounded-full bg-gold-400" />
            <span className="text-[10px] tracking-ultrawide uppercase text-cream-200/60 font-sans">
              Events
            </span>
          </div>

          {/* Spaced brand name */}
          <p
            className="text-cream-200/60 text-sm lg:text-base tracking-[0.5em] uppercase font-body font-light mb-6"
            aria-label="Weddings By Siddhant Kapoor"
          >
            W e d d i n g s &nbsp;B y &nbsp;S i d d h a n t &nbsp;K a p o o r
          </p>

          {/* Main heading */}
          <h1
            ref={headingRef}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-cream-50 leading-[0.95] font-bold max-w-3xl"
          >
            {headingWords}
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="mt-6 text-cream-200/70 text-base lg:text-lg font-body leading-relaxed max-w-lg"
          >
            {s}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <a href="#weddings" className="btn-primary">
              <span>{ctaText || DEFAULTS.ctaText}</span>
            </a>
            <a href="#contact" className="btn-outline border-cream-200/30 text-cream-100">
              <span>{secondaryText || DEFAULTS.secondaryText}</span>
            </a>
          </div>
        </div>

        {/* Right side: Stats (visible on desktop) */}
        <div
          ref={statsRef}
          className="hidden lg:flex flex-col justify-center items-end pr-12 gap-8"
        >
          {[
            { num: '9', suffix: '+', label: 'Years of Craft' },
            { num: '500', suffix: '+', label: 'Stories Told' },
            { num: '1', suffix: '', label: 'Wedding Per Day' },
            { num: '∞', suffix: '', label: 'Memories Made' },
          ].map((stat, i) => (
            <div key={i} className="stat-item text-right">
              <span className="text-4xl xl:text-5xl font-display font-bold text-cream-50">
                {stat.num}
                {stat.suffix && <span className="text-gold-400">{stat.suffix}</span>}
              </span>
              <p className="text-[10px] tracking-ultrawide uppercase text-cream-200/50 font-sans mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Marquee */}
      <div
        ref={marqueeRef}
        className="absolute bottom-0 left-0 w-full bg-espresso-900/60 backdrop-blur-sm py-3 overflow-hidden"
      >
        <div className="marquee-track">
          {cats.map((cat, i) => (
            <span
              key={i}
              className="text-cream-200/60 text-xs tracking-ultrawide uppercase font-sans whitespace-nowrap flex items-center gap-6"
            >
              {cat}
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
