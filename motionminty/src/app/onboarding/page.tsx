'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { label: 'Niche', icon: '🎯' },
  { label: 'Language', icon: '🌐' },
  { label: 'Content', icon: '📦' },
  { label: 'Channels', icon: '📡' },
  { label: 'Voice', icon: '🎙️' },
  { label: 'Style', icon: '🎨' },
  { label: 'Schedule', icon: '📅' },
  { label: 'Review', icon: '✅' },
];

const NICHES = ['AI & Technology','Business & Finance','Health & Fitness','Education','Entertainment','Gaming','Fashion & Beauty','Food & Cooking','Travel','Personal Development','Marketing','Real Estate'];
const LANGUAGES = ['English','Hindi','Spanish','French','Portuguese','Arabic','German','Japanese','Korean','Indonesian'];
const VOICES = ['Alloy (Natural)','Nova (Female)','Onyx (Male)','Shimmer (Warm)','Echo (Deep)','Fable (Friendly)'];
const STYLES = ['Modern Minimal','Corporate Clean','Vibrant Bold','Dark Cinematic','Pastel Soft','Neon Futuristic'];
const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: '#ff4444' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#e1306c' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#ffffff' },
  { id: 'facebook', label: 'Facebook', icon: '👍', color: '#1877f2' },
];
const CONTENT_TYPES = [
  { id: 'long_video', label: 'Long Video', icon: '🎬', desc: '5-15 min YouTube' },
  { id: 'short', label: 'Short/Reel', icon: '📱', desc: '15-60s vertical' },
  { id: 'carousel', label: 'Carousel', icon: '🖼️', desc: '4-10 slides' },
  { id: 'post', label: 'Social Post', icon: '📝', desc: 'Text + image' },
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    niche: '', customNiche: '', language: 'English',
    contentTypes: ['long_video', 'short', 'carousel'],
    platforms: ['youtube', 'instagram'],
    voice: VOICES[0], style: STYLES[0],
    frequency: '1', postingTime: '09:00', days: ['Mon','Tue','Wed','Thu','Fri'],
    automationOn: true,
  });

  function toggle<K extends keyof typeof data>(key: K, val: string) {
    const arr = data[key] as string[];
    setData(p => ({ ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  }

  function next() { if (step < STEPS.length - 1) setStep(s => s + 1); }
  function back() { setStep(s => s - 1); }

  async function finish() {
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  }

  const stepContent = [
    // Step 0: Niche
    <div key="niche" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>What&apos;s your niche?</h2>
      <p style={{ color: 'var(--text-muted)' }}>Choose the main topic area for your content</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
        {NICHES.map(n => (
          <button key={n} onClick={() => setData(p => ({ ...p, niche: n }))} style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: `1px solid ${data.niche === n ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: data.niche === n ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', color: data.niche === n ? 'var(--purple-300)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: data.niche === n ? 600 : 400, transition: 'all 0.2s', fontSize: 13 }}>
            {n}
          </button>
        ))}
      </div>
      <div className="form-group" style={{ marginTop: 8 }}>
        <label className="form-label">Or type your own niche</label>
        <input className="form-input" placeholder="e.g. Cryptocurrency Trading" value={data.customNiche} onChange={e => setData(p => ({ ...p, customNiche: e.target.value, niche: e.target.value }))} />
      </div>
    </div>,

    // Step 1: Language
    <div key="lang" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Content Language</h2>
      <p style={{ color: 'var(--text-muted)' }}>All scripts, voiceovers and captions will be in this language</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
        {LANGUAGES.map(l => (
          <button key={l} onClick={() => setData(p => ({ ...p, language: l }))} style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: `1px solid ${data.language === l ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: data.language === l ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', color: data.language === l ? 'var(--purple-300)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: data.language === l ? 600 : 400, transition: 'all 0.2s', fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Content types
    <div key="content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>What content should AI create?</h2>
      <p style={{ color: 'var(--text-muted)' }}>Select all types you want generated from each topic</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
        {CONTENT_TYPES.map(ct => {
          const sel = data.contentTypes.includes(ct.id);
          return (
            <button key={ct.id} onClick={() => toggle('contentTypes', ct.id)} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{ct.icon}</div>
              <div style={{ fontWeight: 600, color: sel ? 'var(--purple-300)' : 'var(--text-primary)' }}>{ct.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{ct.desc}</div>
              {sel && <div style={{ marginTop: 8 }} className="badge badge-purple">Selected</div>}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 3: Platforms
    <div key="platforms" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Connect your platforms</h2>
      <p style={{ color: 'var(--text-muted)' }}>You can connect accounts later in Settings → Channels</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
        {PLATFORMS.map(p => {
          const sel = data.platforms.includes(p.id);
          return (
            <button key={p.id} onClick={() => toggle('platforms', p.id)} style={{ padding: '20px 16px', borderRadius: 'var(--radius-lg)', border: `1px solid ${sel ? p.color : 'var(--border-primary)'}`, background: sel ? `${p.color}18` : 'var(--bg-input)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontWeight: 600, color: sel ? p.color : 'var(--text-secondary)' }}>{p.label}</div>
              {sel && <div style={{ marginTop: 8, fontSize: 11, color: p.color }}>✓ Selected</div>}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 4: Voice
    <div key="voice" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Choose your AI voice</h2>
      <p style={{ color: 'var(--text-muted)' }}>This voice will be used for all video voiceovers</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VOICES.map(v => {
          const sel = data.voice === v;
          return (
            <button key={v} onClick={() => setData(p => ({ ...p, voice: v }))} style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span style={{ fontWeight: sel ? 600 : 400, color: sel ? 'var(--purple-300)' : 'var(--text-secondary)' }}>🎙️ {v}</span>
              {sel && <span style={{ fontSize: 11 }} className="badge badge-purple">Active</span>}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 5: Style
    <div key="style" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Visual style</h2>
      <p style={{ color: 'var(--text-muted)' }}>This will apply to all videos, carousels and thumbnails</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
        {STYLES.map(s => {
          const sel = data.style === s;
          return (
            <button key={s} onClick={() => setData(p => ({ ...p, style: s }))} style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ fontWeight: sel ? 600 : 400, color: sel ? 'var(--purple-300)' : 'var(--text-secondary)', fontSize: 13 }}>{s}</div>
            </button>
          );
        })}
      </div>
    </div>,

    // Step 6: Schedule
    <div key="schedule" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Posting schedule</h2>
      <p style={{ color: 'var(--text-muted)' }}>When should AI publish content?</p>
      <div className="form-group">
        <label className="form-label">Content per day</label>
        <select className="form-input form-select" value={data.frequency} onChange={e => setData(p => ({ ...p, frequency: e.target.value }))}>
          <option value="1">1 content package per day</option>
          <option value="2">2 content packages per day</option>
          <option value="3">3 content packages per day</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Posting time</label>
        <input className="form-input" type="time" value={data.postingTime} onChange={e => setData(p => ({ ...p, postingTime: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Active days</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {DAYS.map(d => {
            const sel = data.days.includes(d);
            return (
              <button key={d} onClick={() => toggle('days', d)} style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', color: sel ? 'var(--purple-300)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: sel ? 700 : 400, fontSize: 12 }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>,

    // Step 7: Review
    <div key="review" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>You&apos;re all set! 🎉</h2>
      <p style={{ color: 'var(--text-muted)' }}>Here&apos;s your automation summary</p>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'Niche', value: data.niche || 'Not set' },
          { label: 'Language', value: data.language },
          { label: 'Content types', value: data.contentTypes.map(t => CONTENT_TYPES.find(c=>c.id===t)?.label).join(', ') },
          { label: 'Platforms', value: data.platforms.map(p => PLATFORMS.find(x=>x.id===p)?.label).join(', ') },
          { label: 'Voice', value: data.voice },
          { label: 'Visual style', value: data.style },
          { label: 'Frequency', value: `${data.frequency}x per day` },
          { label: 'Posting time', value: data.postingTime },
          { label: 'Active days', value: data.days.join(', ') },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-secondary)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{row.label}</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--purple-300)' }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <span style={{ fontSize: 24 }}>🤖</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--green-400)' }}>Automation will be turned ON</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI will start researching and creating content immediately</div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Auto Creator Setup</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--purple-600)' : 'var(--border-primary)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          {stepContent[step]}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={back} disabled={step === 0} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>← Back</button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={next}>Continue →</button>
          ) : (
            <button className="btn btn-primary" onClick={finish} style={{ background: 'linear-gradient(135deg,var(--green-500),var(--blue-500))', boxShadow: '0 4px 20px var(--green-glow)' }}>
              🚀 Launch My Content Factory
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
