'use client';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_ADMIN = {
  users: 1247,
  activeToday: 89,
  totalVideos: 48291,
  totalStorage: '2.4 TB',
  revenue: '$28,400',
  failedJobs: 12,
  apiUsage: 84,
};

const MOCK_USERS = [
  { name: 'John Creator', email: 'john@example.com', plan: 'Pro', videos: 87, joined: 'Aug 1', status: 'active' },
  { name: 'Sara Growth', email: 'sara@example.com', plan: 'Business', videos: 312, joined: 'Jul 15', status: 'active' },
  { name: 'Mike Tech', email: 'mike@example.com', plan: 'Creator', videos: 23, joined: 'Aug 10', status: 'active' },
  { name: 'Anna Marketing', email: 'anna@example.com', plan: 'Free', videos: 3, joined: 'Aug 20', status: 'active' },
];

const FAILED_JOBS = [
  { id: 'job_001', user: 'john@example.com', type: 'Video Render', error: 'GPU timeout after 300s', time: '1h ago' },
  { id: 'job_002', user: 'sara@example.com', type: 'TikTok Publish', error: 'OAuth token expired', time: '2h ago' },
  { id: 'job_003', user: 'mike@example.com', type: 'Voice Synthesis', error: 'Provider rate limit', time: '3h ago' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('overview');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '24px' }}>
      {/* Admin header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Back to App</Link>
          <div style={{ width: 1, height: 16, background: 'var(--border-primary)' }} />
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>⚡ Admin Panel</h1>
          <span className="badge badge-red">ADMIN ONLY</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {['overview','users','jobs','api','plans'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', border: `1px solid ${tab === t ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: tab === t ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)', color: tab === t ? 'var(--purple-300)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', textTransform: 'capitalize', fontWeight: tab === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
            {[
              { label: 'Total Users', value: MOCK_ADMIN.users.toLocaleString(), icon: '👥', color: 'var(--purple-400)' },
              { label: 'Active Today', value: MOCK_ADMIN.activeToday, icon: '🟢', color: 'var(--green-400)' },
              { label: 'Videos Generated', value: MOCK_ADMIN.totalVideos.toLocaleString(), icon: '🎬', color: 'var(--blue-400)' },
              { label: 'Total Storage', value: MOCK_ADMIN.totalStorage, icon: '☁️', color: 'var(--orange-400)' },
              { label: 'MRR', value: MOCK_ADMIN.revenue, icon: '💰', color: 'var(--green-400)' },
              { label: 'Failed Jobs', value: MOCK_ADMIN.failedJobs, icon: '⚠️', color: 'var(--red-400)' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* API Usage */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>API Provider Usage</h3>
            {[
              { name: 'Google Gemini (AI)', used: 84, max: 100, unit: '%', color: 'var(--blue-400)' },
              { name: 'Google Veo (Video)', used: 42, max: 100, unit: '%', color: 'var(--purple-400)' },
              { name: 'ElevenLabs (Voice)', used: 61, max: 100, unit: '%', color: 'var(--green-400)' },
              { name: 'AWS S3 (Storage)', used: 48, max: 100, unit: '%', color: 'var(--orange-400)' },
            ].map(api => (
              <div key={api.name} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span>{api.name}</span>
                  <span style={{ color: api.used > 80 ? 'var(--red-400)' : 'var(--text-muted)', fontWeight: 600 }}>{api.used}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${api.used}%`, background: `linear-gradient(90deg, ${api.color}, ${api.color}88)` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Failed jobs */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--red-400)' }}>⚠ Failed Jobs</h3>
            {FAILED_JOBS.map(job => (
              <div key={job.id} style={{ display: 'flex', gap: 16, padding: '10px 12px', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.1)', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--red-400)' }}>{job.type} · {job.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.user} · {job.error} · {job.time}</div>
                </div>
                <button className="btn btn-secondary btn-sm">Retry</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>All Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {['Name','Email','Plan','Videos','Joined','Status','Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '12px', fontSize: 13, fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}><span className={`badge ${u.plan === 'Business' ? 'badge-green' : u.plan === 'Pro' ? 'badge-blue' : u.plan === 'Creator' ? 'badge-purple' : 'badge-gray'}`}>{u.plan}</span></td>
                    <td style={{ padding: '12px', fontSize: 13 }}>{u.videos}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'var(--text-muted)' }}>{u.joined}</td>
                    <td style={{ padding: '12px' }}><span className="badge badge-green">{u.status}</span></td>
                    <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm">View</button>
                      <button className="btn btn-danger btn-sm">Suspend</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'plans' && (
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Plan Management</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Configure pricing from Stripe dashboard. These are reference limits stored in your environment config.</p>
          {[
            { name: 'Free', price: '$0', videos: 5, images: 50, voice: '10 min', storage: '1 GB' },
            { name: 'Creator', price: '$29', videos: 30, images: 300, voice: '60 min', storage: '10 GB' },
            { name: 'Pro', price: '$79', videos: 100, images: 1000, voice: '200 min', storage: '50 GB' },
            { name: 'Business', price: '$199', videos: -1, images: -1, voice: 'Unlimited', storage: '500 GB' },
          ].map(plan => (
            <div key={plan.name} style={{ display: 'flex', gap: 20, padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', marginBottom: 8, alignItems: 'center' }}>
              <div style={{ fontWeight: 700, width: 80 }}>{plan.name}</div>
              <div style={{ fontWeight: 700, color: 'var(--green-400)', width: 60 }}>{plan.price}/mo</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>{plan.videos === -1 ? 'Unlimited' : plan.videos} videos · {plan.images === -1 ? 'Unlimited' : plan.images} images · {plan.voice} · {plan.storage}</div>
              <button className="btn btn-secondary btn-sm">Edit Limits</button>
            </div>
          ))}
        </div>
      )}

      {(tab === 'jobs' || tab === 'api') && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🚧</div>
            <h3>{tab === 'jobs' ? 'Job Monitor' : 'API Monitor'}</h3>
            <p>This panel requires BullBoard integration. Connect Redis and BullMQ to enable live job monitoring.</p>
          </div>
        </div>
      )}
    </div>
  );
}
