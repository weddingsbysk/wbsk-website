'use client';

import { useEffect, useRef } from 'react';
import ExportedImage from 'next-image-export-optimizer';

interface CaptureCategory {
  description: string;
  image?: string;
}

interface Props {
  candid?: CaptureCategory;
  portrait?: CaptureCategory;
  traditional?: CaptureCategory;
}

const CATEGORIES = [
  { key: 'candid'      as const, label: 'Candid Photos' },
  { key: 'portrait'    as const, label: 'Portrait' },
  { key: 'traditional' as const, label: 'Traditional' },
];

export default function WhatWeCapture({ candid, portrait, traditional }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const data = { candid, portrait, traditional };

  useEffect(() => {
    if (!candid && !portrait && !traditional) return;
    const animate = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      const cols = sectionRef.current?.querySelectorAll('.capture-col');
      if (!cols?.length) return;
      gsap.fromTo(cols,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );
    };
    animate();
  }, [candid, portrait, traditional]);

  if (!candid && !portrait && !traditional) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0e0c0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-gold-400/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.45em] uppercase text-gold-400/65 font-sans mb-4">Portfolio</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cream-50">What We Capture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {CATEGORIES.map(({ key, label }) => {
            const cat = data[key];
            return (
              <div key={key} className="capture-col">
                <div className="mb-5 pb-3 border-b border-espresso-700/50">
                  <h3 className="text-cream-50 font-sans text-sm tracking-[0.2em] uppercase font-medium underline underline-offset-4 decoration-gold-400/50">
                    {label}
                  </h3>
                </div>
                <p className="text-cream-200/45 font-body text-sm leading-relaxed mb-6">
                  {cat?.description ?? '—'}
                </p>
                <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '1/1' }}>
                  {cat?.image ? (
                    <ExportedImage src={cat.image} alt={label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-black" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
