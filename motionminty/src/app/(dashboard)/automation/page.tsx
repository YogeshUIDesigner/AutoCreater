'use client';
import { useState } from 'react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', icon: '👍' },
];
const CONTENT_TYPES = [
  { id: 'long_video', icon: '🎬', label: 'Long Video' },
  { id: 'short', icon: '📱', label: 'Short/Reel' },
  { id: 'carousel', icon: '🖼️', label: 'Carousel' },
  { id: 'post', icon: '📝', label: 'Social Post' },
];

const PIPELINE_STEPS = [
  { icon: '🔬', label: 'Research Topic' },
  { icon: '📋', label: 'Content Planning' },
  { icon: '📝', label: 'Script Generation' },
  { icon: '🎙️', label: 'Voice Generation' },
  { icon: '🎬', label: 'Video Generation' },
  { icon: '🖼️', label: 'Carousel Generation' },
  { icon: '📱', label: 'Short/Reel Generation' },
  { icon: '🖼️', label: 'Thumbnail Generation' },
  { icon: '✅', label: 'Quality Check' },
  { icon: '🚀', label: 'Publishing' },
];

export default function AutomationPage() {
  const [automationOn, setAutomationOn] = useState(true);
  const [config, setConfig] = useState({
    niche: 'AI & Technology', language: 'English',
    frequency: '1', postingTime: '09:00',
    days: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    contentTypes: ['long_video','short','carousel','post'],
    platforms: ['youtube','instagram'],
    topic_source: 'ai_research',
    quality_check: true, auto_retry: true,
  });

  function toggle<K extends keyof typeof config>(key: K, val: string) {
    const arr = config[key] as string[];
    setConfig(p => ({ ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease', maxWidth: 1000 }}>
      {/* Master toggle */}
      <div className="card" style={{ border: automationOn ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.2)', background: automationOn ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className={`status-dot ${automationOn ? 'active' : 'idle'}`} />
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Automation Engine</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {automationOn ? 'Automation is running. AI will research, create, and publish content automatically.' : 'Automation is paused. No content will be generated or published.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: automationOn ? 'var(--green-400)' : 'var(--text-muted)' }}>{automationOn ? 'ON' : 'OFF'}</span>
            <label className="toggle toggle-lg" style={{ width: 56, height: 30 }}>
              <input type="checkbox" checked={automationOn} onChange={e => setAutomationOn(e.target.checked)} />
              <span className="toggle-slider" style={{ borderRadius: 'var(--radius-full)' }} />
            </label>
          </div>
        </div>

        {automationOn && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(34,197,94,0.2)', display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>NEXT RUN</div>
              <div style={{ fontWeight: 700, color: 'var(--green-400)' }}>Today at {config.postingTime}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>CONTENT/DAY</div>
              <div style={{ fontWeight: 700 }}>{config.frequency}x package</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>ACTIVE DAYS</div>
              <div style={{ fontWeight: 700 }}>{config.days.length}/7 days</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>PLATFORMS</div>
              <div style={{ fontWeight: 700 }}>{config.platforms.length} connected</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Niche & Language */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Content Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Niche</label>
                <input className="form-input" value={config.niche} onChange={e => setConfig(p => ({ ...p, niche: e.target.value }))} placeholder="e.g. AI & Technology" />
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-input form-select" value={config.language} onChange={e => setConfig(p => ({ ...p, language: e.target.value }))}>
                  {['English','Hindi','Spanish','French','Portuguese','Arabic','German'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Topic source</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  {[['ai_research','🔬 AI Auto-Research'],['trending','📈 Trending Topics'],['manual','📝 Manual Topics']].map(([id, label]) => (
                    <button key={id} onClick={() => setConfig(p => ({ ...p, topic_source: id }))} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${config.topic_source === id ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: config.topic_source === id ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', color: config.topic_source === id ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content types */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Content Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
              {CONTENT_TYPES.map(ct => {
                const sel = config.contentTypes.includes(ct.id);
                return (
                  <button key={ct.id} onClick={() => toggle('contentTypes', ct.id)} style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                    <span>{ct.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? 'var(--purple-300)' : 'var(--text-secondary)' }}>{ct.label}</span>
                    {sel && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--purple-400)' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platforms */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Target Platforms</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
              {PLATFORMS.map(p => {
                const sel = config.platforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggle('platforms', p.id)} style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? 'var(--purple-300)' : 'var(--text-secondary)' }}>{p.label}</span>
                    {sel && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--purple-400)' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Content packages per day</label>
                <select className="form-input form-select" value={config.frequency} onChange={e => setConfig(p => ({ ...p, frequency: e.target.value }))}>
                  <option value="1">1 per day</option>
                  <option value="2">2 per day</option>
                  <option value="3">3 per day</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Posting time</label>
                <input className="form-input" type="time" value={config.postingTime} onChange={e => setConfig(p => ({ ...p, postingTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Active days</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {DAYS.map(d => {
                  const sel = config.days.includes(d);
                  return (
                    <button key={d} onClick={() => toggle('days', d)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', color: sel ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontWeight: sel ? 600 : 400 }}>
                      {d.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Automation options */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Automation Options</h3>
            {[
              { key: 'quality_check', label: 'Quality Check before publishing', desc: 'AI reviews content for issues before it goes live' },
              { key: 'auto_retry', label: 'Auto-retry failed jobs', desc: 'Automatically retry jobs that fail up to 3 times' },
            ].map(opt => (
              <div key={opt.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={config[opt.key as keyof typeof config] as boolean} onChange={e => setConfig(p => ({ ...p, [opt.key]: e.target.checked }))} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>💾 Save Configuration</button>
        </div>

        {/* Pipeline preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Automation Pipeline</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Each day this sequence runs automatically</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PIPELINE_STEPS.map((step, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{step.icon}</div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{step.label}</span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && <div style={{ marginLeft: 13, width: 1, height: 12, background: 'var(--border-primary)' }} />}
                </div>
              ))}
            </div>

            {automationOn && (
              <div style={{ marginTop: 20, padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.3)', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--green-400)', fontSize: 14, marginBottom: 4 }}>✅ Automation is Active</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Next run: Today at {config.postingTime}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
