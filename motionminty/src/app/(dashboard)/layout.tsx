import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.25s ease' }}>
        <TopNav />
        <main style={{ flex: 1, padding: '24px', maxWidth: 1600, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
