'use client';
import { useState } from 'react';

const PLANS = [
  { name: 'Free', price: 0, videos: 5, images: 50, voice: 10, storage: '1 GB', color: 'var(--text-secondary)', features: ['5 videos/month','50 images','10 min voice','1 platform','Basic templates'] },
  { name: 'Creator', price: 29, videos: 30, images: 300, voice: 60, storage: '10 GB', color: 'var(--purple-400)', popular: false, features: ['30 videos/month','300 images','60 min voice','3 platforms','All templates','Priority queue'] },
  { name: 'Pro', price: 79, videos: 100, images: 1000, voice: 200, storage: '50 GB', color: 'var(--blue-400)', popular: true, features: ['100 videos/month','1000 images','200 min voice','All platforms','Custom branding','API access','Priority support'] },
  { name: 'Business', price: 199, videos: -1, images: -1, voice: -1, storage: '500 GB', color: 'var(--green-400)', features: ['Unlimited videos','Unlimited images','Unlimited voice','All platforms','White label','Dedicated support','Custom integrations'] },
];

const CURRENT_PLAN = 'Pro';

export default function BillingPage() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly');

  const usage = { videos: 42, videos_max: 100, images: 387, images_max: 1000, voice: 78, voice_max: 200, storage: 18.4, storage_max: 50 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease', maxWidth: 1000 }}>
      {/* Current plan */}
      <div className="card" style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>CURRENT PLAN</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue-400)' }}>Pro Plan</h2>
              <span className="badge badge-blue">ACTIVE</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>$79/month · Renews August 22, 2026</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary">Manage Subscription</button>
            <button className="btn btn-primary">Upgrade to Business →</button>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>This Month&apos;s Usage</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
          {[
            { label: 'Videos Generated', used: usage.videos, max: usage.videos_max, unit: 'videos', color: 'var(--purple-400)' },
            { label: 'Images Generated', used: usage.images, max: usage.images_max, unit: 'images', color: 'var(--blue-400)' },
            { label: 'Voice Minutes', used: usage.voice, max: usage.voice_max, unit: 'minutes', color: 'var(--green-400)' },
            { label: 'Storage Used', used: usage.storage, max: usage.storage_max, unit: 'GB', color: 'var(--orange-400)' },
          ].map(u => {
            const pct = Math.round((u.used / u.max) * 100);
            return (
              <div key={u.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{u.used}/{u.max} {u.unit}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${u.color}, ${u.color}88)` }} />
                </div>
                <div style={{ fontSize: 11, color: pct > 80 ? 'var(--orange-400)' : 'var(--text-muted)', marginTop: 4 }}>{pct}% used {pct > 80 ? '⚠ Running low' : ''}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan selection */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Upgrade Your Plan</h3>
          <div className="tabs">
            <button className={`tab-btn ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
            <button className={`tab-btn ${billing === 'annual' ? 'active' : ''}`} onClick={() => setBilling('annual')}>Annual <span style={{ fontSize: 10, color: 'var(--green-400)', fontWeight: 700 }}>-20%</span></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {PLANS.map(plan => {
            const isCurrent = plan.name === CURRENT_PLAN;
            const price = billing === 'annual' ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <div key={plan.name} className="card" style={{ textAlign: 'center', position: 'relative', ...(plan.popular ? { border: '1px solid var(--purple-600)', boxShadow: 'var(--shadow-purple)' } : {}), ...(isCurrent ? { border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.04)' } : {}) }}>
                {plan.popular && !isCurrent && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--purple-600)', color: '#fff', fontSize: 10, padding: '2px 12px', borderRadius: 'var(--radius-full)', fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                {isCurrent && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--blue-500)', color: '#fff', fontSize: 10, padding: '2px 12px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>CURRENT PLAN</div>}
                <div style={{ color: plan.color, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>
                  {plan.price === 0 ? 'Free' : `$${price}`}
                  {plan.price > 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span>}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>
                  {plan.videos === -1 ? 'Unlimited videos' : `${plan.videos} videos/mo`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', marginBottom: 20 }}>
                  {plan.features.map(f => <div key={f} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}><span style={{ color: plan.color }}>✓</span>{f}</div>)}
                </div>
                <button className={`btn w-full ${isCurrent ? 'btn-secondary' : 'btn-primary'}`} style={{ justifyContent: 'center', ...(isCurrent ? {} : plan.popular ? {} : { background: 'var(--bg-input)', boxShadow: 'none', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }) }} disabled={isCurrent}>
                  {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade →'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing history */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Billing History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { date: 'Aug 1, 2026', desc: 'Pro Plan - Monthly', amount: '$79.00', status: 'Paid' },
            { date: 'Jul 1, 2026', desc: 'Pro Plan - Monthly', amount: '$79.00', status: 'Paid' },
            { date: 'Jun 1, 2026', desc: 'Creator Plan - Monthly', amount: '$29.00', status: 'Paid' },
          ].map((inv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{inv.date}</div>
              </div>
              <div style={{ fontWeight: 600, marginRight: 16 }}>{inv.amount}</div>
              <span className="badge badge-green">{inv.status}</span>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 10 }}>⬇ PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
