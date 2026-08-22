'use client';
import { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  QUEUED: 'badge-gray', RESEARCHING: 'badge-blue', SCRIPTING: 'badge-blue',
  GENERATING: 'badge-purple', RENDERING: 'badge-purple', READY: 'badge-green',
  SCHEDULED: 'badge-orange', PUBLISHING: 'badge-orange', PUBLISHED: 'badge-green', FAILED: 'badge-red',
};

const MOCK_ITEMS = [
  { id: 1, title: '5 AI Tools That Replace Employees in 2026', type: 'Long Video', platform: '▶️ YouTube', status: 'GENERATING', progress: 65, time: 'Generating...', thumbnail: null },
  { id: 2, title: '5 AI Tools That Replace Employees in 2026', type: 'Carousel', platform: '📸 Instagram', status: 'QUEUED', progress: 0, time: 'Queued', thumbnail: null },
  { id: 3, title: '5 AI Tools That Replace Employees in 2026', type: 'Short', platform: '🎵 TikTok', status: 'QUEUED', progress: 0, time: 'Queued', thumbnail: null },
  { id: 4, title: 'How Gemini 2.0 Changes Everything', type: 'Long Video', platform: '▶️ YouTube', status: 'SCHEDULED', progress: 100, time: 'Today 9:00 AM', thumbnail: null },
  { id: 5, title: 'ChatGPT vs Claude vs Gemini', type: 'Carousel', platform: '📸 Instagram', status: 'PUBLISHED', progress: 100, time: '2h ago', thumbnail: null },
  { id: 6, title: 'Best AI Image Generators 2026', type: 'Short', platform: '▶️ YouTube', status: 'PUBLISHED', progress: 100, time: '5h ago', thumbnail: null },
  { id: 7, title: 'AI Voiceover Tools Compared', type: 'Long Video', platform: '▶️ YouTube', status: 'FAILED', progress: 34, time: 'Failed 1h ago', thumbnail: null },
  { id: 8, title: 'Top 10 Productivity Apps with AI', type: 'Carousel', platform: '📸 Instagram', status: 'READY', progress: 100, time: 'Ready to publish', thumbnail: null },
  { id: 9, title: 'Make Money with AI 2026', type: 'Long Video', platform: '▶️ YouTube', status: 'SCRIPTING', progress: 25, time: 'Writing script...', thumbnail: null },
  { id: 10, title: 'AI Research Tools for Students', type: 'Short', platform: '📱 Instagram', status: 'RENDERING', progress: 80, time: 'Rendering video...', thumbnail: null },
];

const TABS = ['All', 'Queued', 'Generating', 'Ready', 'Scheduled', 'Publishing', 'Published', 'Failed'];

export default function QueuePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [items, setItems] = useState(MOCK_ITEMS);

  const filtered = activeTab === 'All' ? items : items.filter(i => {
    const s = i.status;
    if (activeTab === 'Queued') return s === 'QUEUED';
    if (activeTab === 'Generating') return ['RESEARCHING','SCRIPTING','GENERATING','RENDERING'].includes(s);
    if (activeTab === 'Ready') return s === 'READY';
    if (activeTab === 'Scheduled') return s === 'SCHEDULED';
    if (activeTab === 'Publishing') return s === 'PUBLISHING';
    if (activeTab === 'Published') return s === 'PUBLISHED';
    if (activeTab === 'Failed') return s === 'FAILED';
    return true;
  });

  const tabCount = (tab: string) => tab === 'All' ? items.length : items.filter(i => {
    const s = i.status;
    if (tab === 'Queued') return s === 'QUEUED';
    if (tab === 'Generating') return ['RESEARCHING','SCRIPTING','GENERATING','RENDERING'].includes(s);
    if (tab === 'Ready') return s === 'READY';
    if (tab === 'Scheduled') return s === 'SCHEDULED';
    if (tab === 'Publishing') return s === 'PUBLISHING';
    if (tab === 'Published') return s === 'PUBLISHED';
    if (tab === 'Failed') return s === 'FAILED';
    return false;
  }).length;

  function retry(id: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'QUEUED', progress: 0 } : i));
  }

  function deleteItem(id: number) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${activeTab === tab ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: activeTab === tab ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)', color: activeTab === tab ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
            {tab}
            <span style={{ background: activeTab === tab ? 'var(--purple-600)' : 'var(--bg-input)', color: activeTab === tab ? '#fff' : 'var(--text-muted)', fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: 28 }}>📭</div>
          <h3>No content here</h3>
          <p>Create content to see it appear in this queue</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', ...(item.status === 'FAILED' ? { border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' } : {}) }}>
              {/* Thumbnail */}
              <div style={{ width: 80, height: 52, borderRadius: 'var(--radius-sm)', background: `linear-gradient(135deg, ${item.status === 'FAILED' ? '#ef444430, #1a0a0a' : 'var(--purple-600)30, var(--bg-secondary)'})`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid var(--border-primary)' }}>
                {item.type === 'Long Video' ? '🎬' : item.type === 'Carousel' ? '🖼️' : '📱'}
              </div>

              {/* Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.type}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.platform}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
                {item.progress > 0 && item.progress < 100 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>{item.time}</span><span>{item.progress}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${item.progress}%` }} /></div>
                  </div>
                )}
              </div>

              {/* Status */}
              <span className={`badge ${STATUS_COLORS[item.status]}`} style={{ flexShrink: 0 }}>{item.status}</span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {item.status === 'READY' && (
                  <button className="btn btn-success btn-sm">Publish</button>
                )}
                {item.status === 'FAILED' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => retry(item.id)}>Retry</button>
                )}
                {item.status === 'SCHEDULED' && (
                  <button className="btn btn-secondary btn-sm">Reschedule</button>
                )}
                <button className="btn btn-ghost btn-icon btn-sm" title="Preview">👁</button>
                <button className="btn btn-ghost btn-icon btn-sm" title="Delete" onClick={() => deleteItem(item.id)} style={{ color: 'var(--red-400)' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
