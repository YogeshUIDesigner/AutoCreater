'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const STATS = [
  { label: "Today's Content", value: '3', icon: '📦', color: 'var(--purple-400)', change: '+3', up: true },
  { label: 'Videos Generated', value: '127', icon: '🎬', color: 'var(--blue-400)', change: '+12', up: true },
  { label: 'Carousels', value: '89', icon: '🖼️', color: 'var(--green-400)', change: '+7', up: true },
  { label: 'Shorts Generated', value: '241', icon: '📱', color: 'var(--orange-400)', change: '+18', up: true },
  { label: 'Published', value: '312', icon: '✅', color: 'var(--green-400)', change: '+5', up: true },
  { label: 'Scheduled', value: '24', icon: '📅', color: 'var(--orange-400)', change: '+2', up: true },
  { label: 'Total Views', value: '2.4M', icon: '👁️', color: 'var(--blue-400)', change: '+18%', up: true },
  { label: 'Engagement', value: '8.3%', icon: '❤️', color: 'var(--red-400)', change: '-0.2%', up: false },
  { label: 'Subscribers', value: '14.2K', icon: '👥', color: 'var(--purple-400)', change: '+340', up: true },
];

const PIPELINE_STEPS = [
  { name: 'Topic Research', icon: '🔬', status: 'done' },
  { name: 'Content Planning', icon: '📋', status: 'done' },
  { name: 'Script Generation', icon: '📝', status: 'done' },
  { name: 'Voice Generation', icon: '🎙️', status: 'active' },
  { name: 'Video Generation', icon: '🎬', status: 'queued' },
  { name: 'Carousel Generation', icon: '🖼️', status: 'queued' },
  { name: 'Short/Reel Generation', icon: '📱', status: 'queued' },
  { name: 'Thumbnail Generation', icon: '🖼️', status: 'queued' },
  { name: 'Social Publishing', icon: '🚀', status: 'queued' },
];

const UPCOMING = [
  { title: '5 AI Tools That Replace Employees', time: '9:00 AM', type: 'Video', platform: '▶️ YouTube', color: '#ff4444' },
  { title: '5 AI Tools That Replace Employees', time: '9:15 AM', type: 'Carousel', platform: '📸 Instagram', color: '#e1306c' },
  { title: '5 AI Tools That Replace Employees', time: '9:30 AM', type: 'Short', platform: '🎵 TikTok', color: '#ffffff' },
  { title: 'ChatGPT vs Gemini 2026', time: '3:00 PM', type: 'Video', platform: '▶️ YouTube', color: '#ff4444' },
];

const RECENT = [
  { title: 'How AI is Changing Education', views: '12.4K', likes: '890', platform: '▶️', time: '2h ago', status: 'published' },
  { title: '10 ChatGPT Prompts for Productivity', views: '8.1K', likes: '612', platform: '📸', time: '5h ago', status: 'published' },
  { title: 'AI Voice Generators Compared 2026', views: '23.7K', likes: '1.8K', platform: '▶️', time: '1d ago', status: 'published' },
];

const PLATFORMS_STATUS = [
  { name: 'YouTube', icon: '▶️', connected: true, handle: '@AutoCreator', color: '#ff4444' },
  { name: 'Instagram', icon: '📸', connected: true, handle: '@autocreator_ai', color: '#e1306c' },
  { name: 'TikTok', icon: '🎵', connected: false, handle: '', color: '#ffffff' },
  { name: 'Facebook', icon: '👍', connected: false, handle: '', color: '#1877f2' },
];

