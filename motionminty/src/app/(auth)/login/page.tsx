'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Mock auth — in production wire to NextAuth signIn()
    await new Promise(r => setTimeout(r, 1200));
    if (email && password) {
      router.push('/dashboard');
    } else {
      setError('Please enter your email and password.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeIn 0.4s ease' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Auto Creator</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>AI CONTENT FACTORY</div>
            </div>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>Sign in to your content factory</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, color: 'var(--red-400)', fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ fontSize: 12, color: 'var(--purple-400)' }}>Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: 4 }} disabled={loading}>
              {loading ? <><span className="animate-spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />  Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          <button className="btn btn-secondary w-full" style={{ justifyContent: 'center', padding: 12 }} onClick={() => router.push('/dashboard')}>
            <span style={{ fontSize: 16 }}>🔵</span> Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--purple-400)', fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0d0b1a 0%, #0a1628 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative glow */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, background: 'var(--purple-glow)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 200, height: 200, background: 'var(--blue-glow)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>⚡</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
            <span className="gradient-text">One Topic.</span><br />Complete Content Package.
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
            Set your niche once and let AI research, create, and publish content to YouTube, Instagram, TikTok and Facebook — automatically, every day.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['🔬 AI researches topics daily','🎬 Generates full videos automatically','📱 Creates Shorts & Reels','🖼️ Makes branded carousels','🚀 Publishes to all platforms'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 16 }}>{item.split(' ')[0]}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
