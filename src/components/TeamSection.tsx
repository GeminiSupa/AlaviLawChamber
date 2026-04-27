'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TeamSection() {
  const [team, setTeam] = useState<any[]>([]);
  const [activeMember, setActiveMember] = useState<any>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('TeamSection DB Error:', error);
      }
      if (data) {
        console.log('TeamSection Loaded:', data.length, 'members');
        setTeam(data);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="team-section section-padding bg-light">
      <div className="container">
        <div className="section-header text-center reveal">
          <span className="section-eyebrow">Our Experts</span>
          <h2 className="section-title">The Legal Team</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Leading practitioners with specialized expertise in the legal landscape of Pakistan.
          </p>
        </div>

        {team.length === 0 ? (
          <div className="empty-state text-center reveal">
            <p>Gathering our legal experts...</p>
          </div>
        ) : (
          <div className="team-grid">
            {team.map((member, i) => (
              <div 
                key={member.id} 
                className={`team-card reveal delay-${(i % 3) + 1}`}
                onClick={() => setActiveMember(member)}
              >
                <div className="team-image-wrap">
                  <img 
                    src={member.image_url || 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2670&auto=format&fit=crop'} 
                    alt={member.name} 
                    className="team-img"
                  />
                  <div className="team-overlay">
                  <div className="view-profile">View Profile</div>
                </div>
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-divider"></div>
                <div className="team-bio-short">{member.bio || 'Dedicated legal professional committed to excellence and justice.'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Member Modal */}
    {activeMember && (
      <div className="team-modal-overlay" onClick={() => setActiveMember(null)}>
        <div className="team-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActiveMember(null)}>
            <i className="fa-solid fa-xmark" />
          </button>
          <div className="modal-inner">
            <div className="modal-image">
              <img src={activeMember.image_url} alt={activeMember.name} />
            </div>
            <div className="modal-details">
              <span className="modal-badge">{activeMember.role}</span>
              <h2>{activeMember.name}</h2>
              <div className="modal-social-links">
                {activeMember.linkedin_url ? (
                  <a href={activeMember.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-linkedin" /> LinkedIn Profile
                  </a>
                ) : (
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>LinkedIn profile not linked</span>
                )}
              </div>
              <div className="modal-bio-full">
                <h4>Biography</h4>
                <p>{activeMember.bio || 'Professional legal advocate with years of experience handling specialized cases in Islamabad.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </section>
  );
}
