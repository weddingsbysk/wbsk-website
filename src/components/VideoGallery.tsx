'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Video {
  title: string;
  embedUrl: string;
  thumbnail?: string;
}

function buildAutoplayUrl(embedUrl: string): string {
  if (embedUrl.includes('youtube.com/embed')) {
    return embedUrl.replace('autoplay=0', 'autoplay=1');
  }
  if (embedUrl.includes('vimeo.com/video')) {
    const sep = embedUrl.includes('?') ? '&' : '?';
    return embedUrl + sep + 'autoplay=1';
  }
  return embedUrl;
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    const gsap = (await import('gsap')).default;
    gsap.to(containerRef.current, { opacity: 0, scale: 0.92, y: 20, duration: 0.3, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
  }, [onClose]);

  // Open animation + body scroll lock
  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.88, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.05 }
      );
    };
    animate();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const autoplayUrl = buildAutoplayUrl(video.embedUrl);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Player container */}
      <div ref={containerRef} className="relative z-10 w-full max-w-[1080px] px-4 md:px-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          {video.title ? (
            <p className="text-cream-200/45 text-[11px] font-sans tracking-[0.3em] uppercase">{video.title}</p>
          ) : (
            <span />
          )}
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

        {/* Video iframe */}
        <div className="relative rounded-xl overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.95)] ring-1 ring-white/5">
          <div className="video-wrapper">
            <iframe
              src={autoplayUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={video.title || 'Wedding Film'}
            />
          </div>
        </div>

        {/* ESC hint */}
        <p className="text-center text-cream-200/18 text-[10px] tracking-[0.35em] uppercase font-sans mt-5">
          Press ESC to close
        </p>
      </div>
    </div>
  );
}

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-triggered card entrance
  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, scale: 0.93 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );
    };
    animate();
  }, []);

  if (videos.length === 0) return null;

  return (
    <>
      <section ref={sectionRef} className="py-24 lg:py-36 bg-[#0c0a08] relative overflow-hidden">
        {/* Atmospheric accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-gold-400/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Section heading */}
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-[10px] tracking-[0.45em] uppercase text-gold-400/70 font-sans mb-4">Films</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream-50">Wedding Films</h2>
            <p className="text-cream-200/30 font-body text-base mt-4 italic">Your story, told in motion</p>
          </div>

          {/* Video cards */}
          <div className={`grid gap-5 lg:gap-6 ${
            videos.length === 1
              ? 'grid-cols-1 max-w-3xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {videos.map((video, i) => (
              <div
                key={i}
                ref={el => { cardsRef.current[i] = el; }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-espresso-800 aspect-video select-none"
                onClick={() => setActiveVideo(video)}
                data-cursor-hover
              >
                {/* Thumbnail image or gradient fallback */}
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title || `Wedding Film ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-espresso-700 via-espresso-800 to-espresso-900" />
                )}

                {/* Cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-transparent" />

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-gold-400/25 transition-all duration-700" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Expanding ring on hover */}
                    <div className="absolute -inset-6 rounded-full border border-gold-400/0 group-hover:border-gold-400/15 scale-75 group-hover:scale-100 transition-all duration-700 ease-out" />
                    <div className="absolute -inset-10 rounded-full border border-white/0 group-hover:border-white/5 scale-50 group-hover:scale-100 transition-all duration-1000 ease-out" />

                    {/* Button circle */}
                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center
                      transition-all duration-500 ease-out
                      group-hover:bg-gold-400/20 group-hover:border-gold-400/50 group-hover:scale-110
                      group-hover:shadow-[0_0_40px_rgba(201,150,60,0.22)]">
                      <svg
                        className="w-6 h-6 lg:w-7 lg:h-7 text-cream-50 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom info — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-cream-200/30 text-[10px] font-sans tracking-[0.3em] uppercase mb-2">Wedding Film</p>
                  {video.title && (
                    <h3 className="text-cream-50 font-display text-lg lg:text-xl font-semibold leading-tight">
                      {video.title}
                    </h3>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
