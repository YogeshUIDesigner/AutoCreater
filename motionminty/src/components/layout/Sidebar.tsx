'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/create', icon: '✦', label: 'Create Content', badge: 'NEW' },
  { href: '/templates', icon: '◈', label: 'AI Templates' },
  { href: '/queue', icon: '≡', label: 'Content Queue', count: 12 },
  { href: '/automation', icon: '⚙', label: 'Automation' },
  { href: '/channels', icon: '◎', label: 'Channels' },
  { href: '/published', icon: '✓', label: 'Published Content' },
  { href: '/posts', icon: '◷', label: 'Social Posts' },
  { href: '/calendar', icon: '▦', label: 'Calendar' },
  { href: '/analytics', icon: '↗', label: 'Analytics' },
  { divider: true },
  { href: '/settings', icon: '◌', label: 'Settings' },
  { href: '/billing', icon: '◈', label: 'Billing', badge: 'PRO' },
  { href: '/help', icon: '?', label: 'Help & Support' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [automationOn] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 60 : 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 50,
      transition: 'width 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '16px 14px' : '20px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>⚡</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>MotionMint-y</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: 1, whiteSpace: 'nowrap' }}>AI CONTENT FACTORY</div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Automation status pill */}
      {!collapsed && (
        <div style={{ margin: '12px 10px', padding: '8px 12px', background: automationOn ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)', borderRadius: 'var(--radius-md)', border: `1px solid ${automationOn ? 'rgba(34,197,94,0.3)' : 'var(--border-primary)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`status-dot ${automationOn ? 'active' : 'idle'}`} />
          <span style={{ fontSize: 12, fontWeight: 600, color: automationOn ? 'var(--green-400)' : 'var(--text-muted)' }}>
            Automation {automationOn ? 'ON' : 'OFF'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item, i) => {
          if ('divider' in item) return <div key={i} className="divider" style={{ margin: '8px 4px' }} />;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '9px 14px' : '9px 12px',
              borderRadius: 'var(--radius-md)',
              background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
              color: active ? 'var(--purple-300)' : 'var(--text-muted)',
              fontWeight: active ? 600 : 400,
              fontSize: 13,
              transition: 'all 0.15s',
              border: `1px solid ${active ? 'rgba(124,58,237,0.3)' : 'transparent'}`,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
            onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; } }}
            onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; } }}
            >
              <span style={{ fontSize: 15, flexShrink: 0, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span className={`badge badge-${item.badge === 'PRO' ? 'purple' : 'blue'}`} style={{ fontSize: 9, padding: '1px 5px' }}>{item.badge}</span>}
                  {item.count && <span style={{ background: 'var(--purple-600)', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>{item.count}</span>}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {!collapsed && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>U</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pro Plan</div>
          </div>
          <Link href="/settings" style={{ color: 'var(--text-muted)', fontSize: 14, padding: 4, borderRadius: 4 }}>⚙</Link>
        </div>
      )}
    </aside>
  );
}
