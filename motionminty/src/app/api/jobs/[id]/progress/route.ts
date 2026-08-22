import { NextRequest } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let lastProgress = -1;
      let attempts = 0;
      const maxAttempts = 120; // 2 minutes max

      while (attempts < maxAttempts) {
        const job = mockStore.getJob(id);

        if (!job) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Job not found' })}\n\n`));
          controller.close();
          return;
        }

        if (job.progress !== lastProgress) {
          lastProgress = job.progress;
          const event = {
            jobId: id,
            status: job.status,
            progress: job.progress,
            logs: job.logs.slice(-5), // last 5 log entries
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }

        if (job.status === 'PUBLISHED' || job.status === 'READY' || job.status === 'FAILED') {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, status: job.status })}\n\n`));
          controller.close();
          return;
        }

        await new Promise(r => setTimeout(r, 1000)); // Poll every second
        attempts++;
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Timeout' })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
