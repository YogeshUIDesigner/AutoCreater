'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CONTENT_TYPES = [
  { id: 'long_video', icon: '🎬', label: 'Long Video', desc: '5-15 min YouTube' },
  { id: 'short', icon: '📱', label: 'YouTube Short', desc: '< 60 seconds' },
  { id: 'reel', icon: '🎞️', label: 'Instagram Reel', desc: '< 90 seconds' },
  { id: 'carousel', icon: '🖼️', label: 'Image Carousel', desc: '4-10 slides' },
  { id: 'post', icon: '📝', label: 'Text Post', desc: 'Social post' },
];

const AI_VOICES = ['Alloy (Natural)','Nova (Female, Warm)','Onyx (Male, Deep)','Shimmer (Warm)','Echo (Professional)','Fable (Friendly)'];
const VIDEO_STYLES = ['Cinematic Dark','Modern Minimal','Corporate Clean','Vibrant Colorful','Documentary','News Style'];
const RESOLUTIONS = ['4K (3840×2160)','1080p (1920×1080)','720p (1280×720)'];
const RATIOS = ['16:9 (Landscape)','9:16 (Portrait/Short)','1:1 (Square)','4:5 (Instagram)'];
const MUSIC_OPTIONS = ['None','Cinematic','Upbeat','Calm','Corporate','Epic','Lo-Fi'];
const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', icon: '👍' },
];
const STEPS = ['Topic','Content Types','Video Settings','Carousel Settings','Platforms','Schedule'];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    topic: '', customPrompt: '', niche: '', language: 'English', tone: 'Professional', audience: '',
    contentTypes: ['long_video', 'short', 'carousel'],
    videoDuration: '10', aiVoice: AI_VOICES[0], voiceGender: 'Neutral', voiceStyle: 'Natural',
    videoStyle: VIDEO_STYLES[0], resolution: RESOLUTIONS[1], aspectRatio: RATIOS[0],
    bgMusic: 'Cinematic', captions: true,
    numSlides: '6', slideRatio: '1:1', designStyle: 'Modern', imageStyle: 'Photorealistic',
    brandColors: '#7c3aed', cta: 'Follow for more!', fontStyle: 'Inter',
    platforms: ['youtube', 'instagram'],
    scheduleType: 'immediate' as 'immediate' | 'schedule',
    scheduleDate: '', scheduleTime: '09:00', timezone: 'Asia/Kolkata',
  });

  function toggle(key: 'contentTypes' | 'platforms', val: string) {
    setForm(p => {
      const arr = p[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/content/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/queue');
      } else {
        alert('Failed to generate content. Check logs.');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating content');
    } finally {
      setGenerating(false);
    }
  }

  const stepContent = [
    // Step 0: Topic
    <div key="topic" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>What&apos;s your topic?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Enter a topic or title and we&apos;ll research and create everything automatically</p>
      </div>
      <div className="form-group">
        <label className="form-label">Topic / Title *</label>
        <input className="form-input" placeholder="e.g. 5 AI Tools That Will Replace Jobs in 2026" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} style={{ fontSize: 16 }} />
        <span className="form-hint">Be specific for better results. AI will research and expand on this.</span>
      </div>
      <div className="form-group">
        <label className="form-label">Custom Instructions / Prompt (Optional)</label>
        <textarea className="form-input" placeholder="e.g. Always use a highly energetic tone, don't use emojis, and end with a question..." value={form.customPrompt} onChange={e => setForm(p => ({ ...p, customPrompt: e.target.value }))} rows={3} />
        <span className="form-hint">Give specific guidelines for this post.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Niche</label>
          <input className="form-input" placeholder="e.g. AI & Technology" value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Language</label>
          <select className="form-input form-select" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))}>
            {['English','Hindi','Spanish','French','Portuguese','German','Arabic'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tone</label>
          <select className="form-input form-select" value={form.tone} onChange={e => setForm(p => ({ ...p, tone: e.target.value }))}>
            {['Professional','Casual','Energetic','Educational','Humorous','Inspirational'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Target Audience</label>
          <input className="form-input" placeholder="e.g. Students, Marketers, Entrepreneurs" value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} />
        </div>
      </div>
    </div>,

    // Step 1: Content types
    <div key="types" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>What content should AI generate?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select all types you want. All will be generated from the same topic automatically.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {CONTENT_TYPES.map(ct => {
          const sel = form.contentTypes.includes(ct.id);
          return (
            <button key={ct.id} onClick={() => toggle('contentTypes', ct.id)} style={{ padding: '20px 16px', borderRadius: 'var(--radius-lg)', border: `2px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative' }}>
              {sel && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>✓</div>}
              <div style={{ fontSize: 32, marginBottom: 10 }}>{ct.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4, color: sel ? 'var(--purple-300)' : 'var(--text-primary)' }}>{ct.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ct.desc}</div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 13, color: 'var(--purple-300)' }}>
        ✦ {form.contentTypes.length} content type{form.contentTypes.length !== 1 ? 's' : ''} selected → 1 topic will produce {form.contentTypes.length} pieces of content
      </div>
    </div>,

    // Step 2: Video settings
    <div key="video" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Video Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Configure how AI generates your videos</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Video Duration (minutes)</label>
          <select className="form-input form-select" value={form.videoDuration} onChange={e => setForm(p => ({ ...p, videoDuration: e.target.value }))}>
            {['5','8','10','12','15','20'].map(d => <option key={d} value={d}>{d} minutes</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">AI Voice</label>
          <select className="form-input form-select" value={form.aiVoice} onChange={e => setForm(p => ({ ...p, aiVoice: e.target.value }))}>
            {AI_VOICES.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Voice Style</label>
          <select className="form-input form-select" value={form.voiceStyle} onChange={e => setForm(p => ({ ...p, voiceStyle: e.target.value }))}>
            {['Natural','Energetic','Calm','Professional','Dramatic'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Video Style</label>
          <select className="form-input form-select" value={form.videoStyle} onChange={e => setForm(p => ({ ...p, videoStyle: e.target.value }))}>
            {VIDEO_STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Resolution</label>
          <select className="form-input form-select" value={form.resolution} onChange={e => setForm(p => ({ ...p, resolution: e.target.value }))}>
            {RESOLUTIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Aspect Ratio</label>
          <select className="form-input form-select" value={form.aspectRatio} onChange={e => setForm(p => ({ ...p, aspectRatio: e.target.value }))}>
            {RATIOS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Background Music</label>
          <select className="form-input form-select" value={form.bgMusic} onChange={e => setForm(p => ({ ...p, bgMusic: e.target.value }))}>
            {MUSIC_OPTIONS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Auto Captions</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <label className="toggle toggle-lg">
              <input type="checkbox" checked={form.captions} onChange={e => setForm(p => ({ ...p, captions: e.target.checked }))} />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Generate captions automatically</span>
          </div>
        </div>
      </div>
    </div>,

    // Step 3: Carousel settings
    <div key="carousel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Carousel Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Configure your image carousel generation</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Number of slides</label>
          <select className="form-input form-select" value={form.numSlides} onChange={e => setForm(p => ({ ...p, numSlides: e.target.value }))}>
            {['4','5','6','7','8','9','10'].map(n => <option key={n} value={n}>{n} slides</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Slide ratio</label>
          <select className="form-input form-select" value={form.slideRatio} onChange={e => setForm(p => ({ ...p, slideRatio: e.target.value }))}>
            {['1:1 (Square)','4:5 (Portrait)','9:16 (Story)'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Design style</label>
          <select className="form-input form-select" value={form.designStyle} onChange={e => setForm(p => ({ ...p, designStyle: e.target.value }))}>
            {['Modern','Minimal','Bold','Corporate','Creative','Dark'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Image style</label>
          <select className="form-input form-select" value={form.imageStyle} onChange={e => setForm(p => ({ ...p, imageStyle: e.target.value }))}>
            {['Photorealistic','Illustration','Flat Design','3D Render','Abstract'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Primary brand color</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input type="color" value={form.brandColors} onChange={e => setForm(p => ({ ...p, brandColors: e.target.value }))} style={{ width: 48, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }} />
            <input className="form-input" value={form.brandColors} onChange={e => setForm(p => ({ ...p, brandColors: e.target.value }))} style={{ flex: 1 }} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Font style</label>
          <select className="form-input form-select" value={form.fontStyle} onChange={e => setForm(p => ({ ...p, fontStyle: e.target.value }))}>
            {['Inter','Roboto','Playfair Display','Montserrat','Poppins','Space Grotesk'].map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">CTA text (last slide)</label>
        <input className="form-input" placeholder="e.g. Follow for daily AI tips!" value={form.cta} onChange={e => setForm(p => ({ ...p, cta: e.target.value }))} />
      </div>
    </div>,

    // Step 4: Platforms
    <div key="platforms" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Publish to platforms</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select where to publish. Content types will be matched to each platform.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {PLATFORMS.map(p => {
          const sel = form.platforms.includes(p.id);
          return (
            <button key={p.id} onClick={() => toggle('platforms', p.id)} style={{ padding: '24px 16px', borderRadius: 'var(--radius-lg)', border: `2px solid ${sel ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: sel ? 'rgba(124,58,237,0.15)' : 'var(--bg-input)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', position: 'relative' }}>
              {sel && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>✓</div>}
              <div style={{ fontSize: 40, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontWeight: 600, color: sel ? 'var(--purple-300)' : 'var(--text-secondary)' }}>{p.label}</div>
            </button>
          );
        })}
      </div>
    </div>,

    // Step 5: Schedule
    <div key="schedule" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>When to publish?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Content will be generated first, then published at your chosen time</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(['immediate', 'schedule'] as const).map(type => (
          <button key={type} onClick={() => setForm(p => ({ ...p, scheduleType: type }))} style={{ padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: `2px solid ${form.scheduleType === type ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: form.scheduleType === type ? 'rgba(124,58,237,0.1)' : 'var(--bg-input)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ fontWeight: 600, color: form.scheduleType === type ? 'var(--purple-300)' : 'var(--text-secondary)', marginBottom: 4 }}>
              {type === 'immediate' ? '⚡ Publish Immediately' : '📅 Schedule for Later'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {type === 'immediate' ? 'Generate and publish as soon as content is ready' : 'Choose a specific date and time to publish'}
            </div>
          </button>
        ))}
      </div>

      {form.scheduleType === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeIn 0.3s ease' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.scheduleDate} onChange={e => setForm(p => ({ ...p, scheduleDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={form.scheduleTime} onChange={e => setForm(p => ({ ...p, scheduleTime: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Timezone</label>
            <select className="form-input form-select" value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}>
              {['Asia/Kolkata','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Australia/Sydney'].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>,
  ];

  // Determine which steps to show based on selected content types
  const hasVideo = form.contentTypes.some(t => ['long_video', 'short', 'reel'].includes(t));
  const hasCarousel = form.contentTypes.includes('carousel');

  const visibleSteps = [
    { id: 'topic', label: 'Topic', content: stepContent[0] },
    { id: 'types', label: 'Content Types', content: stepContent[1] },
  ];
  if (hasVideo) visibleSteps.push({ id: 'video', label: 'Video Settings', content: stepContent[2] });
  if (hasCarousel) visibleSteps.push({ id: 'carousel', label: 'Carousel Settings', content: stepContent[3] });
  visibleSteps.push({ id: 'platforms', label: 'Platforms', content: stepContent[4] });
  visibleSteps.push({ id: 'schedule', label: 'Schedule', content: stepContent[5] });

  // Ensure step index is valid
  const currentStep = step >= visibleSteps.length ? visibleSteps.length - 1 : step;

  return (
    <div style={{ maxWidth: 800, animation: 'fadeIn 0.4s ease' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {visibleSteps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < visibleSteps.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: `2px solid ${i < currentStep ? 'var(--green-500)' : i === currentStep ? 'var(--purple-600)' : 'var(--border-primary)'}`, background: i < currentStep ? 'var(--green-500)' : i === currentStep ? 'var(--purple-600)' : 'var(--bg-input)', color: i <= currentStep ? '#fff' : 'var(--text-muted)', transition: 'all 0.3s', cursor: i < currentStep ? 'pointer' : 'default' }} onClick={() => i < currentStep && setStep(i)}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, color: i === currentStep ? 'var(--purple-400)' : 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: i === currentStep ? 600 : 400 }}>{s.label}</span>
            </div>
            {i < visibleSteps.length - 1 && <div style={{ flex: 1, height: 1, background: i < currentStep ? 'var(--green-500)' : 'var(--border-primary)', margin: '0 6px', marginBottom: 20, transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card" style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
        {visibleSteps[currentStep].content}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={currentStep === 0}>← Back</button>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Step {currentStep + 1} of {visibleSteps.length}</span>
        {currentStep < visibleSteps.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating} style={{ background: 'linear-gradient(135deg,var(--purple-600),var(--blue-500))', boxShadow: '0 4px 20px var(--purple-glow)', gap: 8 }}>
            {generating ? (
              <><span className="animate-spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} /> Generating...</>
            ) : '🚀 Generate Content'}
          </button>
        )}
      </div>
    </div>
  );
}
