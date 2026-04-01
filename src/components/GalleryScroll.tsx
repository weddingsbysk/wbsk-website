'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  caption?: string;
  key: string;
}

interface Props {
  images: GalleryImage[];
  title: string;
  onImageClick: (index: number) => void;
}

// Editorial width pattern — repeats every 5 cards
const WIDTHS       = [300, 260, 480, 300, 380];
const HEIGHTS_FRAC = [1, 0.88, 0.72, 0.94, 0.82];
const STRIP_H      = 560; // px

export default function GalleryScroll({ images, title, onImageClick }: Props) {
  const stripRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const thumbRef   = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const stateRef   = useRef({ pos: 0, target: 0, over: false, dragging: false, dragStartX: 0, dragStartPos: 0 });

  /* ── smooth lerp + scrollbar sync ──────────────────────────────────────── */
  useEffect(() => {
    if (!stripRef.current || images.length === 0) return;
    const strip = stripRef.current;
    const s     = stateRef.current;
    let raf: number;

    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));

    const updateThumb = () => {
      const thumb = thumbRef.current;
      const track = trackRef.current;
      if (!thumb || !track) return;
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const fraction  = maxScroll > 0 ? s.pos / maxScroll : 0;
      const trackW    = track.clientWidth;
      const thumbW    = Math.max(48, (strip.clientWidth / strip.scrollWidth) * trackW);
      thumb.style.width     = `${thumbW}px`;
      thumb.style.transform = `translateX(${fraction * (trackW - thumbW)}px)`;
    };

    const tick = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      s.target     = clamp(s.target, 0, max);
      s.pos        = lerp(s.pos, s.target, 0.07);
      strip.scrollLeft = s.pos;
      updateThumb();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [images.length]);

  /* ── wheel hijack ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!sectionRef.current || images.length === 0) return;
    const section = sectionRef.current;
    const s       = stateRef.current;

    const onEnter = () => { s.over = true; };
    const onLeave = () => { s.over = false; };
    const onWheel = (e: WheelEvent) => {
      if (!s.over) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.target += delta * 1.4;
    };

    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    section.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      section.removeEventListener('wheel', onWheel);
    };
  }, [images.length]);

  /* ── strip drag-to-scroll ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!stripRef.current || images.length === 0) return;
    const strip = stripRef.current;
    const s     = stateRef.current;

    const onDown = (e: MouseEvent) => {
      s.dragging     = true;
      s.dragStartX   = e.clientX;
      s.dragStartPos = s.target;
      strip.style.cursor = 'grabbing';
    };
    const onMove = (e: MouseEvent) => {
      if (!s.dragging) return;
      s.target = s.dragStartPos - (e.clientX - s.dragStartX) * 1.6;
    };
    const onUp = () => { s.dragging = false; strip.style.cursor = 'grab'; };

    strip.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    strip.style.cursor = 'grab';
    return () => {
      strip.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [images.length]);

  /* ── scrollbar thumb drag + track click ────────────────────────────────── */
  useEffect(() => {
    if (!thumbRef.current || !trackRef.current || !stripRef.current || images.length === 0) return;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    const strip = stripRef.current;
    const s     = stateRef.current;
    let thumbDragging = false;
    let thumbDragStartX = 0;
    let thumbDragStartTarget = 0;

    const onThumbDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      thumbDragging = true;
      thumbDragStartX = e.clientX;
      thumbDragStartTarget = s.target;
      document.body.style.userSelect = 'none';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!thumbDragging) return;
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const trackW    = track.clientWidth;
      const thumbW    = Math.max(48, (strip.clientWidth / strip.scrollWidth) * trackW);
      const dx        = e.clientX - thumbDragStartX;
      s.target = thumbDragStartTarget + (dx / (trackW - thumbW)) * maxScroll;
    };
    const onMouseUp = () => {
      thumbDragging = false;
      document.body.style.userSelect = '';
    };
    const onTrackClick = (e: MouseEvent) => {
      if (thumbDragging) return;
      const rect      = track.getBoundingClientRect();
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const trackW    = track.clientWidth;
      const thumbW    = Math.max(48, (strip.clientWidth / strip.scrollWidth) * trackW);
      const clickX    = e.clientX - rect.left - thumbW / 2;
      s.target = (clickX / (trackW - thumbW)) * maxScroll;
    };

    thumb.addEventListener('mousedown', onThumbDown);
    track.addEventListener('click', onTrackClick);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      thumb.removeEventListener('mousedown', onThumbDown);
      track.removeEventListener('click', onTrackClick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [images.length]);

  /* ── header + grid entrance animation ──────────────────────────────────── */
  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll('.anim');
        gsap.fromTo(els,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true } }
        );
      }
      if (gridRef.current && images.length >= 2) {
        const cells = gridRef.current.querySelectorAll('.grid-cell');
        gsap.fromTo(cells,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.4, stagger: 0.14, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true } }
        );
      }
    };
    animate();
  }, [images.length]);

  if (images.length === 0) return null;
  const showGrid = images.length >= 2;

  return (
    <section ref={sectionRef} className="bg-[#f7f4ef] overflow-hidden select-none">

      {/* ── EDITORIAL GRID COLLAGE (Best Moments) ───────────────────────── */}
      {showGrid && (
        <div
          ref={gridRef}
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: images.length >= 3 ? '3fr 2fr' : '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '3px',
            height: 'clamp(480px, 80vh, 740px)',
          }}
        >
          {/* Main image — spans both rows */}
          <div
            className="grid-cell row-span-2 relative overflow-hidden group cursor-pointer"
            onClick={() => onImageClick(0)}
          >
            {images[0].url
              ? <Image src={images[0].url} alt={images[0].caption || `${title} 1`} fill priority
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="60vw" />
              : <div className="absolute inset-0 bg-[#2a1f14]" />
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-700" />
            <div className="absolute top-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white/50 text-[9px] tracking-[0.4em] font-sans uppercase">01</span>
            </div>
          </div>

          {/* Top-right */}
          <div
            className="grid-cell relative overflow-hidden group cursor-pointer"
            onClick={() => onImageClick(1)}
          >
            {images[1].url
              ? <Image src={images[1].url} alt={images[1].caption || `${title} 2`} fill
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="40vw" loading="lazy" />
              : <div className="absolute inset-0 bg-[#2a1f14]" />
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-700" />
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white/50 text-[9px] tracking-[0.4em] font-sans uppercase">02</span>
            </div>
          </div>

          {/* Bottom-right */}
          {images.length >= 3 && (
            <div
              className="grid-cell relative overflow-hidden group cursor-pointer"
              onClick={() => onImageClick(2)}
            >
              {images[2].url
                ? <Image src={images[2].url} alt={images[2].caption || `${title} 3`} fill
                    className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes="40vw" loading="lazy" />
                : <div className="absolute inset-0 bg-[#2a1f14]" />
              }
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-700" />
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white/50 text-[9px] tracking-[0.4em] font-sans uppercase">03</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 lg:px-14 pt-16 pb-10">
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-end gap-8">
            <div className="anim opacity-0 hidden lg:block">
              <div className="w-px bg-gradient-to-b from-transparent via-[#b49a6e] to-transparent"
                   style={{ height: '64px' }} />
            </div>
            <div>
              <p className="anim opacity-0 text-[9px] tracking-[0.5em] uppercase text-[#b49a6e] font-sans mb-2.5">
                Full Gallery
              </p>
              <h2 className="anim opacity-0 font-display text-[2.6rem] lg:text-[3.2rem] font-bold
                             text-[#2a1f14] leading-[0.95] tracking-tight">
                Every&nbsp;<em className="not-italic text-[#b49a6e]">Frame</em>
              </h2>
            </div>
          </div>
          <div className="anim opacity-0 text-right pb-1">
            <p className="text-[#2a1f14]/30 text-xs font-body tracking-widest uppercase mb-1">
              {images.length} photographs
            </p>
            <p className="text-[#2a1f14]/20 text-[10px] tracking-[0.3em] font-sans hidden md:block">
              Scroll or drag to explore
            </p>
          </div>
        </div>
        <div className="anim opacity-0 mt-7 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-[#b49a6e]/40 via-[#b49a6e]/15 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#b49a6e]/40 flex-shrink-0" />
          <div className="w-16 h-px bg-[#b49a6e]/20 flex-shrink-0" />
        </div>
      </div>

      {/* ── SCROLL STRIP ────────────────────────────────────────────────────── */}
      <div className="relative" style={{ height: `${STRIP_H}px` }}>
        {/* Edge vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48
                        bg-gradient-to-r from-[#f7f4ef] via-[#f7f4ef]/60 to-transparent
                        z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48
                        bg-gradient-to-l from-[#f7f4ef] via-[#f7f4ef]/60 to-transparent
                        z-10 pointer-events-none" />

        <div
          ref={stripRef}
          className="absolute inset-0 overflow-hidden flex items-center"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex items-center gap-3 lg:gap-4 px-8 lg:px-16 w-max">
            {images.map((img, i) => {
              const cardW  = WIDTHS[i % WIDTHS.length];
              const cardH  = Math.round(STRIP_H * HEIGHTS_FRAC[i % HEIGHTS_FRAC.length]);
              const offset = [0, -16, 8, -8, 12][i % 5];
              return (
                <div
                  key={img.key}
                  className="relative flex-shrink-0 overflow-hidden group/card cursor-pointer"
                  style={{ width: `${cardW}px`, height: `${cardH}px`, marginTop: `${offset}px` }}
                  onClick={() => onImageClick(i)}
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={img.caption || `${title} ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-[1.8s]
                                 ease-[cubic-bezier(0.16,1,0.3,1)]
                                 group-hover/card:scale-[1.06]"
                      sizes={`${cardW}px`}
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#2a1f14]" />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20
                                  transition-colors duration-700" />

                  <div className="absolute top-4 left-4 opacity-0 group-hover/card:opacity-100
                                  transition-opacity duration-500 delay-100">
                    <span className="text-white/60 text-[9px] tracking-[0.4em] font-sans uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-4
                                  translate-y-full group-hover/card:translate-y-0
                                  transition-transform duration-500 ease-out
                                  bg-gradient-to-t from-black/75 via-black/30 to-transparent">
                    <div className="flex items-end justify-between">
                      {img.caption && (
                        <p className="text-white/80 text-[11px] font-body tracking-wide leading-snug">
                          {img.caption}
                        </p>
                      )}
                      <div className="ml-auto flex-shrink-0 w-8 h-8 rounded-full
                                      bg-white/10 backdrop-blur-md border border-white/20
                                      flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 ring-0 group-hover/card:ring-1
                                  ring-[#b49a6e]/30 transition-all duration-700 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CUSTOM SCROLLBAR ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 lg:px-20 pt-6 pb-2">
        <div
          ref={trackRef}
          className="relative h-[3px] bg-[#2a1f14]/10 rounded-full cursor-pointer group/bar"
        >
          {/* Glow track on hover */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover/bar:opacity-100
                          transition-opacity duration-300 bg-[#b49a6e]/10" />
          {/* Thumb */}
          <div
            ref={thumbRef}
            className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full
                       bg-gradient-to-r from-[#b49a6e]/60 via-[#b49a6e] to-[#b49a6e]/60
                       hover:h-[5px] transition-all duration-200 cursor-grab active:cursor-grabbing
                       shadow-[0_0_8px_rgba(180,154,110,0.4)]"
            style={{ width: '48px' }}
          />
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 pt-4 pb-16 lg:pb-20
                      flex items-center justify-between">
        <p className="text-[#2a1f14]/25 text-[9px] tracking-[0.35em] uppercase font-sans">
          Click any photograph to view full size
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-px bg-[#b49a6e]/30" />
          <div className="w-1 h-1 rounded-full bg-[#b49a6e]/40" />
          <div className="w-4 h-px bg-[#b49a6e]/20" />
        </div>
      </div>

    </section>
  );
}
