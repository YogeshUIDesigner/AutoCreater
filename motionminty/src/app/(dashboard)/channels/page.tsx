'use client';
import { useState } from 'react';

const PLATFORMS = [
  {
    id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff4444',
    connected: true, handle: '@AutoCreator', followers: '14.2K',
    features: ['Long Video','Short','Thumbnail','Description','Tags'],
    limitations: [],
  },
  {
    id: 'instagram', name: 'Instagram', icon: '📸', color: '#e1306c',
    connected: true, handle: '@autocreator_ai', followers: '8.7K',
    features: ['Carousel','Reel','Story','Caption','Hashtags'],
    limitations: ['Direct video upload requires approval'],
  },
  {
    id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#69c9d0',
    connected: false, handle: '', followers: '',
    features: ['Short Video','Caption','Hashtags'],
    limitations: ['API access requires TikTok for Developers approval'],
  },
  {
    id: 'facebook', name: 'Facebook', icon: '👍', color: '#1877f2',
    connected: false, handle: '', followers: '',
    features: ['Video','Carousel Post','Text Post','Hashtags'],
    limitations: ['Requires Facebook Business Suite'],
  },
];

export default function ChannelsPage() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [testing, setTesting] = useState<string | null>(null);

  async function testConnection(id: string) {
    setTesting(id);
    await new Promise(r => setTimeout(r, 1500));
    setTesting(null);
  }

  function disconnect(id: string) {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: false, handle: '', followers: '' } : p));
  }

  function connect(id: string) {
    // In production: trigger OAuth flow
    setTimeout(() => {
      setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: true, handle: `@autocreator`, followers: '0' } : p));
    }, 500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Connect your social media accounts to enable automatic publishing. We use official OAuth and never store your passwords.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <span className="badge badge-green">🔒 OAuth Secured</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {platforms.map(platform => (
          <div key={platform.id} className="card" style={{ ...(platform.connected ? { border: `1px solid ${platform.color}30` } : {}) }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              {/* Icon */}
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: `${platform.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: `1px solid ${platform.color}30` }}>
                {platform.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{platform.name}</h3>
                  <span className={`badge ${platform.connected ? 'badge-green' : 'badge-gray'}`}>
                    {platform.connected ? '✓ Connected' : 'Not Connected'}
                  </span>
                </div>

                {platform.connected && (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: platform.color, fontWeight: 600 }}>{platform.handle}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>{platform.followers} followers</span>
                  </div>
                )}

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>SUPPORTED FEATURES</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {platform.features.map(f => <span key={f} className="badge badge-blue" style={{ fontSize: 10 }}>{f}</span>)}
                  </div>
                </div>

                {platform.limitations.length > 0 && (
                  <div style={{ padding: '8px 12px', background: 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(249,115,22,0.2)', fontSize: 12, color: 'var(--orange-400)' }}>
                    ⚠ {platform.limitations[0]}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flex: 'column', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
                {platform.connected ? (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={() => testConnection(platform.id)} disabled={testing === platform.id} style={{ justifyContent: 'center' }}>
                      {testing === platform.id ? '⟳ Testing...' : '⚡ Test'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => disconnect(platform.id)} style={{ justifyContent: 'center' }}>Disconnect</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => connect(platform.id)} style={{ justifyContent: 'center', minWidth: 120 }}>
                    Connect {platform.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security note */}
      <div style={{ padding: '16px 20px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20 }}>🔐</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--blue-400)', marginBottom: 4 }}>Security & Privacy</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We use official OAuth 2.0 flows — your passwords are never stored or accessed. Tokens are encrypted at rest. You can revoke access from your platform settings at any time. Each user&apos;s credentials are isolated and never shared.
          </div>
        </div>
      </div>
    </div>
  );
}
