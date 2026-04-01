'use client';

import { useEffect, useRef, useState } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import GalleryScroll from '@/components/GalleryScroll';
import VideoCarousel from '@/components/VideoCarousel';
import ReelsPlayer from '@/components/ReelsPlayer';
import WhatWeCapture from '@/components/WhatWeCapture';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface GalleryImage { url: string; caption?: string; key: string; }
interface ProcessedVideo { title: string; embedUrl: string; thumbnail: string; }
interface Films {
  weddingFilms: ProcessedVideo[];
  highlights: ProcessedVideo[];
  teasers: ProcessedVideo[];
}
interface Reel { embedUrl: string; title: string; }
interface CaptureCategory { description: string; image?: string; }

interface Props {
  title: string;
  coupleName: string;
  date: string;
  venue: string;
  description: string;
  coverUrl: string;
  gallery: GalleryImage[];
  films: Films;
  reels: Reel[];
  whatWeCapture?: {
    candid?: CaptureCategory;
    portrait?: CaptureCategory;
    traditional?: CaptureCategory;
  };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ClientGalleryPage({
  title, coupleName, date, venue, description, coverUrl,
  gallery, films, reels, whatWeCapture,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  // GSAP hero parallax + entrance
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;
    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const heroBg = heroRef.current?.querySelector('.client-hero-bg');
        if (heroBg) {
          gsap.to(heroBg, {
            yPercent: 28, ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
          });
        }
        gsap.from('.client-eyebrow', { y: 20, opacity: 0, duration: 1,   delay: 0.1, ease: 'power3.out' });
        gsap.from('.client-title',   { y: 80, opacity: 0, duration: 1.4, delay: 0.25, ease: 'power4.out' });
        gsap.from('.client-rule',    { scaleX: 0, opacity: 0, duration: 0.9, delay: 0.55, ease: 'power3.out', transformOrigin: 'left' });
        gsap.from('.client-couple',  { y: 40, opacity: 0, duration: 1.0, delay: 0.5, ease: 'power3.out' });
        gsap.from('.client-meta',    { y: 24, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
        gsap.from('.client-scroll-hint', { opacity: 0, y: 10, duration: 1, delay: 1.2, ease: 'power2.out' });

        gsap.fromTo('.client-desc',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.client-desc', start: 'top 88%', once: true } }
        );
      });
    };
    loadGsap();
    return () => ctx?.revert();
  }, []);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(p => p !== null ? (p + 1) % gallery.length : null);
      if (e.key === 'ArrowLeft')  setLightboxIndex(p => p !== null ? (p - 1 + gallery.length) % gallery.length : null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightboxIndex, gallery.length]);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          {coverUrl ? (
            <div className="client-hero-bg absolute inset-[-15%]">
              <ExportedImage src={coverUrl} alt={coupleName} fill priority
                className="object-cover object-center" sizes="100vw" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-espresso-400 to-espresso-700" />
          )}
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/98 via-espresso-900/30 to-espresso-900/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-900/40 via-transparent to-transparent" />
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-8 left-6 lg:left-12 z-20 text-cream-200/40 text-[10px] tracking-[0.3em] uppercase font-sans hover:text-gold-400 transition-colors duration-500 flex items-center gap-2.5 group"
        >
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Portfolio
        </Link>

        {/* Hero text block */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 lg:pb-20 px-6 lg:px-14 max-w-7xl mx-auto w-full">
          <p className="client-eyebrow text-[10px] tracking-[0.42em] uppercase text-gold-400/75 font-sans mb-5">
            {date ? formatDate(date) : 'Wedding Story'}
          </p>
          <h1 className="client-title font-display text-5xl lg:text-7xl xl:text-8xl font-bold text-cream-50 leading-[0.92] mb-5">
            {title}
          </h1>
          {/* Decorative rule */}
          <div className="client-rule w-16 h-px bg-gradient-to-r from-gold-400/70 to-transparent mb-5" />
          <p className="client-couple text-gold-400/90 font-body text-xl lg:text-2xl italic mb-5">{coupleName}</p>
          <div className="client-meta flex flex-wrap items-center gap-5 text-cream-200/40 text-[11px] font-sans tracking-wider">
            {venue && (
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {venue}
              </span>
            )}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="client-scroll-hint absolute bottom-8 right-8 lg:right-14 flex flex-col items-center gap-2 text-cream-200/25 select-none pointer-events-none">
          <p className="text-[9px] tracking-[0.4em] uppercase font-sans rotate-90 origin-center mb-2">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-cream-200/30 to-transparent" />
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
      {description && (
        <section className="py-24 lg:py-32 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            {/* Ornament */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-10 bg-gold-400/40" />
              <svg className="w-2.5 h-2.5 text-gold-400/50" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 0 L6.18 3.82 L10 5 L6.18 6.18 L5 10 L3.82 6.18 L0 5 L3.82 3.82 Z" />
              </svg>
              <div className="h-px w-10 bg-gold-400/40" />
            </div>
            <p className="client-desc text-espresso-500/85 font-body text-lg lg:text-xl leading-[1.95] italic">
              &ldquo;{description}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="h-px w-10 bg-espresso-200/60" />
              <div className="w-1 h-1 rounded-full bg-espresso-300/60" />
              <div className="h-px w-10 bg-espresso-200/60" />
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY SCROLL ───────────────────────────────────────────────── */}
      <GalleryScroll
        images={gallery}
        title={title}
        onImageClick={(i) => setLightboxIndex(i)}
      />

      {/* ── VIDEO CAROUSEL ───────────────────────────────────────────────── */}
      <VideoCarousel films={films} />

      {/* ── REELS ────────────────────────────────────────────────────────── */}
      <ReelsPlayer reels={reels} />

      {/* ── WHAT WE CAPTURE ──────────────────────────────────────────────── */}
      {whatWeCapture && <WhatWeCapture {...whatWeCapture} />}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-espresso-900 text-center relative overflow-hidden">
        {/* Subtle gradient bleed from sections above */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a08] via-espresso-900 to-espresso-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-gold-400/30 to-transparent" />

        <div className="relative z-10 max-w-xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-10 bg-gold-400/35" />
            <svg className="w-2.5 h-2.5 text-gold-400/45" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0 L6.18 3.82 L10 5 L6.18 6.18 L5 10 L3.82 6.18 L0 5 L3.82 3.82 Z" />
            </svg>
            <div className="h-px w-10 bg-gold-400/35" />
          </div>
          <p className="text-[10px] tracking-[0.44em] uppercase text-gold-400/70 font-sans mb-6">Loved what you saw?</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream-50 leading-[1.1] mb-4">
            Let&apos;s Create<br className="hidden lg:block" /> Your Story
          </h2>
          <p className="text-cream-200/35 font-body text-base italic mb-12">
            Every love story deserves to be preserved.
          </p>
          <a href="/#contact" className="btn-primary"><span>Book Your Session</span></a>
        </div>
      </section>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center animate-[fadeIn_0.25s_ease-out]"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-cream-50/40 hover:text-cream-50 hover:border-white/25 transition-all duration-300"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/8 text-cream-50/35 hover:text-cream-50 hover:border-white/25 transition-all duration-300"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <ExportedImage
              src={gallery[lightboxIndex].url}
              alt={gallery[lightboxIndex].caption || ''}
              width={1400} height={1000}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
              priority
            />
            {gallery[lightboxIndex].caption && (
              <p className="text-center text-cream-200/45 text-xs font-body italic mt-4">
                {gallery[lightboxIndex].caption}
              </p>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-white/8 text-cream-50/35 hover:text-cream-50 hover:border-white/25 transition-all duration-300"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream-200/30 text-[10px] font-sans tracking-[0.3em]">
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </p>
        </div>
      )}
    </>
  );
}
