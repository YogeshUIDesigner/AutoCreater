import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';
import { createAIProvider } from '@/services/ai';
import { createVideoProvider } from '@/services/video';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, niche, language, tone, audience, contentTypes, platforms, videoSettings, carouselSettings, schedule } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Create the job
    const job = mockStore.createJob({
      userId: 'user_1', // TODO: get from session
      title: topic,
      niche: niche || 'General',
      language: language || 'English',
      contentTypes: contentTypes || ['long_video'],
      platforms: platforms || ['youtube'],
    });

    // Start async pipeline (in production this would push to BullMQ)
    runPipeline(job.id, { topic, niche, language, tone, audience, videoSettings, carouselSettings }).catch(err => {
      mockStore.updateJob(job.id, { status: 'FAILED', error: err.message });
    });

    return NextResponse.json({ jobId: job.id, status: 'QUEUED' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = 'user_1'; // TODO: from session
  mockStore.seedMockJobs();
  const jobs = mockStore.getAllJobs(userId);
  return NextResponse.json({ jobs });
}

// Simulated pipeline runner
async function runPipeline(jobId: string, params: Record<string, unknown>) {
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
  const aiProvider = createAIProvider();
  const videoProvider = createVideoProvider();

  const stages: Array<{ name: string; status: string; progress: number; action: () => Promise<void> }> = [
    { name: 'Research', status: 'RESEARCHING', progress: 15, action: async () => {
      await aiProvider.researchTopic(params.niche as string || 'General', params.language as string || 'English');
    }},
    { name: 'Scripting', status: 'SCRIPTING', progress: 30, action: async () => {
      await aiProvider.generateScript(params.topic as string, {
        duration: 10, tone: params.tone as string || 'Professional',
        language: params.language as string || 'English',
        audience: params.audience as string || 'General',
        style: 'Cinematic',
      });
    }},
    { name: 'Generating', status: 'GENERATING', progress: 60, action: async () => {
      await delay(2000); // Simulate voice + image generation
    }},
    { name: 'Rendering', status: 'RENDERING', progress: 85, action: async () => {
      await delay(3000); // Simulate video render
    }},
  ];

  for (const stage of stages) {
    mockStore.updateJob(jobId, { status: stage.status as Parameters<typeof mockStore.updateJob>[1]['status'], progress: stage.progress });
    mockStore.addLog(jobId, `Starting ${stage.name}...`);
    await stage.action();
    mockStore.addLog(jobId, `${stage.name} completed`);
  }

  mockStore.updateJob(jobId, { status: 'READY', progress: 100 });
  mockStore.addLog(jobId, 'Content package ready for review');
}
