'use client';
import { useState, useEffect, useCallback } from 'react';
import { signIn } from 'next-auth/react';

interface MetaPage {
  id: string;
  name: string;
  picture: string;
  fanCount: number;
  category: string;
  accessToken: string;
}

interface MetaInstagram {
  id: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  linkedPageId: string;
  linkedPageName: string;
  pageAccessToken: string;
}

interface SavedChannel {
  platform: string;
  handle: string;
  followers: number;
  connected: boolean;
}

const PLATFORMS = [
  {
    id: 'youtube', name: 'YouTube', icon: '▶️', color: '#ff4444',
    features: ['Long Video','Short','Thumbnail','Description','Tags'],
    limitations: [],
  },
  {
    id: 'instagram', name: 'Instagram', icon: '📸', color: '#e1306c',
    features: ['Carousel','Reel','Story','Caption','Hashtags'],
    limitations: ['Direct video upload requires approval'],
  },
  {
    id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#69c9d0',
    features: ['Short Video','Caption','Hashtags'],
    limitations: ['API access requires TikTok for Developers approval'],
  },
  {
    id: 'facebook', name: 'Facebook', icon: '👍', color: '#1877f2',
    features: ['Video','Carousel Post','Text Post','Hashtags'],
    limitations: ['Requires Facebook Business Suite'],
  },
];

