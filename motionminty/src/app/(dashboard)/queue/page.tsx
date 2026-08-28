'use client';
import { useState, useEffect } from 'react';

const STATUS_COLORS: Record<string, string> = {
  QUEUED: 'badge-gray', RESEARCHING: 'badge-blue', SCRIPTING: 'badge-blue',
  GENERATING: 'badge-purple', RENDERING: 'badge-purple', READY: 'badge-green',
  SCHEDULED: 'badge-orange', PUBLISHING: 'badge-orange', PUBLISHED: 'badge-green', FAILED: 'badge-red',
};

const TABS = ['All', 'Queued', 'Generating', 'Ready', 'Scheduled', 'Publishing', 'Published', 'Failed'];

export default function QueuePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchJobs() {
      try {
        const res = await fetch('/api/content/create');
        if (res.ok && mounted) {
          const data = await res.json();
          // Sort newest first
          setItems((data.jobs || []).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchJobs();
    const interval = setInterval(fetchJobs, 2000); // Poll every 2 seconds
    return () => { mounted = false; clearInterval(interval); };
  }, []);

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

  async function retry(id: string) {
    try {
      // Optimistic update
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'QUEUED', progress: 0 } : i));
      const res = await fetch('/api/content/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id })
      });
      if (!res.ok) {
        throw new Error('Failed to retry');
      }
    } catch (err) {
      alert('Failed to retry the job. Please check logs.');
    }
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    // Should call API to delete from mockStore/DB
  }

  if (loading && items.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading queue...</div>;
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
                {item.contentTypes?.[0] === 'long_video' ? '🎬' : item.contentTypes?.[0] === 'carousel' ? '🖼️' : '📝'}
              </div>

              {/* Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.contentTypes?.join(', ') || 'Content'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.platforms?.join(', ') || 'Platform'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.logs?.[item.logs.length - 1]?.split('] ')[1] || 'Queued'}</span>
                </div>
                {item.progress > 0 && item.progress < 100 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>Progress</span><span>{item.progress}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${item.progress}%` }} /></div>
                  </div>
                )}
              </div>

              {/* Status */}
              <span className={`badge ${STATUS_COLORS[item.status] || 'badge-gray'}`} style={{ flexShrink: 0 }}>{item.status}</span>

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
