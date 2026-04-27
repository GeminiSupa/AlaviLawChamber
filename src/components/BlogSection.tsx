'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      console.log('BlogSection: Fetched data:', data);
      if (error) console.error('BlogSection: Fetch error:', error);
      
      if (data) setBlogs(data);
    };
    fetchBlogs();
  }, []);

  if (blogs.length === 0) return (
    <section id="blogs" className="blog-section section-padding">
      <div className="container text-center">
        <p>Expert legal insights coming soon...</p>
      </div>
    </section>
  );

  return (
    <section id="blogs" className="blog-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Legal Insights</span>
          <h2 className="section-title">Latest From Our Chamber</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Stay updated with the latest legal developments and expert commentary 
            from Alavi Law Chamber.
          </p>
        </div>

        <div className="blog-grid">
          {blogs.map((blog, i) => (
            <div key={blog.id} className={`blog-card reveal delay-${(i % 3) + 1}`}>
              <div className="blog-image">
                <img src={blog.cover_image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop'} alt={blog.title} />
                <div className="blog-category">LEGAL INSIGHT</div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-author"><i className="fa-regular fa-user" /> {blog.author_name}</span>
                  <span className="m-dot"></span>
                  <span className="blog-date-inline">{new Date(blog.published_at || blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt || 'Insightful legal commentary on the latest developments in Pakistani law.'}</p>
                <div className="blog-footer">
                  <Link href={`/blog/${blog.slug}`} className="read-more">
                    <span>Read Article</span> <i className="fa-solid fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }
        .blog-card {
          background: var(--white);
          border: 1px solid var(--border);
          transition: transform 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo);
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent);
        }
        .blog-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease-out-expo);
        }
        .blog-card:hover .blog-image img { transform: scale(1.1); }
        .blog-category {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(197, 160, 89, 0.9);
          backdrop-filter: blur(10px);
          color: var(--white);
          padding: 6px 14px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 2px;
          z-index: 2;
        }
        .blog-content { padding: 40px; }
        .blog-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 0.72rem;
          color: var(--accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .m-dot { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; opacity: 0.5; }
        .blog-content h3 { font-size: 1.4rem; margin-bottom: 18px; line-height: 1.4; color: var(--primary); }
        .blog-content p { color: var(--text-light); font-size: 1rem; line-height: 1.7; margin-bottom: 30px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-footer { padding-top: 25px; border-top: 1px solid var(--border); }
        .read-more {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
        }
        .read-more:hover { color: var(--accent); gap: 18px; }
        .read-more span { border-bottom: 1.5px solid transparent; transition: border-color 0.3s; }
        .read-more:hover span { border-color: var(--accent); }
      `}</style>
    </section>
  );
}
