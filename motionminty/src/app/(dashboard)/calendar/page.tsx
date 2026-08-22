'use client';
import { useState } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

type ContentItem = { type: string; title: string; platform: string; color: string };
type CalendarData = { [key: string]: ContentItem[] };

const CONTENT_COLORS: Record<string, string> = {
  'Video': 'var(--blue-500)', 'Short': 'var(--purple-500)',
  'Carousel': 'var(--green-500)', 'Post': 'var(--orange-500)',
};

const MOCK_CONTENT: CalendarData = {
  '2026-8-22': [
    { type: 'Video', title: '5 AI Tools 2026', platform: '▶️', color: CONTENT_COLORS['Video'] },
    { type: 'Carousel', title: '5 AI Tools 2026', platform: '📸', color: CONTENT_COLORS['Carousel'] },
    { type: 'Short', title: '5 AI Tools 2026', platform: '🎵', color: CONTENT_COLORS['Short'] },
  ],
  '2026-8-23': [
    { type: 'Video', title: 'ChatGPT vs Gemini', platform: '▶️', color: CONTENT_COLORS['Video'] },
    { type: 'Carousel', title: 'ChatGPT vs Gemini', platform: '📸', color: CONTENT_COLORS['Carousel'] },
  ],
  '2026-8-25': [
    { type: 'Short', title: 'AI Prompts Hack', platform: '🎵', color: CONTENT_COLORS['Short'] },
    { type: 'Post', title: 'AI Prompts Hack', platform: '📸', color: CONTENT_COLORS['Post'] },
  ],
  '2026-8-26': [
    { type: 'Video', title: 'Gemini 2.0 Review', platform: '▶️', color: CONTENT_COLORS['Video'] },
    { type: 'Short', title: 'Gemini 2.0 Review', platform: '📱', color: CONTENT_COLORS['Short'] },
    { type: 'Carousel', title: 'Gemini 2.0 Review', platform: '📸', color: CONTENT_COLORS['Carousel'] },
  ],
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(CONTENT_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{type}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={prevMonth}>‹</button>
          <span style={{ fontSize: 15, fontWeight: 700, padding: '5px 12px' }}>{MONTHS[month]} {year}</span>
          <button className="btn btn-secondary btn-sm" onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {cells.map((day, i) => {
            const key = day ? `${year}-${month + 1}-${day}` : '';
            const events = day ? (MOCK_CONTENT[key] || []) : [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={i} style={{ minHeight: 100, padding: 8, borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--border-primary)' : 'none', borderBottom: '1px solid var(--border-primary)', background: !day ? 'rgba(0,0,0,0.1)' : 'transparent', transition: 'background 0.15s' }}>
                {day && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, marginBottom: 6, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? 'var(--purple-600)' : 'transparent', color: isToday ? '#fff' : 'var(--text-secondary)' }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {events.slice(0, 3).map((ev, j) => (
                        <div key={j} style={{ padding: '2px 6px', borderRadius: 3, background: `${ev.color}25`, border: `1px solid ${ev.color}50`, fontSize: 10, color: ev.color, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                          {ev.platform} {ev.type}
                        </div>
                      ))}
                      {events.length > 3 && <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 4 }}>+{events.length - 3} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
