'use client';

const TEMPLATES = [
  { title: 'Top 5 List Video', icon: '🎬', type: 'Video', desc: '5-item listicle with hook, items, and CTA', niche: 'Any' },
  { title: 'News Breakdown', icon: '📰', type: 'Video', desc: 'Break down a trending news story', niche: 'News' },
  { title: 'Tutorial Step-by-Step', icon: '📚', type: 'Video', desc: 'Educational how-to with numbered steps', niche: 'Education' },
  { title: 'Product Review', icon: '⭐', type: 'Video', desc: 'Pros, cons, verdict structure', niche: 'Tech' },
  { title: 'AI Tools Carousel', icon: '🖼️', type: 'Carousel', desc: 'Best X tools for Y job', niche: 'AI' },
  { title: 'Tips & Tricks Carousel', icon: '💡', type: 'Carousel', desc: 'N tips with icon + short text', niche: 'Any' },
  { title: 'Before vs After', icon: '↔️', type: 'Carousel', desc: 'Comparison carousel for any topic', niche: 'Any' },
  { title: 'Viral Short Hook', icon: '📱', type: 'Short', desc: '"POV:", "Nobody talks about", "Stop doing X" formats', niche: 'Any' },
];

export default function TemplatesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {['All','Video','Carousel','Short','Post'].map(t => (
          <button key={t} className="btn btn-secondary btn-sm">{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {TEMPLATES.map((tmpl, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{tmpl.icon}</span>
              <span className="badge badge-purple">{tmpl.type}</span>
            </div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{tmpl.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{tmpl.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-gray">{tmpl.niche}</span>
              <button className="btn btn-primary btn-sm">Use Template →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
