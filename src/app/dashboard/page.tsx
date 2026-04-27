'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    team: 0,
    blogs: 0,
    submissions: 0,
    testimonials: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [team, blogs, subs, testi] = await Promise.all([
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('public_testimonials').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        team: team.count || 0,
        blogs: blogs.count || 0,
        submissions: subs.count || 0,
        testimonials: testi.count || 0
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the Alavi Law Chamber administrative portal.</p>
      </header>

      <div className="stats-cards">
        <div className="admin-card">
          <div className="card-val">{stats.team}</div>
          <div className="card-lbl">Team Members</div>
        </div>
        <div className="admin-card">
          <div className="card-val">{stats.blogs}</div>
          <div className="card-lbl">Blog Posts</div>
        </div>
        <div className="admin-card">
          <div className="card-val">{stats.submissions}</div>
          <div className="card-lbl">Contact Submissions</div>
        </div>
        <div className="admin-card">
          <div className="card-val">{stats.testimonials}</div>
          <div className="card-lbl">Active Testimonials</div>
        </div>
      </div>

      <div className="quick-actions mt-5">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <a href="/dashboard/blogs" className="action-item">
            <span className="icon">✍️</span>
            <span>Write a Blog Post</span>
          </a>
          <a href="/dashboard/team" className="action-item">
            <span className="icon">👨‍⚖️</span>
            <span>Add Team Member</span>
          </a>
          <a href="/dashboard/gallery" className="action-item">
            <span className="icon">🖼️</span>
            <span>Upload to Gallery</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .page-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .page-header p { color: var(--text-light); }
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }
        .admin-card {
          background: var(--white);
          padding: 30px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .card-val {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 5px;
        }
        .card-lbl {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
        }
        .mt-5 { margin-top: 60px; }
        h2 { font-size: 1.3rem; margin-bottom: 25px; }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .action-item {
          background: var(--white);
          padding: 24px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.2s;
        }
        .action-item:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .action-item .icon { font-size: 1.6rem; }
        .action-item span:last-child { font-weight: 500; font-size: 1rem; }
      `}</style>
    </div>
  );
}
