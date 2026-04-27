'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Banner() {
  const ref = useRef<HTMLElement>(null);
  const [bg, setBg] = useState('/assets/law_pillar.png');

  useEffect(() => {
    const fetchBg = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'banner_bg').single();
      if (data?.value) setBg(data.value);
    };
    fetchBg();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.2 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
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
      className="banner"
      style={{ backgroundImage: `url('${bg}')` }}
      ref={ref}
    >
      <div className="banner-overlay" />
      <div className="banner-content container">
        <div className="reveal-scale">
          <span className="section-eyebrow" style={{ color: 'var(--accent)' }}>Ready When You Are</span>
          <h2>
            Committed to the <em>pursuit of truth.</em>
          </h2>
          <p>Our attorneys are standing by to evaluate your case — confidentially.</p>
          <a
            href="#contact"
            className="btn-primary mt-4"
            style={{ display: 'inline-block' }}
            onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
          >
            Schedule Confidential Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
