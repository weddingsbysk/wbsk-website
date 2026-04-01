'use client';

import { useEffect, useRef } from 'react';

interface AboutProps {
  heading?: string;
  paragraphs?: string[];
  backgroundImage?: string;
}

const DEFAULT_HEADING = 'About Weddings by Siddhant Kapoor';
const DEFAULT_PARAGRAPHS = [
  "Hi, I'm Siddhant Kapoor, a passionate wedding photographer dedicated to capturing the magic of your special day. With years of experience in wedding photography, I specialize in creating timeless, elegant imagery that reflects the unique love story of each couple I work with.",
  'From intimate ceremonies to grand celebrations, I believe every wedding is unique and deserves to be captured with artistic vision and attention to detail. Let me help you preserve the authentic emotions, beautiful moments, and precious memories that make your wedding day truly unforgettable.',
];

export default function About({
  heading,
  paragraphs,
  backgroundImage,
}: AboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const h = heading || DEFAULT_HEADING;
  const p = paragraphs?.length ? paragraphs : DEFAULT_PARAGRAPHS;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ctx: any;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Parallax background
        const bg = el.querySelector('.about-bg-img');
        if (bg) {
          gsap.to(bg, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        }

        // Decorative line
        gsap.fromTo(el.querySelector('.about-divider'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 75%', once: true } }
        );

        // Heading
        gsap.fromTo(el.querySelector('.about-heading'),
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 75%', once: true } }
        );

        // Paragraphs stagger
        const paras = el.querySelectorAll('.about-paragraph');
        gsap.fromTo(paras,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 70%', once: true }, delay: 0.3 }
        );

        // CTA button
        gsap.fromTo(el.querySelector('.about-cta'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 65%', once: true }, delay: 0.6 }
        );
      }, el);
    };

    loadGsap();

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 lg:py-44 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="about-bg-img absolute inset-[-10%] bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : `linear-gradient(135deg, #EDE0C4 0%, #FAF6ED 50%, #EDE0C4 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-cream-50/88 backdrop-blur-[2px]" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #1A130C 0.5px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Small label */}
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold-500 font-sans mb-6">
          Our Story
        </p>

        <h2 className="about-heading font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-espresso-800 leading-tight">
          {h}
        </h2>

        <div className="about-divider w-16 h-[2px] bg-gold-500 mx-auto mt-8 mb-10 origin-center" />

        <div className="space-y-7">
          {p.map((para, i) => (
            <p key={i} className="about-paragraph text-espresso-500/90 font-body text-lg lg:text-xl leading-[1.8]">
              {para}
            </p>
          ))}
        </div>

        <div className="about-cta mt-14 flex justify-center">
          <a href="#contact" className="btn-primary">
            <span>Get in Touch</span>
          </a>
        </div>
      </div>
    </section>
  );
}
