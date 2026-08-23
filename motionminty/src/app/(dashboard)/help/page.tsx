export default function HelpPage() {
  const faqs = [
    { q: 'How does the automation work?', a: 'Once you enable automation, Auto Creator runs a pipeline every day: it researches trending topics in your niche, generates scripts, creates voiceovers, renders videos, makes carousels, generates shorts, and publishes everything to your connected platforms automatically.' },
    { q: 'Which video AI provider is used?', a: 'We use Google Veo 3.1 via the Gemini API for video generation. The provider architecture is abstracted, meaning we can switch providers without rewriting the app.' },
    { q: 'How do I connect my YouTube channel?', a: 'Go to Channels → Click "Connect YouTube" → Sign in with your Google account → Authorize Auto Creator. We use OAuth 2.0 and never store your password.' },
    { q: 'Can I review content before it publishes?', a: 'Yes. In the Queue page, any READY content can be reviewed and approved before publishing. You can also enable "Quality Check" in Automation settings to add a manual review step.' },
    { q: 'What happens if a job fails?', a: 'Failed jobs appear in the Queue under the Failed tab and in the Dashboard. You can retry them manually, or enable Auto-Retry in Automation settings (up to 3 attempts).' },
    { q: 'How do video credits work?', a: 'Each content package consumes 1 video credit for the long video + 0.5 for each short/reel. Image generation uses separate image credits. Check your usage in the Billing page.' },
  ];

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
        {[
          { icon: '📚', title: 'Documentation', desc: 'Full API and platform docs' },
          { icon: '🎬', title: 'Video Tutorials', desc: 'Step-by-step walkthroughs' },
          { icon: '💬', title: 'Live Chat', desc: 'Chat with our support team' },
          { icon: '📧', title: 'Email Support', desc: 'support@autocreator.ai' },
        ].map((r, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Q: {faq.q}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
