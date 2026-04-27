'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('public_testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback to initial data if DB is empty
        setTestimonials([
          { text: 'Ellavi Law Chamber resolved our corporate dispute in record time.', name: 'Khalid Rahman', role: 'CEO, Rahman Industries', initial: 'K', stars: 5 },
          { text: 'Outstanding litigation skills. Highly recommended.', name: 'Tariq Mehmood', role: 'Director, Mehmood Developers', initial: 'T', stars: 5 }
        ]);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-scale');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Track active dot based on scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cardW = track.scrollWidth / testimonials.length;
      setActiveIdx(Math.round(track.scrollLeft / cardW));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cardW = track.scrollWidth / testimonials.length;
    track.scrollTo({ left: cardW * idx, behavior: 'smooth' });
    setActiveIdx(idx);
  };

  return (
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Client Voices</span>
          <h2 className="section-title light">What Our Clients Say</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Trusted by individuals, corporations, and public institutions across Pakistan.
          </p>
        </div>

        <div className="testimonials-track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {'★'.repeat(t.stars || 5)}
              </div>
              <span className="testimonial-quote">&ldquo;</span>
              <p className="testimonial-text">{t.testimonial || t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name ? t.name.charAt(0).toUpperCase() : t.initial || 'A'}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testi-nav">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testi-dot${activeIdx === i ? ' active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
