'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="logo-main" style={{ color: 'var(--primary)', marginBottom: '10px' }}>ELLAVI</div>
          <div className="logo-sub">Chamber Admin</div>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div className="form-status error mb-3">{error}</div>}
          
          <div className="form-group mb-3">
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-100"
              style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              placeholder="admin@ellavilaw.pk"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-100"
              style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-100"
            disabled={loading}
            style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)' }}>
          Authorized access only. Back to <a href="/" style={{ color: 'var(--accent)' }}>Website</a>.
        </p>
      </div>
    </div>
  );
}