export default function ChannelsPage() {
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [savedChannels, setSavedChannels] = useState<Record<string, SavedChannel>>({});
  const [testing, setTesting] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'instagram' | 'facebook' | null>(null);
  const [facebookPages, setFacebookPages] = useState<MetaPage[]>([]);
  const [instagramAccounts, setInstagramAccounts] = useState<MetaInstagram[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [savingChannel, setSavingChannel] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  // Check which providers are connected via OAuth
  useEffect(() => {
    fetch('/api/auth/accounts')
      .then(res => res.json())
      .then(data => {
        if (data.accounts) {
          setConnectedProviders(data.accounts.map((a: string) => a.toLowerCase()));
        }
      })
      .catch(console.error);

    // Also fetch saved channels from database
    fetch('/api/channels/list')
      .then(res => res.json())
      .then(data => {
        if (data.channels) {
          const channelMap: Record<string, SavedChannel> = {};
          for (const ch of data.channels) {
            channelMap[ch.platform.toLowerCase()] = ch;
          }
          setSavedChannels(channelMap);
        }
      })
      .catch(console.error);
  }, []);

  const fetchMetaAccounts = useCallback(async () => {
    setLoadingMeta(true);
    setMetaError(null);
    try {
      const res = await fetch('/api/auth/meta/accounts');
      const data = await res.json();

      if (data.error) {
        setMetaError(data.error);
        setFacebookPages([]);
        setInstagramAccounts([]);
      } else {
        setFacebookPages(data.facebookPages || []);
        setInstagramAccounts(data.instagramAccounts || []);
      }
    } catch (err) {
      setMetaError('Failed to fetch accounts. Please try again.');
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  function connect(id: string) {
    if (id === 'youtube') {
      signIn('google');
    } else if (id === 'instagram' || id === 'facebook') {
      // Check if Facebook OAuth is already done
      if (connectedProviders.includes('facebook')) {
        // Already logged in, show selection modal
        setModalType(id as 'instagram' | 'facebook');
        setShowModal(true);
        fetchMetaAccounts();
      } else {
        // Need to do Facebook OAuth first
        signIn('facebook');
      }
    } else {
      // Mock for others like TikTok
    }
  }

  function disconnect(id: string) {
    setSavedChannels(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function selectInstagramAccount(account: MetaInstagram) {
    setSavingChannel(true);
    try {
      const res = await fetch('/api/channels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'INSTAGRAM',
          accountId: account.id,
          handle: `@${account.username}`,
          accessToken: account.pageAccessToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedChannels(prev => ({
          ...prev,
          instagram: {
            platform: 'INSTAGRAM',
            handle: `@${account.username}`,
            followers: account.followersCount,
            connected: true,
          },
        }));
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to save Instagram account:', err);
    } finally {
      setSavingChannel(false);
    }
  }

  async function selectFacebookPage(page: MetaPage) {
    setSavingChannel(true);
    try {
      const res = await fetch('/api/channels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'FACEBOOK',
          accountId: page.id,
          handle: page.name,
          accessToken: page.accessToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedChannels(prev => ({
          ...prev,
          facebook: {
            platform: 'FACEBOOK',
            handle: page.name,
            followers: page.fanCount,
            connected: true,
          },
        }));
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to save Facebook page:', err);
    } finally {
      setSavingChannel(false);
    }
  }

  async function testConnection(id: string) {
    setTesting(id);
    await new Promise(r => setTimeout(r, 1500));
    setTesting(null);
  }

  function isConnected(platformId: string): boolean {
    return !!savedChannels[platformId]?.connected;
  }

  function getHandle(platformId: string): string {
    return savedChannels[platformId]?.handle || '';
  }

  function getFollowers(platformId: string): string {
    const ch = savedChannels[platformId];
    if (!ch) return '';
    return ch.followers != null ? `${ch.followers.toLocaleString()} followers` : 'Syncing...';
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
        {PLATFORMS.map(platform => {
          const connected = isConnected(platform.id);
          return (
            <div key={platform.id} className="card" style={{ ...(connected ? { border: `1px solid ${platform.color}30` } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Icon */}
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: `${platform.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, border: `1px solid ${platform.color}30` }}>
                  {platform.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{platform.name}</h3>
                    <span className={`badge ${connected ? 'badge-green' : 'badge-gray'}`}>
                      {connected ? '✓ Connected' : 'Not Connected'}
                    </span>
                  </div>

                  {connected && (
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: platform.color, fontWeight: 600 }}>{getHandle(platform.id)}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>{getFollowers(platform.id)}</span>
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
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
                  {connected ? (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => testConnection(platform.id)} disabled={testing === platform.id} style={{ justifyContent: 'center' }}>
                        {testing === platform.id ? '⟳ Testing...' : '⚡ Test'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => disconnect(platform.id)} style={{ justifyContent: 'center' }}>Disconnect</button>
                    </>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => connect(platform.id)} style={{ justifyContent: 'center', minWidth: 120 }}>
                      {(platform.id === 'facebook' || platform.id === 'instagram') && connectedProviders.includes('facebook') 
                        ? `Select ${platform.name} Account` 
                        : `Connect ${platform.name}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

      {/* ==================== ACCOUNT SELECTION MODAL ==================== */}
      {showModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'var(--card-bg, #1a1a2e)',
              borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '80vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                {modalType === 'instagram' ? '📸 Select Instagram Account' : '👍 Select Facebook Page'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white', fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {/* Loading State */}
            {loadingMeta && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⟳</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Fetching your accounts from Meta...</p>
              </div>
            )}

            {/* Error State */}
            {metaError && !loadingMeta && (
              <div style={{
                padding: '16px 20px', background: 'rgba(239,68,68,0.1)', borderRadius: 12,
                border: '1px solid rgba(239,68,68,0.3)', marginBottom: 16,
              }}>
                <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ {metaError}</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={fetchMetaAccounts}
                  style={{ marginTop: 12 }}
                >
                  🔄 Retry
                </button>
              </div>
            )}

            {/* INSTAGRAM ACCOUNTS LIST */}
            {modalType === 'instagram' && !loadingMeta && !metaError && (
              <>
                {instagramAccounts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🤷</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>
                      No Instagram Business accounts found.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                      Make sure your Instagram account is:
                      <br />• Converted to a <strong>Business</strong> or <strong>Creator</strong> account
                      <br />• Connected to a <strong>Facebook Page</strong>
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                      Found {instagramAccounts.length} Instagram account{instagramAccounts.length > 1 ? 's' : ''}. Select one:
                    </p>
                    {instagramAccounts.map(acc => (
                      <div
                        key={acc.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 12,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(225,48,108,0.1)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,48,108,0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                        onClick={() => selectInstagramAccount(acc)}
                      >
                        {/* Profile Picture */}
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                          border: '2px solid #e1306c', flexShrink: 0,
                          background: 'rgba(225,48,108,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {acc.profilePicture ? (
                            <img src={acc.profilePicture} alt={acc.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 20 }}>📸</span>
                          )}
                        </div>

                        {/* Account Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#e1306c' }}>@{acc.username}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {acc.followersCount.toLocaleString()} followers • via {acc.linkedPageName}
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={savingChannel}
                          style={{ flexShrink: 0, fontSize: 12 }}
                        >
                          {savingChannel ? '...' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* FACEBOOK PAGES LIST */}
            {modalType === 'facebook' && !loadingMeta && !metaError && (
              <>
                {facebookPages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🤷</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>
                      No Facebook Pages found.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                      You need to be an admin of at least one Facebook Page to use this feature.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                      Found {facebookPages.length} Facebook page{facebookPages.length > 1 ? 's' : ''}. Select one:
                    </p>
                    {facebookPages.map(page => (
                      <div
                        key={page.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 12,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(24,119,242,0.1)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(24,119,242,0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                        onClick={() => selectFacebookPage(page)}
                      >
                        {/* Page Picture */}
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                          border: '2px solid #1877f2', flexShrink: 0,
                          background: 'rgba(24,119,242,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {page.picture ? (
                            <img src={page.picture} alt={page.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: 20 }}>👍</span>
                          )}
                        </div>

                        {/* Page Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#1877f2' }}>{page.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {page.fanCount.toLocaleString()} fans • {page.category}
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={savingChannel}
                          style={{ flexShrink: 0, fontSize: 12 }}
                        >
                          {savingChannel ? '...' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Spin animation for loading */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
