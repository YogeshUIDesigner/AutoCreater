'use client';
import { useState } from 'react';

const ITEMS = [
  { id: 1, title: '5 AI Tools That Replace Jobs', platform: '▶️', type: 'Video', views: '234K', likes: '18.2K', comments: '1.2K', time: '2 days ago', status: 'live' },
  { id: 2, title: '5 AI Tools That Replace Jobs', platform: '📸', type: 'Carousel', views: '45K', likes: '3.8K', comments: '234', time: '2 days ago', status: 'live' },
  { id: 3, title: 'ChatGPT vs Claude vs Gemini', platform: '▶️', type: 'Video', views: '189K', likes: '14.7K', comments: '987', time: '4 days ago', status: 'live' },
  { id: 4, title: 'Best AI Image Generators 2026', platform: '🎵', type: 'Short', views: '512K', likes: '48.2K', comments: '3.4K', time: '5 days ago', status: 'live' },
  { id: 5, title: 'How to Use Gemini 2.0 Effectively', platform: '📸', type: 'Reel', views: '78K', likes: '6.2K', comments: '412', time: '6 days ago', status: 'live' },
];

export default function PublishedPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? ITEMS : ITEMS.filter(i => i.platform === (filter === 'youtube' ? '▶️' : filter === 'instagram' ? '📸' : filter === 'tiktok' ? '🎵' : '👍'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{id:'all',label:'All Platforms'},{id:'youtube',label:'▶️ YouTube'},{id:'instagram',label:'📸 Instagram'},{id:'tiktok',label:'🎵 TikTok'},{id:'facebook',label:'👍 Facebook'}].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '7px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${filter === f.id ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: filter === f.id ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)', color: filter === f.id ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontWeight: filter === f.id ? 600 : 400 }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 120, height: 68, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--purple-600)40, var(--bg-secondary))', flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>{item.platform} {item.type}</span>
                <span>👁 {item.views}</span>
                <span>❤️ {item.likes}</span>
                <span>💬 {item.comments}</span>
                <span>{item.time}</span>
              </div>
            </div>
            <span className="badge badge-green">Live</span>
          </div>
        ))}
      </div>
    </div>
  );
}
