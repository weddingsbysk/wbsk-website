'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ExportedImage from 'next-image-export-optimizer';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ProcessedVideo {
  title: string;
  embedUrl: string;
  thumbnail: string;
}

interface Films {
  weddingFilms: ProcessedVideo[];
  highlights: ProcessedVideo[];
  teasers: ProcessedVideo[];
}

type Category = 'weddingFilms' | 'highlights' | 'teasers';

const CATEGORY_LABELS: Record<Category, string> = {
  weddingFilms: 'Wedding Films',
  highlights: 'Highlights',
  teasers: 'Teasers',
};

const CARD_GAP = 24;

// ─── VIDEO MODAL ─────────────────────────────────────────────────────────────

function buildAutoplayUrl(embedUrl: string): string {
  if (embedUrl.includes('youtube.com/embed')) return embedUrl.replace('autoplay=0', 'autoplay=1');
  if (embedUrl.includes('vimeo.com/video')) return embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
  return embedUrl;
}

function VideoModal({ video, onClose }: { video: ProcessedVideo; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    const gsap = (await import('gsap')).default;
    gsap.to(containerRef.current, { opacity: 0, scale: 0.93, y: 16, duration: 0.3, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.88, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.04 }
      );
    };
    animate();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div ref={backdropRef} className="absolute inset-0 bg-black/96 backdrop-blur-sm" onClick={handleClose} />
      <div ref={containerRef} className="relative z-10 w-full max-w-[1100px] px-4 md:px-10">
        <div className="flex items-center justify-between mb-5">
          {video.title
            ? <p className="text-cream-200/40 text-[11px] font-sans tracking-[0.3em] uppercase">{video.title}</p>
            : <span />
          }
          <button
            onClick={handleClose}
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-cream-50/40 hover:text-cream-50 hover:border-white/30 transition-all duration-300"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_140px_rgba(0,0,0,0.95)] ring-1 ring-white/5">
          <div className="video-wrapper">
            <iframe
              src={buildAutoplayUrl(video.embedUrl)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={video.title || 'Wedding Film'}
            />
          </div>
        </div>
        <p className="text-center text-cream-200/15 text-[10px] tracking-[0.35em] uppercase font-sans mt-5">
          Press ESC to close
        </p>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER CARD ─────────────────────────────────────────────────────────

function PlaceholderCard({ width }: { width: number }) {
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-[#0f0d0b] border border-white/5"
      style={{ width: `${width}px`, aspectRatio: '16/9' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border border-espresso-700/50 flex items-center justify-center">
          <svg className="w-5 h-5 text-espresso-600/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>
        <p className="text-espresso-600/60 text-[10px] tracking-[0.35em] uppercase font-sans">Coming Soon</p>
      </div>
    </div>
  );
}

// ─── MAIN CAROUSEL ────────────────────────────────────────────────────────────

export default function VideoCarousel({ films }: { films: Films }) {
  const availableCategories = (Object.keys(CATEGORY_LABELS) as Category[]).filter(
    (k) => (films[k]?.length ?? 0) > 0
  );

  const [activeCategory, setActiveCategory] = useState<Category>(
    availableCategories[0] ?? 'weddingFilms'
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<ProcessedVideo | null>(null);
  const [cardW, setCardW] = useState(600);

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive card width
  useEffect(() => {
    const measure = () => {
      setCardW(Math.min(600, window.innerWidth - 64));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const videos = films[activeCategory] ?? [];
  const hasVideos = videos.length > 0;

  const centerCard = useCallback((index: number, animate = true) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const actualCardW = cardsRef.current.find(Boolean)?.offsetWidth ?? cardW;
    const containerCenter = container.offsetWidth / 2;
    const targetX = containerCenter - index * (actualCardW + CARD_GAP) - actualCardW / 2;

    if (animate) {
      import('gsap').then(({ default: gsap }) => {
        gsap.to(track, { x: targetX, duration: 0.7, ease: 'power3.out' });
      });
    } else {
      track.style.transform = `translateX(${targetX}px)`;
    }
  }, [cardW]);

  useEffect(() => {
    setActiveIndex(0);
    // slight delay so cardW state settles first
    const t = setTimeout(() => centerCard(0, false), 50);
    return () => clearTimeout(t);
  }, [activeCategory, centerCard]);

  // Entry animation (scroll-triggered, once)
  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );
    };
    animate();
  }, [activeCategory]);

  const go = useCallback((dir: 'prev' | 'next') => {
    setActiveIndex((prev) => {
      const total = hasVideos ? videos.length : 1;
      const next = dir === 'next'
        ? (prev + 1) % total
        : (prev - 1 + total) % total;
      centerCard(next);
      return next;
    });
  }, [hasVideos, videos.length, centerCard]);

  const handleCardClick = (video: ProcessedVideo, index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      centerCard(index);
    } else {
      setActiveVideo(video);
    }
  };

  const allEmpty = availableCategories.length === 0;

  return (
    <>
      <section ref={sectionRef} className="pt-24 pb-28 lg:pt-32 lg:pb-36 bg-[#0c0a08] relative overflow-hidden">

        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-gold-400/35 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-gold-400/12 to-transparent" />

        {/* Section heading */}
        <div className="text-center mb-12 px-6">
          <p className="text-[10px] tracking-[0.45em] uppercase text-gold-400/65 font-sans mb-4">Films</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream-50 leading-[1.1]">
            Wedding Films
          </h2>
          <p className="text-cream-200/30 font-body text-base mt-4 italic">Your story, told in motion</p>
        </div>

        {/* Category tabs */}
        {!allEmpty && availableCategories.length > 1 && (
          <div className="flex justify-center gap-1 mb-12 px-6">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[11px] tracking-[0.22em] uppercase font-sans rounded-full transition-all duration-500 ${
                  activeCategory === cat
                    ? 'bg-gold-400/15 text-gold-400 border border-gold-400/35'
                    : 'text-cream-200/30 hover:text-cream-200/60 border border-transparent hover:border-white/10'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}

        {/* Carousel viewport */}
        <div ref={containerRef} className="relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ gap: `${CARD_GAP}px`, paddingTop: '20px', paddingBottom: '36px' }}
          >
            {allEmpty ? (
              <PlaceholderCard width={cardW} />
            ) : (
              videos.map((video, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    ref={el => { cardsRef.current[i] = el; }}
                    className={`relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-600 ease-out ${
                      isActive
                        ? 'ring-1 ring-gold-400/25 shadow-[0_8px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(201,150,60,0.1)] scale-[1.025]'
                        : 'scale-[0.94] opacity-40'
                    }`}
                    style={{ width: `${cardW}px`, aspectRatio: '16/9' }}
                    onClick={() => handleCardClick(video, i)}
                  >
                    {video.thumbnail ? (
                      <ExportedImage
                        src={video.thumbnail}
                        alt={video.title || `Video ${i + 1}`}
                        fill
                        className={`object-cover transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-[1.04]'}`}
                        sizes={`${cardW}px`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-espresso-700 via-espresso-800 to-espresso-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent" />

                    {/* Play — only on active */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="relative group/play">
                        <div className="absolute -inset-6 rounded-full border border-gold-400/0 group-hover/play:border-gold-400/20 scale-90 group-hover/play:scale-100 transition-all duration-700" />
                        <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-full border border-white/20 bg-black/25 backdrop-blur-md flex items-center justify-center
                          hover:bg-gold-400/20 hover:border-gold-400/50 hover:shadow-[0_0_32px_rgba(201,150,60,0.25)] transition-all duration-500">
                          <svg className="w-6 h-6 text-cream-50 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Bottom info — active only */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                        <p className="text-cream-200/30 text-[10px] font-sans tracking-[0.3em] uppercase mb-1.5">
                          {CATEGORY_LABELS[activeCategory]}
                        </p>
                        {video.title && (
                          <h3 className="text-cream-50 font-display text-lg lg:text-xl font-semibold leading-snug">
                            {video.title}
                          </h3>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Navigation arrows */}
          {hasVideos && videos.length > 1 && (
            <>
              <button
                onClick={() => go('prev')}
                className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-cream-50/45 hover:text-cream-50 hover:border-white/25 hover:bg-black/70 transition-all duration-300"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => go('next')}
                className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-cream-50/45 hover:text-cream-50 hover:border-white/25 hover:bg-black/70 transition-all duration-300"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {hasVideos && videos.length > 1 && (
          <div className="flex justify-center gap-2 mt-7">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); centerCard(i); }}
                className={`rounded-full transition-all duration-400 ${
                  i === activeIndex
                    ? 'w-6 h-1.5 bg-gold-400'
                    : 'w-1.5 h-1.5 bg-espresso-600 hover:bg-espresso-500'
                }`}
                aria-label={`Video ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
