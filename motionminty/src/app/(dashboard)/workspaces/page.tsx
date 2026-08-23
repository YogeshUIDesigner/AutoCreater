'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Channel {
  platform: string; icon: string; handle: string; connected: boolean;
}
interface Workspace {
  id: string; name: string; emoji: string; color: string;
  niche: string; description: string; language: string;
  channels: Channel[];
  automationOn: boolean;
  contentTypes: string[];
  stats: { videos: number; published: number; views: string };
  createdAt: string;
}

// ─── Mock initial workspaces ─────────────────────────────────────────────────
const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws_motivation',
    name: 'Motivation Hub',
    emoji: '💪',
    color: '#7c3aed',
    niche: 'Motivation & Self-Improvement',
    description: 'Daily motivational videos, quotes, and growth content',
    language: 'English',
    channels: [
      { platform: 'YouTube', icon: '▶️', handle: '@MotivationHub', connected: true },
      { platform: 'Instagram', icon: '📸', handle: '@motivationhub_ai', connected: true },
      { platform: 'TikTok', icon: '🎵', handle: '@motivationhub', connected: false },
    ],
    automationOn: true,
    contentTypes: ['long_video','short','carousel'],
    stats: { videos: 127, published: 312, views: '2.4M' },
    createdAt: 'Jul 12, 2026',
  },
  {
    id: 'ws_funny',
    name: 'Funny Clips',
    emoji: '😂',
    color: '#f97316',
    niche: 'Comedy & Entertainment',
    description: 'Short funny videos, memes, and entertainment content',
    language: 'Hindi',
    channels: [
      { platform: 'YouTube', icon: '▶️', handle: '@FunnyClipsAI', connected: true },
      { platform: 'Instagram', icon: '📸', handle: '@funnyclips_ai', connected: true },
    ],
    automationOn: false,
    contentTypes: ['short', 'post'],
    stats: { videos: 43, published: 89, views: '890K' },
    createdAt: 'Aug 3, 2026',
  },
  {
    id: 'ws_tech',
    name: 'Tech Reviews',
    emoji: '💻',
    color: '#3b82f6',
    niche: 'Technology & Gadgets',
    description: 'Latest tech news, reviews, and tutorials',
    language: 'English',
    channels: [
      { platform: 'YouTube', icon: '▶️', handle: '@TechReviewsAI', connected: false },
    ],
    automationOn: false,
    contentTypes: ['long_video','carousel'],
    stats: { videos: 12, published: 21, views: '145K' },
    createdAt: 'Aug 18, 2026',
  },
];

const CONTENT_TYPE_OPTIONS = [
  { id: 'long_video', icon: '🎬', label: 'Long Video' },
  { id: 'short', icon: '📱', label: 'Short/Reel' },
  { id: 'carousel', icon: '🖼️', label: 'Carousel' },
  { id: 'post', icon: '📝', label: 'Social Post' },
];

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', icon: '👍' },
];

const WORKSPACE_COLORS = [
  '#7c3aed','#3b82f6','#f97316','#22c55e','#ef4444',
  '#ec4899','#8b5cf6','#06b6d4','#eab308','#14b8a6',
];

const WORKSPACE_EMOJIS = ['💪','😂','💻','🎨','🍕','🎮','📚','🌍','🏆','🚀','💡','🎬','🧠','🎵','📈'];

