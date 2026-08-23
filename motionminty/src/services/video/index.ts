/**
 * Video Provider — abstraction layer for video generation APIs.
 * Mock: Simulates progress for UI testing.
 * Veo: Google Veo 3.1 via Gemini API (requires GEMINI_API_KEY and billing).
 */
import type { VideoProvider, VideoSettings, VideoOperationStatus, ScriptScene } from '../providers';
import { runVideoEngine } from './engine/index';
import path from 'path';
import fs from 'fs';

const DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

export class FFmpegVideoEngine implements VideoProvider {
  private jobs: Map<string, { progress: number; status: 'processing' | 'completed' | 'failed'; videoUrl?: string }> = new Map();

  async generateVideo(scenes: ScriptScene[], settings: VideoSettings): Promise<{ operationId: string }> {
    const operationId = `engine_${Date.now()}`;
    this.jobs.set(operationId, { progress: 0, status: 'processing' });

    // Combine all scene text to form the full script
    const fullScript = scenes.map(s => s.narratorText).join('. ');
    const keywords = scenes.map(s => s.visualPrompt);
    const format = settings.aspectRatio === '9:16' ? 'shorts' : 'long';

    // Start engine asynchronously in the background
    runVideoEngine({ operationId, script: fullScript, keywords, format })
      .then((finalPath) => {
        // Update job as completed. (We return the local path, in production this should be a public URL).
        this.jobs.set(operationId, { progress: 100, status: 'completed', videoUrl: finalPath });
      })
      .catch((err) => {
        console.error('[VideoProvider] Engine failed:', err);
        this.jobs.set(operationId, { progress: 0, status: 'failed' });
      });

    return { operationId };
  }

  async checkStatus(operationId: string): Promise<VideoOperationStatus> {
    const job = this.jobs.get(operationId);
    if (!job) return { status: 'failed', progress: 0, error: 'Job not found' };

    // Simulate progress while it's processing
    if (job.status === 'processing') {
      const newProgress = Math.min(95, job.progress + 5);
      this.jobs.set(operationId, { ...job, progress: newProgress });
      return { status: 'processing', progress: newProgress };
    }

    if (job.status === 'completed') {
      return { status: 'completed', progress: 100, videoUrl: job.videoUrl };
    }

    return { status: 'failed', progress: 0, error: 'Engine rendering failed' };
  }

  async downloadVideo(operationId: string): Promise<string> {
    const job = this.jobs.get(operationId);
    if (!job || !job.videoUrl) throw new Error('Video not ready or job failed');
    return job.videoUrl;
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
    return new FFmpegVideoEngine();
  }
  return new VeoProvider(process.env.GEMINI_API_KEY!);
}
