'use client';
import Link from 'next/link';
import { useState } from 'react';

const features = [
  { icon: '🔬', title: 'AI Topic Research', desc: 'Automatically finds trending topics in your niche daily' },
  { icon: '📝', title: 'Script Generation', desc: 'Gemini AI writes engaging scripts tailored to your audience' },
  { icon: '🎬', title: 'Video Generation', desc: 'AI creates full videos with voiceover, visuals & captions' },
  { icon: '🖼️', title: 'Carousel Creation', desc: 'Auto-generates branded image carousels from the same topic' },
  { icon: '📱', title: 'Shorts & Reels', desc: 'Converts long-form content into viral short-form videos' },
  { icon: '🚀', title: 'Auto Publishing', desc: 'Schedules and publishes to all platforms automatically' },
];

const plans = [
  { name: 'Free', price: '0', videos: '5', color: 'var(--text-secondary)', popular: false },
  { name: 'Creator', price: '29', videos: '30', color: 'var(--purple-400)', popular: false },
  { name: 'Pro', price: '79', videos: '100', color: 'var(--blue-400)', popular: true },
  { name: 'Business', price: '199', videos: 'Unlimited', color: 'var(--green-400)', popular: false },
];

const pipeline = ['Topic Research','Script Generation','Voice Generation','Video Generation','Carousel Creation','Short/Reel Generation','Thumbnail Generation','Auto Publishing'];

export default function LandingPage() {
  const [activePipeline, setActivePipeline] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', background: 'rgba(8,10,15,0.9)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1 }}>Auto Creator</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>AI CONTENT FACTORY</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 80px', textAlign: 'center', maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.6s ease' }}>
        <div className="badge badge-purple" style={{ marginBottom: 24, fontSize: 12 }}>✨ AI Content Automation Platform</div>
        <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
          <span>One Topic.</span><br />
          <span className="gradient-text">Complete Content Package.</span><br />
          <span>Auto Published.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Set up your niche once. Auto Creator researches topics, creates videos, carousels, shorts, and social posts — then publishes them to all your platforms automatically.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary btn-xl" style={{ fontSize: 16 }}>🚀 Start Free Today</Link>
          <Link href="/dashboard" className="btn btn-secondary btn-xl" style={{ fontSize: 16 }}>View Dashboard →</Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>No credit card required · 5 free videos/month</p>
      </section>

      {/* Pipeline Demo */}
      <section style={{ padding: '60px 32px', maxWidth: 900, margin: '0 auto' }}>
        <div className="card" style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>The Automation Pipeline</h2>
            <p style={{ color: 'var(--text-muted)' }}>Click any step to see what happens automatically</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {pipeline.map((step, i) => (
              <button key={i} onClick={() => setActivePipeline(i)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', border: `1px solid ${activePipeline === i ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: activePipeline === i ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', color: activePipeline === i ? 'var(--purple-300)' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontWeight: activePipeline === i ? 600 : 400 }}>
                {i + 1}. {step}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{['🔬','📝','🎙️','🎬','🖼️','📱','🖼️','🚀'][activePipeline]}</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{pipeline[activePipeline]}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{['AI scans trending topics in your niche using real-time data','Gemini writes engaging scripts with hooks, transitions & CTAs','Converts script to natural voiceover with your chosen AI voice','Generates full video with scenes, transitions & branding','Creates a branded carousel from the same research & script','Cuts the best moments into 30-60s vertical video','Creates click-worthy thumbnail with AI or templates','Uploads & schedules across YouTube, Instagram, Facebook & TikTok'][activePipeline]}</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Everything You Need to Dominate Content</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Simple, Transparent Pricing</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48 }}>Scale as you grow. Cancel anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {plans.map((p) => (
            <div key={p.name} className="card" style={{ textAlign: 'center', position: 'relative', ...(p.popular ? { border: '1px solid var(--purple-600)', boxShadow: 'var(--shadow-purple)' } : {}) }}>
              {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--purple-600)', color: '#fff', fontSize: 11, padding: '2px 12px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>MOST POPULAR</div>}
              <div style={{ color: p.color, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 4 }}>${p.price}<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>{p.videos} videos/month</div>
              <Link href="/register" className="btn btn-primary w-full" style={{ justifyContent: 'center', ...(p.popular ? {} : { background: 'var(--bg-input)', boxShadow: 'none', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }) }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-primary)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>⚡ Auto Creator</div>
        <p>AI Content Factory · Set it once, publish everywhere</p>
        <p style={{ marginTop: 8 }}>© 2026 Auto Creator. All rights reserved.</p>
      </footer>
    </div>
  );
}
