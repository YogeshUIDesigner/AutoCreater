'use client';
import { useState } from 'react';

// ─── Provider Definitions ───────────────────────────────────────────────
const AI_PROVIDERS = [
  { id: 'gemini', label: 'Google Gemini', icon: '🧠', fields: ['GEMINI_API_KEY'] },
  { id: 'openai', label: 'OpenAI (ChatGPT)', icon: '🤖', fields: ['OPENAI_API_KEY'] },
  { id: 'anthropic', label: 'Anthropic Claude', icon: '🎭', fields: ['ANTHROPIC_API_KEY'] },
  { id: 'groq', label: 'Groq (Fast AI)', icon: '⚡', fields: ['GROQ_API_KEY'] },
  { id: 'mistral', label: 'Mistral AI', icon: '💨', fields: ['MISTRAL_API_KEY'] },
  { id: 'custom', label: '+ Add Custom Provider', icon: '✏️', fields: ['CUSTOM_AI_API_KEY', 'CUSTOM_AI_BASE_URL'] },
];

const VIDEO_PROVIDERS = [
  { id: 'veo', label: 'Google Veo 3.1', icon: '🎬', fields: ['GEMINI_API_KEY'] },
  { id: 'runway', label: 'Runway Gen-4', icon: '🎞️', fields: ['RUNWAY_API_KEY'] },
  { id: 'pika', label: 'Pika Labs', icon: '🦩', fields: ['PIKA_API_KEY'] },
  { id: 'kling', label: 'Kling AI', icon: '🌀', fields: ['KLING_API_KEY', 'KLING_API_SECRET'] },
  { id: 'sora', label: 'OpenAI Sora', icon: '🌐', fields: ['OPENAI_API_KEY'] },
  { id: 'haiper', label: 'Haiper', icon: '✨', fields: ['HAIPER_API_KEY'] },
  { id: 'custom', label: '+ Add Custom Provider', icon: '✏️', fields: ['CUSTOM_VIDEO_API_KEY', 'CUSTOM_VIDEO_ENDPOINT'] },
];

const VOICE_PROVIDERS = [
  { id: 'elevenlabs', label: 'ElevenLabs', icon: '🎙️', fields: ['ELEVENLABS_API_KEY'] },
  { id: 'google_tts', label: 'Google TTS', icon: '🔊', fields: ['GOOGLE_TTS_API_KEY'] },
  { id: 'openai_tts', label: 'OpenAI TTS', icon: '🗣️', fields: ['OPENAI_API_KEY'] },
  { id: 'azure_tts', label: 'Azure Neural TTS', icon: '☁️', fields: ['AZURE_TTS_KEY', 'AZURE_TTS_REGION'] },
  { id: 'murf', label: 'Murf AI', icon: '🎵', fields: ['MURF_API_KEY'] },
  { id: 'custom', label: '+ Add Custom Provider', icon: '✏️', fields: ['CUSTOM_VOICE_API_KEY', 'CUSTOM_VOICE_ENDPOINT'] },
];

const IMAGE_PROVIDERS = [
  { id: 'imagen', label: 'Google Imagen 3', icon: '🖼️', fields: ['GEMINI_API_KEY'] },
  { id: 'dalle', label: 'OpenAI DALL-E 3', icon: '🎨', fields: ['OPENAI_API_KEY'] },
  { id: 'stable_diffusion', label: 'Stable Diffusion (Fal.ai)', icon: '🌈', fields: ['FAL_API_KEY'] },
  { id: 'midjourney', label: 'Midjourney (via API)', icon: '🏔️', fields: ['MJ_API_KEY', 'MJ_SERVER_ID', 'MJ_CHANNEL_ID'] },
  { id: 'ideogram', label: 'Ideogram', icon: '💡', fields: ['IDEOGRAM_API_KEY'] },
  { id: 'custom', label: '+ Add Custom Provider', icon: '✏️', fields: ['CUSTOM_IMAGE_API_KEY', 'CUSTOM_IMAGE_ENDPOINT'] },
];

