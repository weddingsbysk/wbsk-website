'use client';

import { useState, useRef, useEffect } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ctx: any;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Label
        gsap.fromTo(el.querySelector('.contact-label'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true } }
        );

        // Heading
        gsap.fromTo(el.querySelector('.contact-heading'),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 75%', once: true }, delay: 0.1 }
        );

        // Subtext
        gsap.fromTo(el.querySelector('.contact-sub'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 73%', once: true }, delay: 0.2 }
        );

        // Form fields stagger
        const fields = el.querySelectorAll('.form-field');
        gsap.fromTo(fields,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 68%', once: true }, delay: 0.3 }
        );

        // Submit button
        gsap.fromTo(el.querySelector('.contact-submit'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 60%', once: true }, delay: 0.6 }
        );
      }, el);
    };

    loadGsap();

    return () => ctx?.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-28 lg:py-40 bg-espresso-900 text-cream-50 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-gold-500/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center">
          <p className="contact-label text-[10px] tracking-[0.4em] uppercase text-gold-400 font-sans mb-5">
            Get in Touch
          </p>
          <h2 className="contact-heading font-display text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.1]">
            Let&apos;s Create Something
            <br />
            <span className="italic text-gold-400">Beautiful</span> Together
          </h2>
          <p className="contact-sub mt-5 text-cream-200/50 font-body text-lg lg:text-xl">
            Ready to preserve your special moments? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-16 space-y-8">
          <div className="form-field">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-cream-200/35 font-sans mb-3">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-b border-cream-200/15 py-4 text-cream-50 font-body text-lg focus:outline-none focus:border-gold-400 transition-colors duration-500 placeholder:text-cream-200/15"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-field">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-cream-200/35 font-sans mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-transparent border-b border-cream-200/15 py-4 text-cream-50 font-body text-lg focus:outline-none focus:border-gold-400 transition-colors duration-500 placeholder:text-cream-200/15"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-field">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-cream-200/35 font-sans mb-3">
              Your Message
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-transparent border-b border-cream-200/15 py-4 text-cream-50 font-body text-lg focus:outline-none focus:border-gold-400 transition-colors duration-500 resize-none placeholder:text-cream-200/15"
              placeholder="Tell us about your wedding..."
            />
          </div>

          <div className="contact-submit pt-6">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-5 bg-gold-500 text-espresso-900 font-sans text-[12px] tracking-[0.3em] uppercase font-medium hover:bg-gold-400 active:scale-[0.98] transition-all duration-500 disabled:opacity-50"
            >
              {status === 'sending'
                ? 'Sending...'
                : status === 'sent'
                ? 'Message Sent Successfully'
                : 'Send Message'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-400/80 text-sm text-center font-sans">
              Something went wrong. Please try again or email us directly.
            </p>
          )}
          {status === 'sent' && (
            <p className="text-gold-400 text-sm text-center font-sans tracking-wide">
              Thank you! We&apos;ll get back to you within 24 hours.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
