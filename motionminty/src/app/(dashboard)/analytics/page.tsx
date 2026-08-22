'use client';
import { useState } from 'react';

const MOCK_DATA = {
  views: [120000,145000,132000,178000,190000,210000,188000,234000,245000,267000,289000,312000],
  likes: [4200,5100,4800,6200,6800,7400,6600,8100,8700,9200,9800,10400],
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  platforms: [
    { name: 'YouTube', icon: '▶️', color: '#ff4444', views: '1.8M', watch: '24.3K hrs', subs: '+340', engagement: '7.2%' },
    { name: 'Instagram', icon: '📸', color: '#e1306c', views: '412K', watch: 'N/A', subs: '+890', engagement: '12.1%' },
    { name: 'TikTok', icon: '🎵', color: '#69c9d0', views: '198K', watch: 'N/A', subs: '+1.2K', engagement: '18.4%' },
    { name: 'Facebook', icon: '👍', color: '#1877f2', views: '87K', watch: '2.1K hrs', subs: '+120', engagement: '3.8%' },
  ],
  top: [
    { title: '5 AI Tools That Replace Jobs', views: '234K', likes: '18.2K', platform: '▶️', change: '+12%' },
    { title: 'ChatGPT Prompts for Students', views: '189K', likes: '14.7K', platform: '📸', change: '+8%' },
    { title: 'Gemini 2.0 Full Review', views: '167K', likes: '12.1K', platform: '▶️', change: '+5%' },
    { title: 'AI Image Generator Compared', views: '143K', likes: '9.8K', platform: '🎵', change: '+23%' },
    { title: 'Make Money with AI 2026', views: '128K', likes: '8.6K', platform: '▶️', change: '+3%' },
  ],
};

const maxViews = Math.max(...MOCK_DATA.views);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'daily'|'weekly'|'monthly'>('monthly');
  const [activePlatform, setActivePlatform] = useState('all');

  const totalViews = '2.4M';
  const totalEngagement = '8.3%';
  const totalSubs = '+2.5K';
  const watchTime = '28.4K hrs';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      {/* Period toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="tabs">
          {(['daily','weekly','monthly'] as const).map(p => (
            <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)} style={{ textTransform: 'capitalize' }}>{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{id:'all',label:'All'},{id:'youtube',label:'▶️'},{id:'instagram',label:'📸'},{id:'tiktok',label:'🎵'},{id:'facebook',label:'👍'}].map(p => (
            <button key={p.id} onClick={() => setActivePlatform(p.id)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${activePlatform === p.id ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: activePlatform === p.id ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)', color: activePlatform === p.id ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        {[
          { label: 'Total Views', value: totalViews, icon: '👁️', color: 'var(--blue-400)', change: '+18%' },
          { label: 'Engagement Rate', value: totalEngagement, icon: '❤️', color: 'var(--red-400)', change: '+0.8%' },
          { label: 'New Subscribers', value: totalSubs, icon: '👥', color: 'var(--green-400)', change: '+340 this week' },
          { label: 'Watch Time', value: watchTime, icon: '⏱️', color: 'var(--purple-400)', change: '+12%' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--green-400)', fontWeight: 600 }}>{s.change}</span>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + platform breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Views chart */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Views Over Time</h3>
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {MOCK_DATA.views.map((v, i) => {
              const h = (v / maxViews) * 160;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: h, background: `linear-gradient(180deg, var(--purple-500), var(--purple-600))`, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', minWidth: 8 }} title={`${(v/1000).toFixed(0)}K views`} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{MOCK_DATA.months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Platform Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_DATA.platforms.map((p, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--green-400)', fontWeight: 600 }}>{p.engagement}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>👁 {p.views}</span>
                  <span>👥 {p.subs}</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: ['75%','40%','20%','10%'][i], background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top content */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Performing Content</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MOCK_DATA.top.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ width: 64, height: 40, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--purple-600)40, var(--blue-500)40)', flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.platform} · {item.views} views · {item.likes} likes</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--green-400)', fontWeight: 700, flexShrink: 0 }}>{item.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {[
          { title: '🏆 Best Topic', value: 'AI Tools & Productivity', sub: 'Avg 180K views' },
          { title: '⏰ Best Time to Post', value: '9:00 AM – 11:00 AM', sub: 'Based on last 30 days' },
          { title: '📱 Best Platform', value: 'TikTok', sub: '18.4% engagement rate' },
          { title: '📦 Best Content Type', value: 'Image Carousel', sub: '12.1% avg engagement' },
        ].map((insight, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{insight.title}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--purple-400)', marginBottom: 4 }}>{insight.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{insight.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
