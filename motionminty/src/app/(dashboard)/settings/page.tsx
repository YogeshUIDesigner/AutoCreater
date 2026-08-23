'use client';
import { useState } from 'react';

const TABS = ['Account','Brand','AI Providers','Voice','Video','Carousel','Notifications','API Keys'];

export default function SettingsPage() {
  const [tab, setTab] = useState('Account');
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabContent: Record<string, React.ReactNode> = {
    'Account': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Account Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" defaultValue="John Creator" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" defaultValue="john@autocreator.ai" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select className="form-input form-select" defaultValue="Asia/Kolkata">
            {['Asia/Kolkata','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris'].map(tz => <option key={tz}>{tz}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" placeholder="Leave blank to keep current" />
        </div>
        <div style={{ padding: '14px', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontWeight: 600, color: 'var(--red-400)', marginBottom: 4 }}>Danger Zone</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Delete your account and all associated data</div>
          <button className="btn btn-danger btn-sm">Delete Account</button>
        </div>
      </div>
    ),
    'Brand': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Brand Settings</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>These settings apply to all generated content — videos, carousels, thumbnails.</p>
        <div className="form-group">
          <label className="form-label">Brand Name</label>
          <input className="form-input" defaultValue="Auto Creator" />
        </div>
        <div className="form-group">
          <label className="form-label">Logo (URL or upload)</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="form-input" placeholder="https://..." style={{ flex: 1 }} />
            <button className="btn btn-secondary">Upload</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Primary Color</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" defaultValue="#7c3aed" style={{ width: 48, height: 40, border: 'none', background: 'none', cursor: 'pointer' }} />
              <input className="form-input" defaultValue="#7c3aed" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Secondary Color</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" defaultValue="#3b82f6" style={{ width: 48, height: 40, border: 'none', background: 'none', cursor: 'pointer' }} />
              <input className="form-input" defaultValue="#3b82f6" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Primary Font</label>
          <select className="form-input form-select" defaultValue="Inter">
            {['Inter','Roboto','Poppins','Montserrat','Playfair Display','Space Grotesk'].map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Watermark text</label>
          <input className="form-input" defaultValue="@AutoCreator" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Intro video URL</label>
            <input className="form-input" placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Outro video URL</label>
            <input className="form-input" placeholder="https://..." />
          </div>
        </div>
      </div>
    ),
    'AI Providers': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Provider Configuration</h3>
        <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 13, color: 'var(--purple-300)' }}>
          ⚡ Mock Mode is currently enabled. Set MOCK_PROVIDERS=false in .env.local to use real APIs.
        </div>
        {[
          { label: 'Text/Research AI', provider: 'Google Gemini', status: 'configured', icon: '🧠' },
          { label: 'Video Generation', provider: 'Google Veo 3.1', status: 'mock', icon: '🎬' },
          { label: 'Image Generation', provider: 'Google Imagen', status: 'mock', icon: '🖼️' },
          { label: 'Voice/TTS', provider: 'ElevenLabs', status: 'mock', icon: '🎙️' },
          { label: 'Storage', provider: 'AWS S3', status: 'not_configured', icon: '☁️' },
        ].map(p => (
          <div key={p.label} className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.label}</div>
              <div style={{ fontWeight: 600 }}>{p.provider}</div>
            </div>
            <span className={`badge ${p.status === 'configured' ? 'badge-green' : p.status === 'mock' ? 'badge-orange' : 'badge-red'}`}>
              {p.status === 'configured' ? 'Active' : p.status === 'mock' ? 'Mock' : 'Not Set'}
            </span>
          </div>
        ))}
      </div>
    ),
    'Voice': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Voice Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Voice Provider</label>
            <select className="form-input form-select">
              <option>ElevenLabs</option><option>Google TTS</option><option>Mock</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Default Voice</label>
            <select className="form-input form-select">
              {['Alloy (Natural)','Nova (Female)','Onyx (Male)','Shimmer (Warm)'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Speed</label>
            <input className="form-input" type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Pitch</label>
            <input className="form-input" type="range" min="-12" max="12" step="1" defaultValue="0" />
          </div>
        </div>
      </div>
    ),
    'Video': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Video Defaults</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group"><label className="form-label">Default Duration</label><select className="form-input form-select"><option>10 minutes</option><option>5 minutes</option><option>15 minutes</option></select></div>
          <div className="form-group"><label className="form-label">Default Resolution</label><select className="form-input form-select"><option>1080p</option><option>4K</option><option>720p</option></select></div>
          <div className="form-group"><label className="form-label">Default Style</label><select className="form-input form-select"><option>Cinematic Dark</option><option>Modern Minimal</option><option>Corporate</option></select></div>
          <div className="form-group"><label className="form-label">Background Music</label><select className="form-input form-select"><option>Cinematic</option><option>None</option><option>Upbeat</option></select></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {['Auto-generate captions','Add watermark','Include intro/outro','Optimize for mobile'].map(opt => (
            <div key={opt} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-secondary)' }}>
              <span style={{ fontSize: 14 }}>{opt}</span>
              <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
            </div>
          ))}
        </div>
      </div>
    ),
    'Carousel': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Carousel Defaults</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group"><label className="form-label">Default slides</label><select className="form-input form-select">{['4','5','6','7','8','9','10'].map(n=><option key={n}>{n}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Default ratio</label><select className="form-input form-select"><option>1:1 Square</option><option>4:5 Portrait</option><option>9:16 Story</option></select></div>
          <div className="form-group"><label className="form-label">Design style</label><select className="form-input form-select"><option>Modern</option><option>Minimal</option><option>Bold</option></select></div>
          <div className="form-group"><label className="form-label">Image style</label><select className="form-input form-select"><option>Photorealistic</option><option>Illustration</option><option>Flat</option></select></div>
        </div>
      </div>
    ),
    'Notifications': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notification Preferences</h3>
        {[
          { label: 'Video completed', desc: 'When a video has finished generating' },
          { label: 'Carousel completed', desc: 'When a carousel has finished generating' },
          { label: 'Content published', desc: 'When content is successfully published' },
          { label: 'Generation failed', desc: 'When a job fails to complete' },
          { label: 'Publishing failed', desc: 'When publishing to a platform fails' },
          { label: 'Credits running low', desc: 'When you have < 10% credits remaining' },
          { label: 'Automation stopped', desc: 'When automation is auto-disabled due to errors' },
        ].map(n => (
          <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-secondary)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
            </div>
            <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
          </div>
        ))}
      </div>
    ),
    'API Keys': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>API Keys</h3>
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: 'var(--red-400)' }}>
          ⚠ These are server-side environment variables. Set them in your .env.local file, not here in production.
        </div>
        {[
          { label: 'Gemini API Key', env: 'GEMINI_API_KEY', set: false },
          { label: 'ElevenLabs API Key', env: 'ELEVENLABS_API_KEY', set: false },
          { label: 'YouTube Client ID', env: 'YOUTUBE_CLIENT_ID', set: false },
          { label: 'Instagram Client ID', env: 'INSTAGRAM_CLIENT_ID', set: false },
          { label: 'Stripe Secret Key', env: 'STRIPE_SECRET_KEY', set: false },
        ].map(k => (
          <div key={k.env} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{k.env}</div>
            </div>
            <span className={`badge ${k.set ? 'badge-green' : 'badge-red'}`}>{k.set ? 'Set' : 'Not Set'}</span>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div style={{ display: 'flex', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      {/* Sidebar tabs */}
      <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${tab === t ? 'var(--purple-600)' : 'transparent'}`, background: tab === t ? 'rgba(124,58,237,0.15)' : 'transparent', color: tab === t ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: 'pointer', textAlign: 'left' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 700 }}>
        <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
          {tabContent[tab]}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 10 }}>
          <button className="btn btn-secondary">Reset</button>
          <button className="btn btn-primary" onClick={save}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
