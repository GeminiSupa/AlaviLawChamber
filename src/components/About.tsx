'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

const highlights = [
  'Recognized Top-Tier Litigation Firm',
  'Modern Hybrid Workspaces for Clients',
  'Seamless Digital Client Portals',
  'Multi-Court Jurisdiction Coverage',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [img, setImg] = useState('/assets/professional_portrait.png');
  const [title, setTitle] = useState('Our Legacy');
  const [story, setStory] = useState('Establishing an unyielding standard of legal excellence in the capital...');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const map = data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        if (map.about_image) setImg(map.about_image);
        if (map.about_title) setTitle(map.about_title);
        if (map.about_story) setStory(map.about_story);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-light" ref={sectionRef}>
      <div className="container">
        <div className="about-wrapper">
          {/* Image */}
          <div className="about-image-wrap reveal-left">
            <img
              src={img}
              alt="Senior Partner, Alavi Law Chamber Islamabad"
              className="about-img"
            />
            <div className="experience-badge">
              <span className="years">25+</span>
              <span className="badge-label">Years of Excellence</span>
            </div>
          </div>

          {/* Content */}
          <div className="about-content reveal-right">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title">{title}</h2>
            <div className="divider left" />

            <div className="about-narrative" style={{ whiteSpace: 'pre-line' }}>
              <p>{story}</p>
            </div>

            <ul className="about-list">
              {highlights.map((item, i) => (
                <li key={i} className={`about-list-item reveal delay-${i + 1}`}>
                  <span className="about-check">
                    <i className="fa-solid fa-check" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
