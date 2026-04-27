'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GallerySection() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Visuals</span>
          <h2 className="section-title">Chamber Gallery</h2>
          <div className="divider" />
          <p className="section-subtitle">
            A glimpse inside Alavi Law Chamber and our professional environment.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state text-center reveal">
            <p>Our gallery is currently being curated...</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map((item, i) => (
              <div 
                key={item.id} 
                className={`gallery-card reveal delay-${(i % 4) + 1}`}
                onClick={() => setSelectedImage(item.image_url)}
              >
                <img src={item.image_url} alt={item.title || 'Chamber Gallery'} />
                <div className="gallery-overlay">
                  <div className="zoom-icon"><i className="fa-solid fa-expand" /></div>
                  <h3>{item.title || 'Legal Workspace'}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Zoom View */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close"><i className="fa-solid fa-xmark" /></button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Premium View" />
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 50px;
        }
        .gallery-card {
          position: relative;
          height: 350px;
          overflow: hidden;
          cursor: pointer;
          background: #000;
        }
        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-out-expo);
        }
        .gallery-card:hover img { transform: scale(1.15) rotate(1deg); opacity: 0.6; }
        
        .gallery-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.4s var(--ease-out-expo);
          padding: 30px;
          color: white;
          text-align: center;
          background: linear-gradient(to top, rgba(1, 22, 39, 0.8), transparent);
        }
        .gallery-card:hover .gallery-overlay { opacity: 1; }
        
        .zoom-icon {
          width: 50px;
          height: 50px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          font-size: 1.2rem;
          transform: scale(0.8);
          transition: 0.4s var(--ease-out-expo);
        }
        .gallery-card:hover .zoom-icon { transform: scale(1); border-color: var(--accent); color: var(--accent); }
        .gallery-overlay h3 { font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(15px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: fadeIn 0.4s ease;
        }
        .lightbox-content { max-width: 90vw; max-height: 90vh; }
        .lightbox-content img { max-width: 100%; max-height: 90vh; box-shadow: 0 0 100px rgba(0,0,0,0.5); }
        .lightbox-close { position: absolute; top: 30px; right: 30px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; opacity: 0.7; }
        .lightbox-close:hover { opacity: 1; transform: scale(1.1); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .gallery-card { height: 200px; }
        }
      `}</style>
    </section>
  );
}
