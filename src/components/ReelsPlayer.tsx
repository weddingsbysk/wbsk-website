'use client';

import { useEffect, useRef, useState } from 'react';

interface Reel {
  embedUrl: string;
  title: string;
}

interface Props {
  reels: Reel[];
}

function ytCommand(iframe: HTMLIFrameElement, func: string) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*'
  );
}

// ── Empty-state phone placeholder ─────────────────────────────────────────────
function ReelsPlaceholder() {
  return (
    <div className="relative flex-shrink-0" style={{ width: '320px', height: '568px' }}>
      {/* Outer glow ring */}
      <div className="absolute -inset-px rounded-[2.25rem] bg-gradient-to-b from-white/6 to-white/2 pointer-events-none z-10" />
      <div className="absolute inset-0 rounded-[2.25rem] ring-1 ring-white/10 pointer-events-none z-10" />

      {/* Phone body */}
      <div className="w-full h-full rounded-[2.25rem] bg-[#0f0d0b] overflow-hidden flex flex-col items-center justify-center gap-5">
        {/* Animated play ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full border border-gold-400/20 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="relative w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <svg className="w-6 h-6 text-cream-200/40 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center px-8">
          <p className="text-cream-200/50 text-sm font-display font-semibold mb-2">Reels Coming Soon</p>
          <p className="text-cream-200/25 text-xs font-body leading-relaxed">
            Short-form wedding films will be added here
          </p>
        </div>

        {/* Fake progress dots */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`rounded-full bg-white/15 ${i === 0 ? 'w-4 h-1' : 'w-1 h-1'}`} />
          ))}
        </div>
      </div>

      {/* Fake notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full bg-white/8 z-20" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ReelsPlayer({ reels }: Props) {
  const [isMuted, setIsMuted]     = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef  = useRef<HTMLDivElement>(null);
  const iframeRefs    = useRef<(HTMLIFrameElement | null)[]>([]);
  const reelRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef    = useRef<HTMLElement>(null);

  // Section entrance animation
  useEffect(() => {
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo('.reels-content',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
    };
    animate();
  }, []);

  // IntersectionObserver: play/pause based on visibility
  useEffect(() => {
    if (reels.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          const iframe = iframeRefs.current[idx];
          if (!iframe) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            ytCommand(iframe, 'playVideo');
            setActiveIndex(idx);
          } else {
            ytCommand(iframe, 'pauseVideo');
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );
    reelRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [reels.length]);

  // Sync mute to active reel
  useEffect(() => {
    const iframe = iframeRefs.current[activeIndex];
    if (!iframe) return;
    ytCommand(iframe, isMuted ? 'mute' : 'unMute');
  }, [isMuted, activeIndex]);

  const scrollToReel = (index: number) => {
    reelRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const go = (dir: 'up' | 'down') => {
    const next = dir === 'down'
      ? (activeIndex + 1) % reels.length
      : (activeIndex - 1 + reels.length) % reels.length;
    scrollToReel(next);
  };

  return (
    <section ref={sectionRef} className="pt-24 pb-28 lg:pt-32 lg:pb-36 bg-[#080706] relative overflow-hidden">

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-gold-400/25 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-gold-400/10 to-transparent" />

      {/* Ambient glow behind phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-400/3 blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}
        <div className="reels-content text-center mb-14">
          <p className="text-[10px] tracking-[0.45em] uppercase text-gold-400/60 font-sans mb-4">Reels</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream-50 leading-[1.1]">
            Wedding Reels
          </h2>
          <p className="text-cream-200/28 font-body text-base mt-4 italic">
            Moments in motion
          </p>
        </div>

        {/* Player row */}
        <div className="reels-content flex items-center justify-center gap-8 lg:gap-12">

          {/* Prev arrow */}
          {reels.length > 1 && (
            <button
              onClick={() => go('up')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-cream-50/35 hover:text-cream-50 hover:bg-white/8 hover:border-white/18 transition-all duration-400"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Phone frame */}
          {reels.length === 0 ? (
            <ReelsPlaceholder />
          ) : (
            <div className="relative flex-shrink-0" style={{ width: '320px', height: '568px' }}>
              {/* Frame layers */}
              <div className="absolute -inset-px rounded-[2.25rem] bg-gradient-to-b from-white/8 to-white/2 pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-[2.25rem] ring-1 ring-white/12 pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-[2.25rem] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none z-20" />

              {/* Scrollable reels */}
              <div
                ref={containerRef}
                className="w-full h-full overflow-y-scroll rounded-[2.25rem] bg-black"
                style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
                data-lenis-prevent
              >
                {reels.map((reel, i) => (
                  <div
                    key={i}
                    ref={el => { reelRefs.current[i] = el; }}
                    data-idx={i}
                    className="relative bg-black"
                    style={{ width: '320px', height: '568px', scrollSnapAlign: 'start', flexShrink: 0 }}
                  >
                    <iframe
                      ref={el => { iframeRefs.current[i] = el; }}
                      src={reel.embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={reel.title || `Reel ${i + 1}`}
                      className="absolute inset-0 w-full h-full border-0"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
                    {reel.title && (
                      <div className="absolute bottom-5 left-4 right-12 pointer-events-none z-10">
                        <p className="text-cream-50/75 text-sm font-body leading-snug">{reel.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(m => !m)}
                className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-black/55 backdrop-blur-md border border-white/12 flex items-center justify-center text-cream-50/60 hover:text-cream-50 hover:bg-black/75 transition-all duration-300"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Side dots */}
              {reels.length > 1 && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
                  {reels.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToReel(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIndex ? 'h-5 w-1 bg-gold-400' : 'h-1 w-1 bg-white/22 hover:bg-white/45'
                      }`}
                      aria-label={`Reel ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full bg-white/8 z-30 pointer-events-none" />
            </div>
          )}

          {/* Next arrow */}
          {reels.length > 1 && (
            <button
              onClick={() => go('down')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-cream-50/35 hover:text-cream-50 hover:bg-white/8 hover:border-white/18 transition-all duration-400"
              aria-label="Next"
            >
              <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Counter / add hint */}
        <div className="reels-content text-center mt-10">
          {reels.length > 1 ? (
            <p className="text-cream-200/18 text-[10px] tracking-[0.35em] uppercase font-sans">
              {String(activeIndex + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')}
            </p>
          ) : reels.length === 0 ? (
            <p className="text-cream-200/18 text-[10px] tracking-[0.3em] uppercase font-sans">
              Add reel URLs in siteData.ts to populate
            </p>
          ) : null}
        </div>

      </div>
    </section>
  );
}
