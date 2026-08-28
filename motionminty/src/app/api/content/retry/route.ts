import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Re-importing runPipeline logic since this is a quick mock. 
// In production, this would just push the jobId back to BullMQ/Redis.
import { createAIProvider } from '@/services/ai';
import { publishToFacebook, publishToInstagram } from '@/services/social';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const job = mockStore.getJob(jobId);
    if (!job || job.userId !== userId) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Reset job
    mockStore.updateJob(jobId, { status: 'QUEUED', progress: 0, error: undefined });
    mockStore.addLog(jobId, 'Job retried by user');

    // Fetch user channels
    const channels = await prisma.channel.findMany({
      where: { userId, connected: true },
    });

    // Re-run pipeline asynchronously
    runPipeline(jobId, {
      topic: job.title,
      niche: job.niche,
      language: job.language,
      platforms: job.platforms,
    }, channels).catch(err => {
      mockStore.updateJob(jobId, { status: 'FAILED', error: err.message });
      mockStore.addLog(jobId, `Pipeline failed: ${err.message}`);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Retry error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Copy of the simulated pipeline runner for the retry route
async function runPipeline(jobId: string, params: Record<string, any>, channels: any[]) {
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
  const aiProvider = createAIProvider();
  
  const TEST_IMAGE_URL = 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg';
  const generatedCaption = `Exploring ${params.topic}! 🚀\n\nAI is transforming everything. Let us know your thoughts below! 👇\n\n#${(params.topic as string).split(' ')[0].replace(/[^a-zA-Z]/g, '')} #AI #Tech #MotionMinty`;

  const stages: Array<{ name: string; status: string; progress: number; action: () => Promise<void> }> = [
    { name: 'Research', status: 'RESEARCHING', progress: 15, action: async () => {
      await aiProvider.researchTopic(params.niche as string || 'General', params.language as string || 'English');
    }},
    { name: 'Scripting', status: 'SCRIPTING', progress: 30, action: async () => {
      await delay(1000);
    }},
    { name: 'Generating Media', status: 'GENERATING', progress: 60, action: async () => {
      await delay(2000);
    }},
    { name: 'Rendering Video', status: 'RENDERING', progress: 85, action: async () => {
      await delay(2000);
    }},
    { name: 'Publishing', status: 'PUBLISHING', progress: 95, action: async () => {
      const platforms = params.platforms as string[] || [];
      
      if (platforms.includes('facebook')) {
        const fbChannel = channels.find(c => c.platform === 'FACEBOOK');
        if (fbChannel) {
          mockStore.addLog(jobId, `Publishing to Facebook Page: ${fbChannel.handle}...`);
          const result = await publishToFacebook(fbChannel.accountId, fbChannel.accessToken, generatedCaption, TEST_IMAGE_URL);
          if (result.success) {
            mockStore.addLog(jobId, `✅ Successfully published to Facebook! (ID: ${result.id})`);
          } else {
            mockStore.addLog(jobId, `❌ Failed to publish to Facebook: ${result.error}`);
            throw new Error(`Facebook API Error: ${result.error}`);
          }
        }
      }

      if (platforms.includes('instagram')) {
        const igChannel = channels.find(c => c.platform === 'INSTAGRAM');
        if (igChannel) {
          mockStore.addLog(jobId, `Publishing to Instagram: ${igChannel.handle}...`);
          const result = await publishToInstagram(igChannel.accountId, igChannel.accessToken, generatedCaption, TEST_IMAGE_URL);
          if (result.success) {
            mockStore.addLog(jobId, `✅ Successfully published to Instagram! (ID: ${result.id})`);
          } else {
            mockStore.addLog(jobId, `❌ Failed to publish to Instagram: ${result.error}`);
            throw new Error(`Instagram API Error: ${result.error}`);
          }
        }
      }
    }},
  ];

  for (const stage of stages) {
    mockStore.updateJob(jobId, { status: stage.status as any, progress: stage.progress });
    mockStore.addLog(jobId, `Starting ${stage.name}...`);
    await stage.action();
    mockStore.addLog(jobId, `${stage.name} completed`);
  }

  mockStore.updateJob(jobId, { status: 'PUBLISHED', progress: 100 });
  mockStore.addLog(jobId, '🎉 Content successfully generated and published!');
}
