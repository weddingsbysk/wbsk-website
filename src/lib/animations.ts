'use client';

import { useEffect, useRef } from 'react';

export function useMouseParallax(intensity: number = 0.02) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if ('ontouchstart' in window) return;

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity;
      const y = (e.clientY - window.innerHeight / 2) * intensity;
      el.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [intensity]);

  return ref;
}
