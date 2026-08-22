/**
 * Video Provider — abstraction layer for video generation APIs.
 * Mock: Simulates progress for UI testing.
 * Veo: Google Veo 3.1 via Gemini API (requires GEMINI_API_KEY and billing).
 */
import type { VideoProvider, VideoSettings, VideoOperationStatus, ScriptScene } from '../providers';

const DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

export class MockVideoProvider implements VideoProvider {
  private jobs: Map<string, { progress: number; started: number }> = new Map();

  async generateVideo(scenes: ScriptScene[], settings: VideoSettings): Promise<{ operationId: string }> {
    const operationId = `mock_video_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.jobs.set(operationId, { progress: 0, started: Date.now() });
    return { operationId };
  }

  async checkStatus(operationId: string): Promise<VideoOperationStatus> {
    await DELAY(300);
    const job = this.jobs.get(operationId);
    if (!job) return { status: 'failed', progress: 0, error: 'Job not found' };

    const elapsed = (Date.now() - job.started) / 1000; // seconds
    const progress = Math.min(100, Math.floor(elapsed * 5)); // 5% per second, done in 20s
    this.jobs.set(operationId, { ...job, progress });

    if (progress >= 100) {
      return {
        status: 'completed',
        progress: 100,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      };
    }
    return { status: 'processing', progress };
  }

  async downloadVideo(operationId: string): Promise<string> {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
}

export class VeoProvider implements VideoProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateVideo(scenes: ScriptScene[], settings: VideoSettings): Promise<{ operationId: string }> {
    /**
     * Google Veo 3.1 via Gemini API
     * POST https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:generateVideo
     *
     * TODO: Implement when Google Veo API is generally available.
     * The API uses an async operation pattern:
     * 1. POST request returns an operation ID
     * 2. Poll GET /operations/{id} until done
     * 3. Download from operation.response.videoUri
     */
    throw new Error('VeoProvider: Implement with GEMINI_API_KEY. See https://ai.google.dev/api/generate-content#veo');
  }

  async checkStatus(operationId: string): Promise<VideoOperationStatus> {
    throw new Error('VeoProvider: Not yet implemented');
  }

  async downloadVideo(operationId: string): Promise<string> {
    throw new Error('VeoProvider: Not yet implemented');
  }
}

export function createVideoProvider(): VideoProvider {
  if (process.env.MOCK_PROVIDERS === 'true' || !process.env.GEMINI_API_KEY) {
    return new MockVideoProvider();
  }
  return new VeoProvider(process.env.GEMINI_API_KEY!);
}
