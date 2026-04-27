'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
        <style jsx>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--primary);
            color: var(--white);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-main" style={{ fontSize: '1.2rem' }}>ELLAVI</div>
          <div className="logo-sub">ADMIN PANEL</div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="nav-label">Management</span>
            <a href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard Overview</a>
            <a href="/dashboard/team" className={`nav-item ${pathname === '/dashboard/team' ? 'active' : ''}`}>Lawyer Profiles</a>
            <a href="/dashboard/expertise" className={`nav-item ${pathname === '/dashboard/expertise' ? 'active' : ''}`}>Practice Areas</a>
            <a href="/dashboard/blogs" className={`nav-item ${pathname === '/dashboard/blogs' ? 'active' : ''}`}>Legal Blogs</a>
            <a href="/dashboard/news" className={`nav-item ${pathname === '/dashboard/news' ? 'active' : ''}`}>News Ticker</a>
            <a href="/dashboard/gallery" className={`nav-item ${pathname === '/dashboard/gallery' ? 'active' : ''}`}>Picture Gallery</a>
            <a href="/dashboard/testimonials" className={`nav-item ${pathname === '/dashboard/testimonials' ? 'active' : ''}`}>Testimonials</a>
          </div>

          <div className="nav-group">
            <span className="nav-label">Website Control</span>
            <a href="/dashboard/settings" className={`nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>Site Customizer</a>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-email">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #fdfdfd;
        }
        .sidebar {
          width: 260px;
          background: var(--primary);
          color: var(--white);
          display: flex;
          flex-direction: column;
          padding: 30px 0;
          position: fixed;
          height: 100vh;
        }
        .sidebar-header {
          padding: 0 30px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-nav {
          flex: 1;
          padding: 40px 0;
        }
        .nav-group {
          margin-bottom: 30px;
        }
        .nav-label {
          display: block;
          padding: 0 30px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 15px;
        }
        .nav-item {
          display: block;
          padding: 12px 30px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
        }
        .nav-item:hover, .nav-item.active {
          color: var(--accent);
          background: rgba(255,255,255,0.03);
          border-left: 3px solid var(--accent);
        }
        .sidebar-footer {
          padding: 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .user-email {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 15px;
        }
        .logout-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--white);
          padding: 8px 16px;
          font-size: 0.75rem;
          cursor: pointer;
          width: 100%;
          text-align: center;
        }
        .logout-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--accent);
        }
        .dashboard-content {
          flex: 1;
          margin-left: 260px;
          padding: 60px;
          min-width: 900px;
        }
      `}</style>
    </div>
  );
}
