'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/onboarding');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeIn 0.4s ease' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Auto Creator</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>AI CONTENT FACTORY</div>
            </div>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>Start your AI content journey today — free</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: 12, marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span><div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          <button className="btn btn-secondary w-full" style={{ justifyContent: 'center', padding: 12 }} onClick={() => router.push('/onboarding')}>
            <span style={{ fontSize: 16 }}>🔵</span> Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
            By signing up, you agree to our <a href="#" style={{ color: 'var(--purple-400)' }}>Terms</a> and <a href="#" style={{ color: 'var(--purple-400)' }}>Privacy Policy</a>
          </p>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--purple-400)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0a0b1a 0%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, background: 'rgba(59,130,246,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🎯</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>What you get on Day 1</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {['✅ 5 free AI videos per month','✅ Automated topic research','✅ Script + voiceover generation','✅ Image carousel creation','✅ Shorts & Reels auto-generation','✅ Schedule & publish to platforms','✅ Analytics dashboard','✅ No credit card required'].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
