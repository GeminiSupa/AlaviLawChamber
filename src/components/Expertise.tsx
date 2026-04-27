'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Expertise() {
  const [services, setServices] = useState<any[]>([]);
  const [activeExpertise, setActiveExpertise] = useState<any>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('display_order', { ascending: true });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <section id="expertise" className="expertise section-padding">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Services</span>
          <h2 className="section-title">Areas of Expertise</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Comprehensive legal solutions tailored to your specific needs in a complex legal landscape.
          </p>
        </div>

        <div className="services-grid">
          {Array.isArray(services) && services.map((item, i) => (
            <div 
              key={item.id} 
              className={`service-card reveal delay-${(i % 3) + 1}`}
              onClick={() => setActiveExpertise(item)}
            >
              <div className="service-card-front">
                <i className={`fa-solid ${item.icon || 'fa-scale-balanced'} service-icon`} />
                <h3>{item.title}</h3>
                <p>{item.short_desc}</p>
                <div className="card-explore">
                  Explore <i className="fa-solid fa-plus" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Detail Modal */}
      {activeExpertise && (
        <div className="expertise-modal-overlay" onClick={() => setActiveExpertise(null)}>
          <div className="expertise-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveExpertise(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="modal-header">
              <i className={`fa-solid ${activeExpertise.icon} modal-icon`} />
              <div>
                <span className="modal-eyebrow">Area of Focus</span>
                <h2>{activeExpertise.title}</h2>
              </div>
            </div>
            <div className="modal-content">
              <p className="modal-desc">{activeExpertise.full_desc || activeExpertise.short_desc}</p>
              <div className="modal-features">
                <h4>Key Specializations</h4>
                <ul>
                  {Array.isArray(activeExpertise.points) && activeExpertise.points.map((p: string, idx: number) => (
                    <li key={idx}>
                      <i className="fa-solid fa-check" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="btn-primary mt-4 w-100" onClick={() => setActiveExpertise(null)}>
                <span>Close Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 50px;
        }
        .service-card {
          background: var(--white);
          padding: 50px 40px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.4s var(--ease-out-expo);
          position: relative;
        }
        .service-card:hover {
          transform: translateY(-10px);
          border-color: var(--accent);
          box-shadow: var(--shadow-lg);
        }
        .service-icon {
          font-size: 2.2rem;
          color: var(--accent);
          margin-bottom: 24px;
        }
        .service-card h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
          color: var(--primary);
        }
        .service-card p {
          color: var(--text-light);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 25px;
        }
        .card-explore {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0.6;
          transition: opacity 0.3s;
        }
        .service-card:hover .card-explore { opacity: 1; }

        /* Modal Styles */
        .expertise-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 22, 39, 0.6);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .expertise-modal {
          background: var(--white);
          width: 100%;
          max-width: 600px;
          padding: 50px;
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          animation: slideUp 0.4s var(--ease-out-expo);
        }
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--primary);
          cursor: pointer;
          opacity: 0.5;
          transition: 0.3s;
        }
        .modal-close:hover { opacity: 1; transform: rotate(90deg); }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .modal-icon { font-size: 3rem; color: var(--accent); }
        .modal-eyebrow {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent);
          display: block;
          margin-bottom: 6px;
        }
        .modal-header h2 { font-size: 2rem; margin: 0; }
        .modal-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-light);
          margin-bottom: 35px;
        }
        .modal-features h4 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          color: var(--primary);
        }
        .modal-features ul {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .modal-features li {
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-main);
        }
        .modal-features i { color: var(--accent); font-size: 0.8rem; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 600px) {
          .expertise-modal { padding: 30px 24px; }
          .modal-features ul { grid-template-columns: 1fr; }
          .modal-header h2 { font-size: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
