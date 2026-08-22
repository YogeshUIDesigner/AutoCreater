'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/create': 'Create Content',
  '/templates': 'AI Templates',
  '/queue': 'Content Queue',
  '/automation': 'Automation',
  '/channels': 'Channels',
  '/published': 'Published Content',
  '/posts': 'Social Posts',
  '/calendar': 'Calendar',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/billing': 'Billing',
  '/help': 'Help & Support',
};

export default function TopNav() {
  const pathname = usePathname();
  const title = BREADCRUMBS[pathname] ?? 'Dashboard';

  return (
    <header style={{
      height: 'var(--topnav-height)',
      background: 'rgba(13,17,23,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h1>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Quick create */}
        <Link href="/create" className="btn btn-primary btn-sm" style={{ gap: 6 }}>
          ✦ Create Content
        </Link>

        {/* Notifications */}
        <button className="btn btn-ghost btn-icon" style={{ position: 'relative', fontSize: 18 }}>
          🔔
          <span className="notif-dot" />
        </button>

        {/* User avatar */}
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', border: '2px solid var(--border-primary)' }}>
          U
        </div>
      </div>
    </header>
  );
}