export default function DashboardPage() {
  const [time, setTime] = useState(new Date());
  const [automationOn] = useState(true);
  const [activeStep, setActiveStep] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    // Simulate pipeline progress
    const p = setInterval(() => setActiveStep(s => (s + 1) % PIPELINE_STEPS.length), 3000);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  const nextRun = new Date(time);
  nextRun.setHours(21, 0, 0, 0);
  if (nextRun < time) nextRun.setDate(nextRun.getDate() + 1);
  const diff = nextRun.getTime() - time.getTime();
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 50}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span className={`stat-change ${s.up ? 'up' : 'down'}`}>{s.change}</span>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Main left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Automation card */}
          <div className="card" style={{ border: automationOn ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border-primary)', background: automationOn ? 'rgba(34,197,94,0.03)' : 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`status-dot ${automationOn ? 'active' : 'idle'}`} />
                  <h2 style={{ fontSize: 17, fontWeight: 700 }}>Automation Pipeline</h2>
                  <span className={`badge ${automationOn ? 'badge-green' : 'badge-gray'}`}>{automationOn ? 'RUNNING' : 'STOPPED'}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                  {automationOn ? `Next run in ${hrs}h ${mins}m` : 'Automation is paused'}
                </p>
              </div>
              <Link href="/automation" className="btn btn-secondary btn-sm">Configure →</Link>
            </div>

            {/* Pipeline steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {PIPELINE_STEPS.map((step, i) => {
                const isDone = i < activeStep;
                const isActive = i === activeStep;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                      <div className={`pipeline-icon ${isDone ? 'done' : isActive ? 'active' : 'queued'}`}>
                        <span style={{ fontSize: 13 }}>{step.icon}</span>
                      </div>
                      <span style={{ fontSize: 13, flex: 1, color: isDone ? 'var(--text-primary)' : isActive ? 'var(--purple-300)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>
                        {step.name}
                      </span>
                      {isDone && <span className="badge badge-green" style={{ fontSize: 9 }}>Done</span>}
                      {isActive && (
                        <span className="badge badge-purple" style={{ fontSize: 9 }}>
                          <span className="animate-spin" style={{ display: 'inline-block', width: 8, height: 8, border: '1px solid rgba(167,139,250,0.3)', borderTopColor: 'var(--purple-400)', borderRadius: '50%' }} /> Processing
                        </span>
                      )}
                      {!isDone && !isActive && <span className="badge badge-gray" style={{ fontSize: 9 }}>Queued</span>}
                    </div>
                    {i < PIPELINE_STEPS.length - 1 && (
                      <div style={{ marginLeft: 15, width: 1, height: 12, background: isDone ? 'var(--green-500)' : 'var(--border-primary)' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current topic */}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CURRENT TOPIC</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>5 AI Tools That Replace Employees in 2026</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Progress</span><span>45%</span>
                </div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: '45%' }} /></div>
              </div>
            </div>
          </div>

          {/* Upcoming content */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Upcoming Content</h2>
              <Link href="/queue" style={{ fontSize: 12, color: 'var(--purple-400)' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {UPCOMING.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {item.type === 'Video' ? '🎬' : item.type === 'Carousel' ? '🖼️' : '📱'}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.platform} · {item.time}</div>
                  </div>
                  <span className="badge badge-orange" style={{ fontSize: 9, flexShrink: 0 }}>{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent published */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recently Published</h2>
              <Link href="/published" style={{ fontSize: 12, color: 'var(--purple-400)' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RECENT.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                  <div style={{ width: 52, height: 36, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.platform} · {item.views} views · {item.likes} likes · {item.time}</div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: 9 }}>Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Connected platforms */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>Connected Platforms</h3>
              <Link href="/channels" style={{ fontSize: 11, color: 'var(--purple-400)' }}>Manage →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLATFORMS_STATUS.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.connected ? p.handle : 'Not connected'}</div>
                  </div>
                  {p.connected ? <span className="badge badge-green" style={{ fontSize: 9 }}>Connected</span> : <Link href="/channels" className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '3px 8px' }}>Connect</Link>}
                </div>
              ))}
            </div>
          </div>

          {/* Failed jobs */}
          <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--red-400)' }}>⚠ Failed Jobs (2)</h3>
              <button style={{ fontSize: 11, color: 'var(--purple-400)', background: 'none', border: 'none', cursor: 'pointer' }}>Retry All</button>
            </div>
            {[
              { title: 'TikTok Publishing', reason: 'Auth token expired', time: '1h ago' },
              { title: 'Video Rendering', reason: 'GPU timeout', time: '3h ago' },
            ].map((j, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.1)', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--red-400)' }}>{j.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{j.reason} · {j.time}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/create" className="btn btn-primary" style={{ justifyContent: 'center' }}>✦ Create Content Now</Link>
              <Link href="/automation" className="btn btn-secondary" style={{ justifyContent: 'center' }}>⚙ Configure Automation</Link>
              <Link href="/analytics" className="btn btn-secondary" style={{ justifyContent: 'center' }}>↗ View Analytics</Link>
            </div>
          </div>

          {/* Today's schedule */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Today&apos;s Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['9:00 AM · YouTube Video','9:15 AM · Instagram Carousel','9:30 AM · TikTok Short','3:00 PM · YouTube Video','3:15 PM · Instagram Reel'].map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-600)', flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
