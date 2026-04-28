'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Hero() {
  const [bg, setBg] = useState('/assets/hero_background.png');

  useEffect(() => {
    const fetchBg = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_bg').single();
      if (data?.value) setBg(data.value);
    };
    fetchBg();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const nav = document.querySelector('.navbar') as HTMLElement;
      const offset = nav?.offsetHeight ?? 80;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="hero"
      style={{ backgroundImage: `url('${bg}')` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-logo-wrap hero-anim-1">
          <img src="/Ellavi_logo.png" alt="Ellavi Logo" className="logo-img" />
        </div>

        <div className="hero-eyebrow hero-anim-1" style={{ animationDelay: '0.3s' }}>Islamabad&apos;s Premier Legal Chamber</div>

        <h1 className="hero-anim-2">
          Justice with <em>Integrity</em>
        </h1>

        <p className="hero-anim-3">
          Premier legal representation in Islamabad, built on a foundation of trust,
          excellence, and unwavering commitment to our clients.
        </p>

        <div className="hero-buttons hero-anim-4">
          <a
            href="#expertise"
            className="btn-outline"
            onClick={e => { e.preventDefault(); scrollTo('#expertise'); }}
          >
            Our Practice Areas
          </a>
          <a
            href="#contact"
            className="btn-primary"
            onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
          >
            Speak to an Attorney
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