// ─── Create Workspace Modal ───────────────────────────────────────────────────
function CreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (ws: Workspace) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', emoji: '🚀', color: WORKSPACE_COLORS[0],
    niche: '', description: '', language: 'English',
    contentTypes: ['long_video', 'short'] as string[],
    platforms: [] as string[],
  });

  function toggleArr(key: 'contentTypes' | 'platforms', val: string) {
    const arr = form[key];
    setForm(p => ({ ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  }

  function handleCreate() {
    const ws: Workspace = {
      id: `ws_${Date.now()}`,
      name: form.name || 'New Room',
      emoji: form.emoji,
      color: form.color,
      niche: form.niche,
      description: form.description,
      language: form.language,
      channels: form.platforms.map(pid => {
        const p = PLATFORMS.find(x => x.id === pid)!;
        return { platform: p.label, icon: p.icon, handle: '', connected: false };
      }),
      automationOn: false,
      contentTypes: form.contentTypes,
      stats: { videos: 0, published: 0, views: '0' },
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    onCreate(ws);
    onClose();
  }

  const steps = ['Name & Look', 'Content', 'Platforms'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-primary)', padding: '32px', width: 540, maxWidth: '95vw', animation: 'fadeIn 0.3s ease' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>🏠 Create New Room</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--purple-600)' : 'var(--border-primary)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Step {step + 1} of {steps.length}: {steps[step]}</div>

        {/* Step 0: Name & look */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.25s ease' }}>
            {/* Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: `${form.color}15`, borderRadius: 'var(--radius-lg)', border: `2px solid ${form.color}40` }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: form.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{form.emoji}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: form.color }}>{form.name || 'Room Name'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.niche || 'Your niche'}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Room Name *</label>
              <input className="form-input" placeholder="e.g. Motivation Hub, Funny Clips, Tech Reviews" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Niche / Topic</label>
              <input className="form-input" placeholder="e.g. AI & Technology, Motivation, Comedy" value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input className="form-input" placeholder="What kind of content will this room create?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-input form-select" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
                  {['English','Hindi','Spanish','French','Portuguese','Arabic','German'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Emoji picker */}
            <div className="form-group">
              <label className="form-label">Room Emoji</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {WORKSPACE_EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: `2px solid ${form.emoji === e ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: form.emoji === e ? 'rgba(124,58,237,0.2)' : 'var(--bg-input)', cursor: 'pointer', fontSize: 18 }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="form-group">
              <label className="form-label">Accent Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {WORKSPACE_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Content types */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>What types of content should this room generate?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CONTENT_TYPE_OPTIONS.map(ct => {
                const sel = form.contentTypes.includes(ct.id);
                return (
                  <button key={ct.id} onClick={() => toggleArr('contentTypes', ct.id)} style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: `2px solid ${sel ? form.color : 'var(--border-primary)'}`, background: sel ? `${form.color}15` : 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{ct.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: sel ? 700 : 400, color: sel ? form.color : 'var(--text-secondary)' }}>{ct.label}</span>
                    {sel && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Platforms */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Which social media accounts will this room publish to? You can connect them later.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PLATFORMS.map(p => {
                const sel = form.platforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggleArr('platforms', p.id)} style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: `2px solid ${sel ? form.color : 'var(--border-primary)'}`, background: sel ? `${form.color}15` : 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: sel ? 700 : 400, color: sel ? form.color : 'var(--text-secondary)' }}>{p.label}</span>
                    {sel && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button className="btn btn-secondary" onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.name.trim()}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleCreate} style={{ background: form.color, boxShadow: `0 4px 20px ${form.color}60` }}>
              🚀 Create Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Workspaces Page ─────────────────────────────────────────────────────
export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWs, setActiveWs] = useState<string>('ws_motivation');
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  const active = workspaces.find(w => w.id === activeWs) || workspaces[0];

  function handleCreate(ws: Workspace) {
    setWorkspaces(prev => [...prev, ws]);
    setActiveWs(ws.id);
  }

  function toggleAutomation(id: string) {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, automationOn: !w.automationOn } : w));
  }

  function deleteWorkspace(id: string) {
    const remaining = workspaces.filter(w => w.id !== id);
    setWorkspaces(remaining);
    if (activeWs === id && remaining.length > 0) setActiveWs(remaining[0].id);
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 100px)', animation: 'fadeIn 0.4s ease' }}>

      {/* ── Left: Room list ──────────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Your Rooms</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowCreate(true)}
            style={{ gap: 4 }}
          >
            + New
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1 }}>
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => setActiveWs(ws.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${activeWs === ws.id ? ws.color + '60' : 'var(--border-primary)'}`,
                background: activeWs === ws.id ? `${ws.color}15` : 'var(--bg-card)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: activeWs === ws.id ? `0 0 0 1px ${ws.color}40` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: ws.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {ws.emoji}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: activeWs === ws.id ? ws.color : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ws.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ws.niche}
                  </div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: ws.automationOn ? 'var(--green-500)' : 'var(--border-primary)', flexShrink: 0 }} />
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                <span>🎬 {ws.stats.videos}</span>
                <span>✅ {ws.stats.published}</span>
                <span>👁 {ws.stats.views}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Room detail ───────────────────────── */}
      {active && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Room header */}
          <div className="card" style={{ border: `1px solid ${active.color}40`, background: `${active.color}08` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                {active.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: active.color }}>{active.name}</h2>
                  <span className={`badge ${active.automationOn ? 'badge-green' : 'badge-gray'}`}>
                    {active.automationOn ? '● Live' : '○ Paused'}
                  </span>
                  <span className="badge badge-blue">{active.language}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{active.niche}</p>
                {active.description && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{active.description}</p>}
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Created {active.createdAt}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <label className="toggle toggle-lg">
                  <input type="checkbox" checked={active.automationOn} onChange={() => toggleAutomation(active.id)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${active.color}30` }}>
              {[
                { label: 'Videos Generated', val: active.stats.videos },
                { label: 'Published', val: active.stats.published },
                { label: 'Total Views', val: active.stats.views },
                { label: 'Channels', val: active.channels.filter(c => c.connected).length + ' connected' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: active.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected channels */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Room Channels</h3>
              <button className="btn btn-secondary btn-sm">+ Add Channel</button>
            </div>
            {active.channels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>
                No channels added yet. Add social media accounts for this room.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {active.channels.map((ch, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <span style={{ fontSize: 24 }}>{ch.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{ch.platform}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ch.connected ? ch.handle : 'Not connected'}</div>
                    </div>
                    {ch.connected
                      ? <span className="badge badge-green">✓ Connected</span>
                      : <button className="btn btn-primary btn-sm">Connect</button>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content types for this room */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Content This Room Creates</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CONTENT_TYPE_OPTIONS.map(ct => {
                const active_ct = active.contentTypes.includes(ct.id);
                return (
                  <div key={ct.id} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${active_ct ? active.color + '60' : 'var(--border-primary)'}`, background: active_ct ? `${active.color}15` : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{ct.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: active_ct ? 600 : 400, color: active_ct ? active.color : 'var(--text-muted)' }}>{ct.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Room Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => router.push('/create')} style={{ justifyContent: 'center' }}>
                ✦ Create Content
              </button>
              <button className="btn btn-secondary" onClick={() => router.push('/automation')} style={{ justifyContent: 'center' }}>
                ⚙ Automation
              </button>
              <button className="btn btn-secondary" onClick={() => router.push('/analytics')} style={{ justifyContent: 'center' }}>
                📊 Analytics
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                ✏️ Edit Room
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                📋 Duplicate Room
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteWorkspace(active.id)}
                style={{ justifyContent: 'center' }}
                disabled={workspaces.length === 1}
              >
                🗑 Delete Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
