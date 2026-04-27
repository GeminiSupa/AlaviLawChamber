'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Marquee() {
  const [updates, setUpdates] = useState<string[]>([
    'Legal Excellence in Islamabad since 1998',
    'Advocates for the High Court & Supreme Court',
    'Professional Integrity & Client Commitment'
  ]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Custom News Ticker
      const { data: newsData } = await supabase.from('news_ticker').select('content');
      const newsItems = (newsData || []).map(n => n.content);

      // Fetch Latest Blogs
      const { data: blogsData } = await supabase.from('blogs').select('title').limit(3);
      const blogTitles = (blogsData || []).map(b => `INSIGHT: ${b.title}`);
      
      setUpdates([...newsItems, ...blogTitles, 'Alavi Law Chamber - Professional Legal Excellence']);
    };
    fetchData();
  }, []);

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {/* Render twice for seamless loop */}
        {[...updates, ...updates].map((text, i) => (
          <div key={i} className="marquee-item">
            <span className="marquee-dot" />
            {text}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .marquee-container {
          background: #000;
          border-top: 1px solid rgba(197, 160, 89, 0.3);
          border-bottom: 1px solid rgba(197, 160, 89, 0.3);
          padding: 16px 0;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          z-index: 5;
        }
        .marquee-content {
          display: inline-flex;
          animation: marqueeScroll 60s linear infinite;
        }
        .marquee-item {
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--white);
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-right: 60px;
        }
        .marquee-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent);
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