// ─── Types ───────────────────────────────────────────────────────────────
interface ProviderConfig {
  selectedId: string;
  customName?: string;
  keys: Record<string, string>;
  testStatus: 'idle' | 'testing' | 'ok' | 'error';
  testMsg?: string;
}

interface AllProviders {
  ai: ProviderConfig;
  video: ProviderConfig;
  voice: ProviderConfig;
  image: ProviderConfig;
}

function makeDefault(providers: typeof AI_PROVIDERS): ProviderConfig {
  return { selectedId: providers[0].id, keys: {}, testStatus: 'idle' };
}

// ─── ProviderCard Component ────────────────────────────────────────────
function ProviderCard({
  title, emoji, providers, config,
  onSelect, onKeyChange, onTest, onCustomName,
}: {
  title: string; emoji: string;
  providers: typeof AI_PROVIDERS;
  config: ProviderConfig;
  onSelect: (id: string) => void;
  onKeyChange: (field: string, val: string) => void;
  onTest: () => void;
  onCustomName?: (name: string) => void;
}) {
  const selected = providers.find(p => p.id === config.selectedId) || providers[0];
  const isCustom = config.selectedId === 'custom';

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
        {config.testStatus === 'ok' && <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ Verified</span>}
        {config.testStatus === 'error' && <span className="badge badge-red" style={{ marginLeft: 'auto' }}>✗ Failed</span>}
        {config.testStatus === 'idle' && config.selectedId !== 'custom' && Object.keys(config.keys).length > 0 && (
          <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>Not verified</span>
        )}
      </div>

      {/* Provider dropdown */}
      <div className="form-group" style={{ marginBottom: 14 }}>
        <label className="form-label">Provider</label>
        <select
          className="form-input form-select"
          value={config.selectedId}
          onChange={e => onSelect(e.target.value)}
        >
          {providers.map(p => (
            <option key={p.id} value={p.id}>{p.icon} {p.label}</option>
          ))}
        </select>
      </div>

      {/* Custom provider name field */}
      {isCustom && onCustomName && (
        <div className="form-group" style={{ marginBottom: 14, animation: 'fadeIn 0.3s ease' }}>
          <label className="form-label">Custom Provider Name</label>
          <input
            className="form-input"
            placeholder="e.g. My Private AI Server"
            value={config.customName || ''}
            onChange={e => onCustomName(e.target.value)}
          />
          <span className="form-hint">Give it a name to identify it in logs</span>
        </div>
      )}

      {/* API key fields for selected provider */}
      {selected.fields.map(field => (
        <div key={field} className="form-group" style={{ marginBottom: 14, animation: 'fadeIn 0.2s ease' }}>
          <label className="form-label">{field.replace(/_/g, ' ')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              type="password"
              placeholder={field.includes('URL') || field.includes('ENDPOINT') ? 'https://api.example.com/v1' : 'sk-••••••••••••••••••••'}
              value={config.keys[field] || ''}
              onChange={e => onKeyChange(field, e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
          </div>
        </div>
      ))}

      {/* Test + Save */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onTest}
          disabled={config.testStatus === 'testing'}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {config.testStatus === 'testing' ? (
            <><span className="animate-spin" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--text-secondary)', borderRadius: '50%' }} /> Testing...</>
          ) : '⚡ Test Connection'}
        </button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          💾 Save
        </button>
      </div>

      {config.testMsg && (
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: config.testStatus === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${config.testStatus === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: 12, color: config.testStatus === 'ok' ? 'var(--green-400)' : 'var(--red-400)', animation: 'fadeIn 0.3s ease' }}>
          {config.testMsg}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AIProvidersPage() {
  const [configs, setConfigs] = useState<AllProviders>({
    ai: makeDefault(AI_PROVIDERS),
    video: makeDefault(VIDEO_PROVIDERS),
    voice: makeDefault(VOICE_PROVIDERS),
    image: makeDefault(IMAGE_PROVIDERS),
  });

  const [mockMode, setMockMode] = useState(true);
  const [saved, setSaved] = useState(false);

  function updateProvider(
    service: keyof AllProviders,
    patch: Partial<ProviderConfig>
  ) {
    setConfigs(prev => ({ ...prev, [service]: { ...prev[service], ...patch } }));
  }

  function handleSelect(service: keyof AllProviders, id: string) {
    updateProvider(service, { selectedId: id, keys: {}, testStatus: 'idle', testMsg: undefined });
  }

  function handleKeyChange(service: keyof AllProviders, field: string, val: string) {
    updateProvider(service, {
      keys: { ...configs[service].keys, [field]: val },
      testStatus: 'idle',
    });
  }

  async function handleTest(service: keyof AllProviders) {
    updateProvider(service, { testStatus: 'testing', testMsg: undefined });
    await new Promise(r => setTimeout(r, 1800));
    const hasKeys = Object.values(configs[service].keys).some(v => v.length > 0);
    if (mockMode || hasKeys) {
      updateProvider(service, { testStatus: 'ok', testMsg: `✓ Connection successful! Provider responded in 312ms.` });
    } else {
      updateProvider(service, { testStatus: 'error', testMsg: `✗ API key is missing or invalid. Please enter a valid key.` });
    }
  }

  function handleSaveAll() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const serviceMap: Array<{ key: keyof AllProviders; title: string; emoji: string; providers: typeof AI_PROVIDERS }> = [
    { key: 'ai', title: 'AI / Research & Script Provider', emoji: '🧠', providers: AI_PROVIDERS },
    { key: 'video', title: 'Video Generation Provider', emoji: '🎬', providers: VIDEO_PROVIDERS },
    { key: 'voice', title: 'Voice / TTS Provider', emoji: '🎙️', providers: VOICE_PROVIDERS },
    { key: 'image', title: 'Image Generation Provider', emoji: '🖼️', providers: IMAGE_PROVIDERS },
  ];

  return (
    <div style={{ maxWidth: 900, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>AI Provider Configuration</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Choose your preferred AI provider for each service. You can use different providers — e.g. OpenAI for scripts but Runway for videos.
        </p>
      </div>

      {/* Mock mode toggle */}
      <div className="card" style={{ marginBottom: 24, border: mockMode ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(34,197,94,0.3)', background: mockMode ? 'rgba(249,115,22,0.03)' : 'rgba(34,197,94,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {mockMode ? '🧪 Mock Mode Active' : '🚀 Real API Mode Active'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {mockMode
                ? 'AI providers are simulated. No real API calls — no costs. Perfect for testing UI.'
                : 'Real API keys are being used. Actual generation will occur and costs will apply.'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: mockMode ? 'var(--orange-400)' : 'var(--green-400)' }}>
              {mockMode ? 'MOCK' : 'LIVE'}
            </span>
            <label className="toggle toggle-lg">
              <input type="checkbox" checked={!mockMode} onChange={e => setMockMode(!e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Provider cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {serviceMap.map(svc => (
          <ProviderCard
            key={svc.key}
            title={svc.title}
            emoji={svc.emoji}
            providers={svc.providers}
            config={configs[svc.key]}
            onSelect={id => handleSelect(svc.key, id)}
            onKeyChange={(field, val) => handleKeyChange(svc.key, field, val)}
            onTest={() => handleTest(svc.key)}
            onCustomName={name => updateProvider(svc.key, { customName: name })}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Active Configuration Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {serviceMap.map(svc => {
            const sel = svc.providers.find(p => p.id === configs[svc.key].selectedId);
            const isVerified = configs[svc.key].testStatus === 'ok';
            return (
              <div key={svc.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                <span style={{ fontSize: 18 }}>{svc.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{svc.title.split('/')[0].trim()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {configs[svc.key].selectedId === 'custom'
                      ? configs[svc.key].customName || 'Custom Provider'
                      : sel?.label}
                  </div>
                </div>
                <span className={`badge ${isVerified ? 'badge-green' : mockMode ? 'badge-orange' : 'badge-gray'}`} style={{ fontSize: 9 }}>
                  {isVerified ? 'Verified' : mockMode ? 'Mock' : 'Not tested'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn btn-secondary">Reset All</button>
        <button className="btn btn-primary btn-lg" onClick={handleSaveAll} style={{ gap: 8 }}>
          {saved ? '✓ Saved!' : '💾 Save All Providers'}
        </button>
      </div>
    </div>
  );
}
